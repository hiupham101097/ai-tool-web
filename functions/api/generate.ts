import { SpecSchema } from "../../shared/schema";
import { SYSTEM_PROMPT } from "./_prompt";

interface Env {
  DB: D1Database;
  GEMINI_API_KEY: string;
  TURNSTILE_SECRET?: string;
}

const MODEL = "gemini-2.5-flash";
const MAX_PROMPT = 1500;
const RATE_LIMIT = 10;          // số lần / giờ / IP
const enc = new TextEncoder();

async function rateLimited(env: Env, ip: string) {
  const window = Math.floor(Date.now() / 3_600_000);
  await env.DB.prepare(
    `INSERT INTO rate_limits (ip, window, count) VALUES (?, ?, 1)
     ON CONFLICT(ip, window) DO UPDATE SET count = count + 1`
  ).bind(ip, window).run();
  const row = await env.DB.prepare("SELECT count FROM rate_limits WHERE ip = ? AND window = ?")
    .bind(ip, window).first<{ count: number }>();
  return (row?.count ?? 0) > RATE_LIMIT;
}

async function callGemini(env: Env, prompt: string, currentSpec: unknown, retryHint?: string) {
  const userText = JSON.stringify({ prompt, currentSpec, ...(retryHint ? { lastError: retryHint } : {}) });
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userText }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data: any = await res.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json().catch(() => null)) as
    | { projectId?: string; prompt?: string; currentSpec?: unknown }
    | null;
  const prompt = body?.prompt?.trim();
  const projectId = body?.projectId;
  if (!prompt || !projectId || prompt.length > MAX_PROMPT) {
    return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "local";
  if (await rateLimited(env, ip)) {
    return Response.json({ error: "Bạn thử quá nhiều lần, vui lòng quay lại sau." }, { status: 429 });
  }

  const { readable, writable } = new TransformStream();
  const w = writable.getWriter();
  const send = (event: string, data: unknown) =>
    w.write(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

  (async () => {
    try {
      await send("step", { id: "analyze" });
      await env.DB.prepare("INSERT OR IGNORE INTO projects (id, name) VALUES (?, ?)")
        .bind(projectId, prompt.slice(0, 60)).run();
      await env.DB.prepare("INSERT INTO messages (project_id, role, content) VALUES (?, 'user', ?)")
        .bind(projectId, prompt).run();

      await send("step", { id: "design" });
      let raw = await callGemini(env, prompt, body?.currentSpec);

      await send("step", { id: "content" });
      let parsed = SpecSchema.safeParse(raw);
      if (!parsed.success) {
        // retry một lần kèm thông báo lỗi
        raw = await callGemini(env, prompt, body?.currentSpec, parsed.error.message.slice(0, 800));
        parsed = SpecSchema.safeParse(raw);
      }
      if (!parsed.success) throw new Error("Spec không hợp lệ");

      await send("step", { id: "validate" });
      const version = Date.now();
      await env.DB.prepare("INSERT INTO templates (project_id, version, spec) VALUES (?, ?, ?)")
        .bind(projectId, version, JSON.stringify(parsed.data)).run();
      await env.DB.prepare("INSERT INTO messages (project_id, role, content) VALUES (?, 'assistant', ?)")
        .bind(projectId, `Đã tạo phiên bản ${version}`).run();

      await send("done", { projectId, spec: parsed.data });
    } catch (e) {
      console.error(e);
      await send("error", { message: "Không tạo được website, vui lòng thử lại." });
    } finally {
      await w.close();
    }
  })();

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "X-Accel-Buffering": "no" },
  });
};
