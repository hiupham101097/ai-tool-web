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
            badge: "✨ Không Gian Acoustic Ấm Áp",
            title: "Cà Phê Mộc – Nơi Hương Vị Tìm Thấy Sự Bình Yên",
            subtitle: "Trải nghiệm từng giọt cà phê Arabica & Robusta rang mộc thủ công, hòa cùng tiếng đàn acoustic dịu êm giữa lòng thành phố.",
            cta: "Đặt bàn giữ chỗ",
            secondaryCta: "Xem thực đơn",
            image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
            align: "left",
          },
        },
        {
          type: "cards",
          props: {
            heading: "Hương Vị Đặc Trưng Nhất",
            subheading: "Được pha chế tinh tế từ những hạt cà phê thượng hạng thu hoạch tại Cầu Đất, Đà Lạt",
            items: [
              {
                title: "Cà phê Muối Cố Đô",
                desc: "Vị mằn mặn béo ngậy của lớp kem muối sánh mịn hòa quyện hoàn hảo cùng cốt cà phê thơm lừng.",
                badge: "Bán chạy nhất",
                image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                icon: "☕",
              },
              {
                title: "Cold Brew Cam Vàng",
                desc: "Cà phê ủ lạnh 18 tiếng kết hợp cùng lát cam vàng mọng nước, mang đến vị chua thanh sảng khoái.",
                badge: "Signature",
                image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
                icon: "🍊",
              },
              {
                title: "Bạc Xỉu Sữa Hạnh Nhân",
                desc: "Vị bùi béo tự nhiên từ hạt hạnh nhân nguyên chất, ít ngọt, lành mạnh và dễ chịu cho buổi sáng.",
                badge: "Mới",
                image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
                icon: "🥛",
              },
            ],
          },
        },
        {
          type: "gallery",
          props: {
            heading: "Không Gian & Kỷ Niệm Tại Mộc",
            subheading: "Từng góc nhỏ đều mang đến sự thư thái để bạn làm việc, đọc sách hay trò chuyện cùng bạn bè",
            items: [
              { image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80", title: "Quầy Bar Pha Chế Thủ Công", desc: "Mùi hương cà phê lan tỏa suốt ngày dài" },
              { image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80", title: "Hạt Cà Phê Chọn Lọc", desc: "Rang xay mộc chuẩn từng mẻ" },
              { image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80", title: "Góc Acoustic Cuối Tuần", desc: "Giai điệu mộc mạc và gần gũi" },
            ],
          },
        },
        {
          type: "table",
          props: {
            heading: "Bảng Giá Đồ Uống",
            subheading: "Giá đã bao gồm dịch vụ và không gian trải nghiệm",
            columns: ["Tên món đồ uống", "Size Vừa (M)", "Size Lớn (L)"],
            rows: [
              ["Cà phê truyền thống (Đen / Nâu đá)", "35.000đ", "45.000đ"],
              ["Cà phê Muối Cố Đô đặc biệt", "42.000đ", "52.000đ"],
              ["Cold Brew Trái Cây Nhiệt Đới", "48.000đ", "58.000đ"],
              ["Trà Ô Long Sen Vàng Thơm Bùi", "45.000đ", "55.000đ"],
              ["Bánh Croissant Bơ Pháp Nóng Hổi", "38.000đ", "-"],
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Đặt Bàn Trước – Giữ Chỗ Đẹp",
            subheading: "Chúng tôi sẽ chuẩn bị sẵn vị trí yêu thích của bạn trước giờ hẹn",
            submitLabel: "Xác nhận đặt bàn",
            fields: [
              { label: "Họ và tên của bạn", type: "text" },
              { label: "Số điện thoại nhận tin nhắn", type: "tel" },
              { label: "Thời gian & Số lượng khách (hoặc yêu cầu acoustic)", type: "textarea" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: "© 2026 Cà Phê Mộc. Mở cửa từ 07:00 đến 22:30 mỗi ngày. Hotline đặt chỗ: 0987 654 321.",
            links: [
              { label: "Facebook Fanpage", href: "#" },
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
            badge: "🔥 Ưu đãi thành viên mới: Giảm 50%",
            title: "Bứt Phá Giới Hạn Bản Thân Cùng Titan Fitness",
            subtitle: "Hệ thống phòng tập chuẩn 5 sao với dàn máy móc nhập khẩu nguyên chiếc và đội ngũ huấn luyện viên chuyên nghiệp hàng đầu.",
            cta: "Đăng ký tập thử 7 ngày",
            secondaryCta: "Xem bảng giá gói",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
            align: "left",
          },
        },
        {
          type: "cards",
          props: {
            heading: "Bộ Môn & Tiện Ích Cao Cấp",
            subheading: "Môi trường tập luyện truyền cảm hứng và giúp bạn kiên định với mục tiêu sức khỏe",
            items: [
              {
                title: "Gym & Strength Training",
                desc: "Hơn 100+ thiết bị tạ đơn, giàn tạ khối cao cấp chuẩn thi đấu quốc tế.",
                badge: "Phổ biến",
                image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                icon: "🏋️",
              },
              {
                title: "Yoga & Pilates Studio",
                desc: "Phòng tập tĩnh tâm, cách âm với sàn gỗ tự nhiên và giảng viên hướng dẫn tận tình.",
                badge: "Thư giãn",
                image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
                icon: "🧘",
              },
              {
                title: "Huấn Luyện Viên 1:1 (PT)",
                desc: "Giám sát từng nhịp thở, thiết kế giáo trình tập và thực đơn dinh dưỡng riêng biệt.",
                badge: "Hiệu quả 100%",
                image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
                icon: "⚡",
              },
            ],
          },
        },
        {
          type: "gallery",
          props: {
            heading: "Cơ Sở Vật Chất Chuẩn 5 Sao",
            subheading: "Không gian thoáng đãng, lọc khí ion âm và phòng tắm xông hơi sang trọng",
            items: [
              { image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", title: "Khu Vực Free Weights", desc: "Tạ đòn và sàn cao su giảm chấn" },
              { image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80", title: "Dàn Máy Cardio", desc: "Máy chạy bộ kết nối màn hình thông minh" },
              { image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80", title: "Lớp Yoga Bình Minh", desc: "Cân bằng năng lượng và giảm căng thẳng" },
            ],
          },
        },
        {
          type: "table",
          props: {
            heading: "Bảng Giá Gói Hội Viên Ưu Đãi",
            columns: ["Gói hội viên", "Thời hạn", "Quyền lợi chi tiết", "Chi phí"],
            rows: [
              ["Gói Khởi Động", "1 Tháng", "Toàn quyền tập gym, tủ đồ riêng, phòng xông hơi", "499.000đ"],
              ["Gói Bứt Phá", "6 Tháng", "Gym + Tham gia tất cả lớp Yoga, Tặng 2 buổi PT 1:1", "2.490.000đ"],
              ["Gói VIP Toàn Năng", "12 Tháng", "Tất cả quyền lợi, Khăn tập riêng mỗi ngày, Đưa đón", "4.200.000đ"],
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Đăng Ký Nhận Vé Tập Thử Miễn Phí",
            subheading: "Nhận ngay 7 ngày trải nghiệm không giới hạn cùng huấn luyện viên",
            submitLabel: "Nhận vé tập thử ngay",
            fields: [
              { label: "Họ và tên", type: "text" },
              { label: "Số điện thoại", type: "tel" },
              { label: "Mục tiêu tập luyện (Tăng cơ / Giảm mỡ / Cải thiện sức bền)", type: "text" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: "© 2026 Titan Fitness & Yoga Center. Mở cửa 05:30 - 22:00 tất cả các ngày trong tuần.",
            links: [
              { label: "Lịch lớp Yoga", href: "#" },
              { label: "Đội ngũ Huấn luyện viên", href: "#" },
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
          badge: "🚀 Giải Pháp Số 1 Dành Cho Bạn",
          title: prompt.length > 55 ? prompt.slice(0, 52) + "..." : prompt,
          subtitle: "Chúng tôi giúp bạn hiện thực hóa ý tưởng nhanh chóng với trải nghiệm vượt trội, thẩm mỹ hiện đại và hiệu quả cao nhất.",
          cta: "Khám phá ngay",
          secondaryCta: "Tư vấn miễn phí",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          align: "left",
        },
      },
      {
        type: "cards",
        props: {
          heading: "Giá Trị Khác Biệt Chúng Tôi Mang Lại",
          subheading: "Được xây dựng với tiêu chuẩn khắt khe để mang lại sự hài lòng tối đa cho khách hàng",
          items: [
            {
              title: "Tốc Độ Triển Khai",
              desc: "Tiết kiệm 80% thời gian với quy trình tối ưu hóa và công nghệ tiên tiến nhất.",
              badge: "Nhanh chóng",
              image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
              icon: "⚡",
            },
            {
              title: "Thiết Kế Đột Phá",
              desc: "Chuẩn thẩm mỹ quốc tế, responsive hoàn hảo trên mọi thiết bị máy tính và điện thoại.",
              badge: "Thẩm mỹ cao",
              image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
              icon: "🎨",
            },
            {
              title: "Đồng Hành Bền Vững",
              desc: "Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ kỹ thuật và giải đáp mọi thắc mắc của bạn 24/7.",
              badge: "Tận tâm",
              image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
              icon: "🤝",
            },
          ],
        },
      },
      {
        type: "gallery",
        props: {
          heading: "Dự Án & Thành Tựu Tiêu Biểu",
          items: [
            { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", title: "Nền Tảng Tự Động Hóa" },
            { image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80", title: "Giao Diện Trực Quan" },
            { image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", title: "Hợp Tác Toàn Cầu" },
          ],
        },
      },
      {
        type: "table",
        props: {
          heading: "Bảng So Sánh Các Gói Dịch Vụ",
          columns: ["Hạng mục", "Cơ bản", "Chuyên nghiệp", "Doanh nghiệp lớn"],
          rows: [
            ["Thời gian bàn giao", "3 ngày", "24 giờ", "Ưu tiên tức thì"],
            ["Hỗ trợ tư vấn", "Giờ hành chính", "24/7 Đội ngũ riêng", "Chuyên gia 1:1"],
            ["Bảo hành & Cập nhật", "3 tháng", "1 năm", "Trọn đời"],
          ],
        },
      },
      {
        type: "form",
        props: {
          heading: "Liên Hệ Để Được Tư Vấn Ngay",
          subheading: "Để lại thông tin và chuyên viên của chúng tôi sẽ liên hệ lại trong vòng 15 phút",
          submitLabel: "Gửi thông tin liên hệ",
          fields: [
            { label: "Họ và tên của bạn", type: "text" },
            { label: "Số điện thoại / Email", type: "text" },
            { label: "Nội dung cần tư vấn", type: "textarea" },
          ],
        },
      },
      {
        type: "footer",
        props: {
          text: "© 2026 Bản quyền thuộc về doanh nghiệp của bạn. Kiến tạo giá trị tương lai.",
          links: [
            { label: "Chính sách bảo mật", href: "#" },
            { label: "Điều khoản sử dụng", href: "#" },
            { label: "Liên hệ đối tác", href: "#" },
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
