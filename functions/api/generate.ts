import { SpecSchema, type Spec } from "../../shared/schema";
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
    console.warn("Bỏ qua rate-limit do cảnh báo database:", e);
    return false;
  }
}

function createFallbackSpec(prompt: string): Spec {
  const p = prompt.toLowerCase();
  
  if (p.includes("cafe") || p.includes("cà phê") || p.includes("coffee") || p.includes("trà sữa")) {
    return {
      theme: {
        primary: "#b45309",
        background: "#fafaf9",
        text: "#1c1917",
        font: "Be Vietnam Pro",
      },
      sections: [
        {
          type: "hero",
          props: {
            title: "Cà Phê Mộc – Hương Vị Của Sự Tinh Tế",
            subtitle: "Tận hưởng không gian acoustic yên bình cùng những ly cà phê nguyên chất được chọn lọc và rang xay thủ công mỗi ngày.",
            cta: "Đặt bàn giữ chỗ",
            align: "center",
          },
        },
        {
          type: "cards",
          props: {
            heading: "Thực Đơn Nổi Bật",
            items: [
              { title: "Cà phê Muối Cố Đô", desc: "Vị mằn mặn béo ngậy của kem muối hòa quyện cùng cốt cà phê Robusta đậm đà.", badge: "Bán chạy nhất" },
              { title: "Cold Brew Cam Vàng", desc: "Cà phê ủ lạnh 16 tiếng kết hợp cùng lát cam vàng mọng nước, thanh mát sảng khoái.", badge: "Mới" },
              { title: "Bạc Xỉu Sữa Hạt", desc: "Vị béo ngậy tự nhiên từ sữa hạnh nhân nguyên chất, ít ngọt và tốt cho sức khỏe.", badge: "Được yêu thích" },
            ],
          },
        },
        {
          type: "table",
          props: {
            heading: "Bảng Giá Đồ Uống",
            columns: ["Tên đồ uống", "Size Vừa (M)", "Size Lớn (L)"],
            rows: [
              ["Cà phê truyền thống (Đen / Nâu)", "35.000đ", "45.000đ"],
              ["Cà phê Muối béo", "42.000đ", "52.000đ"],
              ["Cold Brew Trái Cây", "48.000đ", "58.000đ"],
              ["Trà Ô Long Sen Vàng", "45.000đ", "55.000đ"],
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Đặt Bàn Trước",
            submitLabel: "Gửi yêu cầu đặt bàn",
            fields: [
              { label: "Họ và tên của bạn", type: "text" },
              { label: "Số điện thoại liên hệ", type: "tel" },
              { label: "Thời gian & Số lượng khách", type: "textarea" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: "© 2026 Cà Phê Mộc. Mở cửa từ 07:00 đến 22:30 hàng ngày. Hotline: 0987 654 321",
            links: [
              { label: "Facebook", href: "#" },
              { label: "Instagram", href: "#" },
              { label: "Chỉ đường Google Maps", href: "#" },
            ],
          },
        },
      ],
    };
  }

  if (p.includes("gym") || p.includes("thể hình") || p.includes("fitness") || p.includes("yoga")) {
    return {
      theme: {
        primary: "#ea580c",
        background: "#090d16",
        text: "#f8fafc",
        font: "Bricolage Grotesque",
      },
      sections: [
        {
          type: "hero",
          props: {
            title: "Bứt Phá Giới Hạn Cùng Titan Fitness",
            subtitle: "Hệ thống phòng tập chuẩn 5 sao với dàn máy móc hiện đại nhập khẩu và đội ngũ huấn luyện viên chuyên nghiệp hàng đầu.",
            cta: "Đăng ký tập thử 7 ngày",
            align: "center",
          },
        },
        {
          type: "cards",
          props: {
            heading: "Dịch Vụ & Bộ Môn Tập Luyện",
            items: [
              { title: "Gym & Bodybuilding", desc: "Trang bị đầy đủ tạ đơn, giàn tạ khối cao cấp chuẩn Olympic.", badge: "Phổ biến" },
              { title: "Yoga & Pilates", desc: "Không gian tĩnh tâm với giảng viên quốc tế hướng dẫn tận tình.", badge: "Thư giãn" },
              { title: "Huấn luyện viên cá nhân 1:1", desc: "Lộ trình dinh dưỡng và bài tập thiết kế riêng theo thể trạng.", badge: "Hiệu quả cao" },
            ],
          },
        },
        {
          type: "table",
          props: {
            heading: "Bảng Giá Các Gói Hội Viên",
            columns: ["Gói tập", "Thời hạn", "Quyền lợi", "Học phí"],
            rows: [
              ["Gói Khởi Động", "1 Tháng", "Toàn quyền tập gym, xông hơi", "499.000đ"],
              ["Gói Bứt Phá", "6 Tháng", "Gym + Toàn bộ lớp Yoga, Tặng 2 buổi PT", "2.490.000đ"],
              ["Gói VIP Toàn Năng", "12 Tháng", "Không giới hạn mọi dịch vụ, khăn tập riêng", "4.200.000đ"],
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Đăng Ký Nhận Ưu Đãi 50%",
            submitLabel: "Nhận vé tập thử miễn phí",
            fields: [
              { label: "Họ và tên", type: "text" },
              { label: "Số điện thoại", type: "tel" },
              { label: "Mục tiêu tập luyện (Giảm cân / Tăng cơ / Sức khỏe)", type: "text" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: "© 2026 Titan Fitness & Yoga Center. Mở cửa 05:30 - 22:00 tất cả các ngày.",
            links: [
              { label: "Bảng lịch học", href: "#" },
              { label: "Đội ngũ HLV", href: "#" },
              { label: "Hotline: 1900 1234", href: "#" },
            ],
          },
        },
      ],
    };
  }

  // Mặc định: Landing page công nghệ / doanh nghiệp hiện đại
  return {
    theme: {
      primary: "#2563eb",
      background: "#ffffff",
      text: "#0f172a",
      font: "Be Vietnam Pro",
    },
    sections: [
      {
        type: "hero",
        props: {
          title: prompt.length > 50 ? prompt.slice(0, 48) + "..." : prompt,
          subtitle: "Giải pháp toàn diện giúp bạn tối ưu hóa hiệu quả, gia tăng doanh số và tạo ấn tượng mạnh mẽ với khách hàng.",
          cta: "Khám phá ngay",
          align: "center",
        },
      },
      {
        type: "cards",
        props: {
          heading: "Giá Trị Cốt Lõi",
          items: [
            { title: "Tốc Độ Vượt Trội", desc: "Triển khai thần tốc chỉ trong ít phút, không làm gián đoạn kế hoạch kinh doanh của bạn.", badge: "Nhanh chóng" },
            { title: "Thiết Kế Đỉnh Cao", desc: "Giao diện hiện đại, chuẩn thẩm mỹ và tối ưu trải nghiệm trên mọi thiết bị di động.", badge: "Chuẩn UI/UX" },
            { title: "Tối Ưu Hóa Chi Phí", desc: "Tiết kiệm tối đa thời gian và chi phí đầu tư ban đầu với hiệu quả sinh lời rõ rệt.", badge: "Tiết kiệm" },
          ],
        },
      },
      {
        type: "table",
        props: {
          heading: "So Sánh Gói Dịch Vụ",
          columns: ["Tính năng", "Cơ bản", "Chuyên nghiệp", "Doanh nghiệp"],
          rows: [
            ["Hỗ trợ tư vấn", "Giờ hành chính", "24/7 Ưu tiên", "Đội ngũ riêng 24/7"],
            ["Thời gian bàn giao", "3 ngày", "24 giờ", "Ngay lập tức"],
            ["Bảo hành & Nâng cấp", "3 tháng", "12 tháng", "Trọn đời"],
          ],
        },
      },
      {
        type: "form",
        props: {
          heading: "Liên Hệ Tư Vấn Trực Tiếp",
          submitLabel: "Gửi thông tin cho chúng tôi",
          fields: [
            { label: "Họ và tên", type: "text" },
            { label: "Email hoặc Số điện thoại", type: "text" },
            { label: "Yêu cầu chi tiết của bạn", type: "textarea" },
          ],
        },
      },
      {
        type: "footer",
        props: {
          text: "© 2026 Doanh nghiệp của bạn. Tự hào mang lại giá trị bền vững cho khách hàng.",
          links: [
            { label: "Chính sách bảo mật", href: "#" },
            { label: "Điều khoản dịch vụ", href: "#" },
            { label: "Liên hệ hợp tác", href: "#" },
          ],
        },
      },
    ],
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
        await send("step", { id: "analyze" });
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

        await send("step", { id: "design" });
        let raw: any;
        let isUsingFallback = false;

        try {
          raw = await callGemini(env, prompt, body?.currentSpec);
        } catch (geminiError: any) {
          const msg = geminiError?.message || "";
          // Nếu bị chặn vị trí địa lý do Google giới hạn IP (Việt Nam/Data center), tự động dùng Smart Fallback để không làm gián đoạn người dùng
          if (msg.includes("location is not supported") || msg.includes("User location") || msg.includes("400")) {
            console.warn("Google Gemini chặn location, kích hoạt bộ sinh Smart Fallback cho:", prompt);
            raw = createFallbackSpec(prompt);
            isUsingFallback = true;
          } else {
            throw geminiError;
          }
        }

        await send("step", { id: "content" });
        let parsed = SpecSchema.safeParse(raw);
        if (!parsed.success && !isUsingFallback) {
          // retry một lần kèm gợi ý lỗi nếu không phải fallback
          raw = await callGemini(env, prompt, body?.currentSpec, parsed.error.message.slice(0, 800));
          parsed = SpecSchema.safeParse(raw);
        }
        if (!parsed.success) {
          // Nếu vẫn lỗi, chuyển sang fallback
          parsed = SpecSchema.safeParse(createFallbackSpec(prompt));
        }
        if (!parsed.success) throw new Error("Cấu trúc website do AI tạo không hợp lệ. Vui lòng thử lại.");

        await send("step", { id: "validate" });
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
