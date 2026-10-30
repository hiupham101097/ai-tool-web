import { SpecSchema, type Spec, type Section } from "../../shared/schema";
import { SYSTEM_PROMPT } from "./_prompt";

interface Env {
  DB?: D1Database;
  GEMINI_API_KEY: string;
  GEMINI_BASE_URL?: string;
  TURNSTILE_SECRET?: string;
}

const MODEL = "gemini-3.8-flash";
const MAX_PROMPT = 1500;
const RATE_LIMIT = 30;          // số lần / giờ / IP
const enc = new TextEncoder();
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function rateLimited(env: Env, ip: string): Promise<boolean> {
  try {
    if (!env.DB) return false;
    const window = Math.floor(Date.now() / 3_600_000);
    await env.DB.prepare(
      `INSERT INTO rate_limits (ip, window, count) VALUES (?, ?, 1)
       ON CONFLICT(ip, window) DO UPDATE SET count = count + 1`
    ).bind(ip, window).run();
    const row = await env.DB.prepare("SELECT count FROM rate_limits WHERE ip = ? AND window = ?")
      .bind(ip, window).first<{ count: number }>();
    return (row?.count ?? 0) > RATE_LIMIT;
  } catch (e) {
    console.warn("Bỏ qua rate-limit do database:", e);
    return false;
  }
}

/**
 * Chuyển đổi linh hoạt mọi định dạng JSON mà Gemini trả về (kể cả products, features, categories, testimonials...)
 * thành Spec chuẩn, đảm bảo không bao giờ bỏ phí kết quả sáng tạo của AI!
 */
function normalizeSpec(raw: any, userPrompt: string): Spec {
  const theme = {
    primary: raw?.theme?.primary || "#2563eb",
    background: raw?.theme?.background || "#ffffff",
    text: raw?.theme?.text || "#0f172a",
    font: raw?.theme?.font || "Be Vietnam Pro",
  };

  const rawSections: any[] = Array.isArray(raw?.sections) ? raw.sections : [];
  const normalizedSections: Section[] = [];

  for (const s of rawSections) {
    if (!s || typeof s !== "object") continue;
    const type = String(s.type || "").toLowerCase();
    const props = s.props || s;

    // 1. HERO section
    if (type === "hero") {
      normalizedSections.push({
        type: "hero",
        props: {
          title: String(props.title || props.heading || userPrompt),
          subtitle: props.subtitle || props.description || props.subheading,
          cta: props.cta || props.primaryCta?.label || props.buttonText || "Khám phá ngay",
          secondaryCta: props.secondaryCta?.label || props.secondaryCta || undefined,
          badge: props.badge || undefined,
          image: props.image || props.imageUrl || undefined,
          align: props.align === "center" ? "center" : "left",
        },
      });
      continue;
    }

    // 2. CTA BANNER (chuyển thành Hero gọn)
    if (type === "cta_banner" || type === "banner") {
      normalizedSections.push({
        type: "hero",
        props: {
          title: String(props.title || "Ưu Đãi Đặc Biệt"),
          subtitle: props.subtitle || props.description,
          cta: props.buttonText || props.cta || "Nhận ưu đãi",
          align: "center",
        },
      });
      continue;
    }

    // 3. PRODUCTS -> Chuyển thành CARDS với hình ảnh và giá
    if (type === "products") {
      const prods: any[] = Array.isArray(props.products) ? props.products : Array.isArray(props.items) ? props.items : [];
      if (prods.length > 0) {
        normalizedSections.push({
          type: "cards",
          props: {
            heading: props.title || props.heading || "Sản Phẩm Nổi Bật",
            subheading: props.subtitle || props.subheading || undefined,
            items: prods.map(p => ({
              title: String(p.name || p.title || "Sản phẩm"),
              desc: p.price ? `Giá: ${p.price}${p.oldPrice ? ` (Gốc: ${p.oldPrice})` : ""}` : (p.desc || p.description),
              image: p.image || p.imageUrl || undefined,
              badge: p.tag || p.badge || p.category || undefined,
              icon: "🛍️",
            })),
          },
        });
      }
      continue;
    }

    // 4. FEATURES -> CARDS
    if (type === "features") {
      const feats: any[] = Array.isArray(props.items) ? props.items : [];
      if (feats.length > 0) {
        normalizedSections.push({
          type: "cards",
          props: {
            heading: props.title || props.heading || "Lợi Ích & Tính Năng",
            subheading: props.subtitle || props.subheading || undefined,
            items: feats.map(f => ({
              title: String(f.title || f.name || "Tính năng"),
              desc: f.description || f.desc || undefined,
              badge: f.badge || undefined,
              icon: f.icon || "✨",
              image: f.image || undefined,
            })),
          },
        });
      }
      continue;
    }

    // 5. CATEGORIES -> GALLERY hoặc CARDS
    if (type === "categories") {
      const cats: any[] = Array.isArray(props.items) ? props.items : [];
      if (cats.length > 0) {
        normalizedSections.push({
          type: "gallery",
          props: {
            heading: props.title || props.heading || "Danh Mục & Bộ Sưu Tập",
            subheading: props.subtitle || props.subheading || undefined,
            items: cats.map(c => ({
              image: c.image || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
              title: c.name || c.title,
              desc: c.count || c.desc,
            })),
          },
        });
      }
      continue;
    }

    // 6. TESTIMONIALS -> CARDS
    if (type === "testimonials" || type === "reviews") {
      const tests: any[] = Array.isArray(props.items) ? props.items : [];
      if (tests.length > 0) {
        normalizedSections.push({
          type: "cards",
          props: {
            heading: props.title || props.heading || "Đánh Giá Của Khách Hàng",
            subheading: props.subtitle || props.subheading || undefined,
            items: tests.map(t => ({
              title: String(t.name || "Khách hàng"),
              desc: `"${t.comment || t.text || t.content || ""}"`,
              badge: t.rating ? `⭐ ${t.rating}/5` : "Khách hàng xác thực",
              icon: "💬",
            })),
          },
        });
      }
      continue;
    }

    // 7. CARDS tiêu chuẩn
    if (type === "cards") {
      const items: any[] = Array.isArray(props.items) ? props.items : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "cards",
          props: {
            heading: props.heading || props.title || undefined,
            subheading: props.subheading || props.subtitle || undefined,
            items: items.map(it => ({
              title: String(it.title || it.name || ""),
              desc: it.desc || it.description || undefined,
              badge: it.badge || undefined,
              image: it.image || undefined,
              icon: it.icon || undefined,
            })),
          },
        });
      }
      continue;
    }

    // 8. GALLERY tiêu chuẩn
    if (type === "gallery") {
      const items: any[] = Array.isArray(props.items) ? props.items : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "gallery",
          props: {
            heading: props.heading || props.title || undefined,
            subheading: props.subheading || props.subtitle || undefined,
            items: items.map(it => ({
              image: String(it.image || it.imageUrl || ""),
              title: it.title || undefined,
              desc: it.desc || it.description || undefined,
            })),
          },
        });
      }
      continue;
    }

    // 9. TABLE tiêu chuẩn
    if (type === "table") {
      normalizedSections.push({
        type: "table",
        props: {
          heading: props.heading || props.title || undefined,
          subheading: props.subheading || props.subtitle || undefined,
          columns: Array.isArray(props.columns) ? props.columns : ["Hạng mục", "Thông tin"],
          rows: Array.isArray(props.rows) ? props.rows : [],
        },
      });
      continue;
    }

    // 10. FORM tiêu chuẩn
    if (type === "form") {
      normalizedSections.push({
        type: "form",
        props: {
          heading: props.heading || props.title || undefined,
          subheading: props.subheading || props.subtitle || undefined,
          submitLabel: props.submitLabel || "Gửi thông tin ngay",
          fields: Array.isArray(props.fields)
            ? props.fields.map((f: any) => ({
                label: String(f.label || "Thông tin"),
                type: ["text", "email", "tel", "textarea"].includes(f.type) ? f.type : "text",
              }))
            : [{ label: "Họ và tên", type: "text" }, { label: "Số điện thoại", type: "tel" }],
        },
      });
      continue;
    }

    // 11. FOOTER
    if (type === "footer") {
      normalizedSections.push({
        type: "footer",
        props: {
          text: String(props.text || props.copyright || props.about || `© 2026. ${userPrompt}`),
          links: Array.isArray(props.links) ? props.links : undefined,
        },
      });
      continue;
    }
  }

  // Nếu thiếu Hero, bổ sung Hero tự động
  if (!normalizedSections.some(s => s.type === "hero")) {
    normalizedSections.unshift({
      type: "hero",
      props: {
        title: userPrompt,
        subtitle: "Giải pháp chất lượng cao đáp ứng trọn vẹn mong đợi của bạn.",
        cta: "Khám phá ngay",
        align: "center",
      },
    });
  }

  // Nếu thiếu Footer, bổ sung Footer
  if (!normalizedSections.some(s => s.type === "footer")) {
    normalizedSections.push({
      type: "footer",
      props: {
        text: `© 2026. Thiết kế riêng theo yêu cầu: "${userPrompt.slice(0, 50)}".`,
      },
    });
  }

  return {
    theme,
    sections: normalizedSections,
  };
}

async function callGemini(env: Env, prompt: string, currentSpec: unknown, retryHint?: string) {
  if (!env.GEMINI_API_KEY) {
    throw new Error("Chưa cấu hình GEMINI_API_KEY trong file .dev.vars");
  }

  const userText = JSON.stringify({ prompt, currentSpec, ...(retryHint ? { lastError: retryHint } : {}) });
  const baseUrl = env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";
  const url = `${baseUrl}/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY.trim())}`;
  
  const res = await fetch(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userText }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    let errMsg = `Gemini API lỗi (${res.status})`;
    try {
      const errJson = JSON.parse(errText);
      if (errJson?.error?.message) {
        errMsg = errJson.error.message;
      }
    } catch {
      if (errText) errMsg += `: ${errText.slice(0, 150)}`;
    }
    throw new Error(errMsg);
  }

  const data: any = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Gemini không trả về nội dung hợp lệ.");
  }
  return JSON.parse(rawText);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json().catch(() => null)) as
      | { projectId?: string; prompt?: string; currentSpec?: unknown }
      | null;
    const prompt = body?.prompt?.trim();
    const projectId = body?.projectId;
    if (!prompt || !projectId || prompt.length > MAX_PROMPT) {
      return Response.json({ error: "Yêu cầu không hợp lệ hoặc vượt quá độ dài." }, { status: 400 });
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "local";
    if (await rateLimited(env, ip)) {
      return Response.json({ error: "Bạn thử quá nhiều lần trong 1 giờ, vui lòng quay lại sau." }, { status: 429 });
    }

    const { readable, writable } = new TransformStream();
    const w = writable.getWriter();
    const send = (event: string, data: unknown) =>
      w.write(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

    (async () => {
      try {
        // Bước 1: Phân tích yêu cầu (cho người dùng thấy AI đang tiếp nhận)
        await send("step", { id: "analyze" });
        await sleep(1200);

        if (env.DB) {
          try {
            await env.DB.prepare("INSERT OR IGNORE INTO projects (id, name) VALUES (?, ?)")
              .bind(projectId, prompt.slice(0, 60)).run();
            await env.DB.prepare("INSERT INTO messages (project_id, role, content) VALUES (?, 'user', ?)")
              .bind(projectId, prompt).run();
          } catch (dbErr) {
            console.warn("Lỗi lưu D1 project:", dbErr);
          }
        }

        // Bước 2: AI suy nghĩ và thiết kế
        await send("step", { id: "design" });
        let raw: any;

        try {
          raw = await callGemini(env, prompt, body?.currentSpec);
        } catch (geminiError: any) {
          console.error("Lỗi gọi Gemini:", geminiError);
          throw new Error(geminiError?.message || "Không thể kết nối với AI Gemini.");
        }

        // Bước 3: Soạn nội dung & chuẩn hóa cấu trúc
        await send("step", { id: "content" });
        await sleep(1000);

        // Chuẩn hóa cấu trúc để luôn tương thích 100% với React Renderer
        const normalized = normalizeSpec(raw, prompt);
        const parsed = SpecSchema.safeParse(normalized);
        if (!parsed.success) {
          console.error("Lỗi validate Spec:", parsed.error);
          throw new Error("Không thể định dạng cấu trúc website do AI tạo.");
        }

        // Bước 4: Kiểm tra và hoàn thiện
        await send("step", { id: "validate" });
        await sleep(800);

        const version = Date.now();
        if (env.DB) {
          try {
            await env.DB.prepare("INSERT INTO templates (project_id, version, spec) VALUES (?, ?, ?)")
              .bind(projectId, version, JSON.stringify(parsed.data)).run();
            await env.DB.prepare("INSERT INTO messages (project_id, role, content) VALUES (?, 'assistant', ?)")
              .bind(projectId, `Đã tạo phiên bản ${version}`).run();
          } catch (dbErr) {
            console.warn("Lỗi lưu D1 template:", dbErr);
          }
        }

        // Hoàn tất!
        await send("done", { projectId, spec: parsed.data });
      } catch (e: any) {
        console.error("Lỗi trong quá trình tạo website:", e);
        await send("error", { message: e?.message ?? "Không thể tạo website, vui lòng thử lại." });
      } finally {
        await w.close();
      }
    })();

    return new Response(readable, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "X-Accel-Buffering": "no" },
    });
  } catch (topErr: any) {
    console.error("Lỗi onRequestPost:", topErr);
    return Response.json({ error: topErr?.message ?? "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
};
