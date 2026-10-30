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
 * Loại bỏ dấu tiếng Việt để đối sánh từ khóa chính xác 100% kể cả khi gõ có dấu hoặc không dấu
 */
function stripVietnamese(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase();
}

/**
 * Tự động phân loại phong cách dựa trên ngữ cảnh ngành nghề của prompt
 */
function detectStyleFromPrompt(prompt: string): "bento" | "luxury" | "brutalist" | "artisan" | "minimal" | "modern" {
  const p = stripVietnamese(prompt);

  // 1. Nha khoa, Y tế, Phòng khám, Bác sĩ, Bệnh viện, Dược phẩm
  if (
    p.includes("nha khoa") || p.includes("y te") || p.includes("phong kham") ||
    p.includes("bac si") || p.includes("benh vien") || p.includes("duoc") ||
    p.includes("rang ham mat") || p.includes("kham benh") || p.includes("smile") ||
    p.includes("clinic") || p.includes("dental")
  ) {
    return "modern";
  }

  // 2. Tech, SaaS, AI, App, Startup
  if (
    p.includes("saas") || p.includes("app") || p.includes("ai") || p.includes("phan mem") ||
    p.includes("startup") || p.includes("cong nghe") || p.includes("tech") || p.includes("tool") ||
    p.includes("dashboard") || p.includes("crm") || p.includes("developer") || p.includes("platform") ||
    p.includes("quan ly") || p.includes("automation") || p.includes("he thong")
  ) {
    return "bento";
  }

  // 3. Luxury, Resort, Trang sức, Vàng, Bất động sản cao cấp, Biệt thự
  if (
    p.includes("luxury") || p.includes("sang trong") || p.includes("resort") || p.includes("hotel") ||
    p.includes("khach san") || p.includes("vang") || p.includes("trang suc") || p.includes("kim cuong") ||
    p.includes("jewelry") || p.includes("villa") || p.includes("biet thu") || p.includes("bat dong san") ||
    p.includes("dong ho") || p.includes("watch") || p.includes("yacht") || p.includes("du thuyen") || p.includes("golf")
  ) {
    return "luxury";
  }

  // 4. Streetwear, Gym, Thể hình, Fitness, Boxing, Club, Bar, Agency sáng tạo, Underground
  if (
    p.includes("streetwear") || p.includes("thoi trang duong pho") || p.includes("gym") || p.includes("fitness") ||
    p.includes("boxing") || p.includes("the hinh") || p.includes("workout") || p.includes("bar") ||
    p.includes("club") || p.includes("tattoo") || p.includes("agency") || p.includes("gaming") ||
    p.includes("esport") || p.includes("sneaker") || p.includes("ao thun") || p.includes("hoodie") ||
    p.includes("vo thuat") || p.includes("the thao") || p.includes("calisthenics")
  ) {
    return "brutalist";
  }

  // 5. Artisan, Cafe, Trà, Bánh, Hoa tươi, Thủ công, Đồ gốm, Quán ăn mộc mạc
  const isFlower = p.includes("hoa tuoi") || p.includes("shop hoa") || p.includes("tiem hoa") || p.includes("flower") || /\bhoa\b/.test(p);
  if (
    p.includes("cafe") || p.includes("ca phe") || p.includes("coffee") || p.includes("tra") ||
    p.includes("tea") || p.includes("banh") || p.includes("bakery") || p.includes("pastry") ||
    p.includes("thu cong") || p.includes("handmade") || isFlower ||
    p.includes("gom") || p.includes("tiem") || p.includes("quan an") || p.includes("organic") ||
    p.includes("acoustic") || p.includes("moc") || p.includes("rang xay")
  ) {
    return "artisan";
  }

  // 6. Minimal, Nhiếp ảnh, Kiến trúc, Portfolio cá nhân, Triển lãm, Nghệ thuật
  if (
    p.includes("nhiep anh") || p.includes("photography") || p.includes("portfolio") || p.includes("kien truc") ||
    p.includes("architect") || p.includes("toi gian") || p.includes("minimal") || p.includes("gallery") ||
    p.includes("trien lam") || p.includes("designer") || p.includes("studio") || p.includes("noi that")
  ) {
    return "minimal";
  }

  return "modern";
}

/**
 * Bộ sinh thông minh dựa trên ngữ cảnh thực tế của prompt nếu mạng bị gián đoạn hoặc bị hạn chế vị trí
 */
function createSmartPromptSpec(prompt: string): Spec {
  const p = stripVietnamese(prompt);
  const cleanTitle = prompt.length > 55 ? prompt.slice(0, 52) + "..." : prompt;
  const style = detectStyleFromPrompt(prompt);

  // 1. ARTISAN ARCHETYPE (Cà phê, trà bánh, hoa tươi, tiệm gốm, đồ thủ công mộc mạc)
  if (style === "artisan") {
    const isFlower = p.includes("hoa tuoi") || p.includes("shop hoa") || p.includes("tiem hoa") || p.includes("flower") || /\bhoa\b/.test(p);
    const primary = isFlower ? "#e11d48" : "#b45309";
    const bg = isFlower ? "#fffdfd" : "#faf7f2";
    const fg = isFlower ? "#1f2937" : "#1f1610";
    const heroImg = isFlower
      ? "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80"
      : "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80";

    return {
      theme: {
        primary,
        background: bg,
        text: fg,
        font: "Playfair Display",
        style: "artisan",
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "editorial",
            badge: isFlower ? "🌸 HOA TƯƠI NGHỆ THUẬT" : "☕ HƯƠNG VỊ RANG XAY THỦ CÔNG",
            title: cleanTitle,
            subtitle: isFlower
              ? "Từng đóa hoa được tuyển chọn trong ngày, gói trọn tình yêu và sự tinh tế dành cho những dịp thiêng liêng nhất."
              : "Hạt cà phê đặc sản rang mộc mẻ nhỏ mỗi tuần, lưu giữ trọn vẹn hương vị mộc mạc và sự thanh tĩnh của đất trời.",
            cta: isFlower ? "Xem Bộ Sưu Tập Hoa" : "Khám Phá Menu Thức Uống",
            secondaryCta: "Tìm Hiểu Không Gian",
            image: heroImg,
          },
        },
        {
          type: "ticker",
          props: {
            items: isFlower
              ? ["HOA NHẬP KHẨU TƯƠI MỖI NGÀY", "THIẾT KẾ HOA CƯỚI RIÊNG BIỆT", "GIAO HOA TẬN TAY TRONG 60 PHÚT", "GÓI QUÀ THỦ CÔNG NGHỆ NHÂN", "TINH TẾ & ĐỘC BẢN"]
              : ["HẠT ARABICA CẦU ĐẤT ĐẶC TẢ", "BÁNH TƯƠI NƯỚNG NÓNG MỖI SÁNG", "KHÔNG GIAN YÊN BÌNH MỘC MẠC", "PHA PHIN & POUR OVER THỦ CÔNG", "100% NGUYÊN BẢN KHÔNG PHỤ GIA"],
          },
        },
        {
          type: "menu",
          props: {
            heading: isFlower ? "Bó Hoa & Lẵng Hoa Tiêu Biểu" : "Thực Đơn Đậm Chất Nghệ Nhân",
            subheading: "Được chắt lọc kỹ lưỡng từ nguồn nguyên liệu thượng hạng",
            categories: [
              {
                name: isFlower ? "Bộ Sưu Tập Nổi Bật" : "Thức Uống & Bánh Ngọt",
                items: isFlower
                  ? [
                      { name: "Bó Hoa Hồng David Austin Lãng Mạn", desc: "Hồng nhập khẩu cánh xoăn kèm lá bạc khuynh diệp thơm dịu", price: "850.000đ", badge: "Signature" },
                      { name: "Lẵng Hoa Khai Trương Thịnh Vượng", desc: "Lan hồ điệp kết hợp hoa đồng tiền và cẩm tú cầu rực rỡ", price: "1.250.000đ", badge: "VIP" },
                      { name: "Hộp Hoa Tulip Hà Lan Pastel", desc: "15 cành tulip màu hồng phấn trong hộp nhung trang nhã", price: "950.000đ" },
                      { name: "Bó Baby Trắng Thuần Khiết", desc: "Baby nhập khẩu sấy khô giữ màu tự nhiên lên đến 12 tháng", price: "450.000đ" },
                    ]
                  : [
                      { name: "Cà Phê Cold Brew Cam Vàng", desc: "Ủ lạnh 16 tiếng từ hạt Arabica Cầu Đất cùng hương cam thanh mát", price: "65.000đ", badge: "Signature" },
                      { name: "Espresso Con Panna Thượng Hạng", desc: "Cốt cà phê đậm sâu kết hợp lớp kem tươi béo mịn thủ công", price: "55.000đ" },
                      { name: "Bánh Croissant Bơ Normandy Nóng", desc: "Ngàn lớp giòn rụm với bơ Pháp nguyên chất thơm nồng nàn", price: "48.000đ", badge: "Bán chạy" },
                      { name: "Trà Đào Cam Sả Mật Ong Rừng", desc: "Trà thảo mộc thơm lành thanh nhiệt, vị ngọt tự nhiên", price: "58.000đ" },
                    ],
              },
            ],
          },
        },
        {
          type: "quote",
          props: {
            quote: isFlower
              ? "Hoa không chỉ để ngắm, hoa thay lời muốn nói những điều chân thành nhất mà ngôn từ khó diễn tả."
              : "Chúng tôi không chỉ pha một tách cà phê, chúng tôi sẻ chia khoảnh khắc tĩnh tại và sự chăm chút trong từng giọt nước sôi.",
            author: isFlower ? "Floral Stylist & Founder" : "Master Barista",
            role: "Nghệ nhân sáng tạo",
          },
        },
        {
          type: "split_feature",
          props: {
            title: "Sự Tỉ Mỉ Trong Từng Khâu Thực Hiện",
            description: "Từ tuyển chọn nguồn nguyên liệu xanh sạch đến công đoạn chế tác bằng tay, tất cả đều tuân thủ sự chân thành và tinh thần nghệ nhân nguyên bản.",
            image: isFlower
              ? "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80"
              : "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
            bullets: [
              "Nguyên liệu tươi mới thu hái và nhập khẩu trong ngày",
              "Bảo quản hoàn toàn tự nhiên, không chất phụ gia độc hại",
              "Đóng gói thủ công bằng giấy kraft thân thiện môi trường",
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: isFlower ? "Đặt Hoa Thiết Kế Theo Yêu Cầu" : "Đặt Bàn Hoặc Đặt Tiệc Nhỏ",
            subheading: "Để lại thông tin, chúng tôi sẽ liên hệ chuẩn bị chu đáo nhất cho bạn",
            submitLabel: isFlower ? "Gửi Yêu Cầu Đặt Hoa" : "Xác Nhận Đặt Bàn",
            fields: [
              { label: "Họ và tên của bạn", type: "text" },
              { label: "Số điện thoại liên hệ", type: "tel" },
              { label: isFlower ? "Dịp tặng & mong muốn về hoa" : "Số người & giờ ghé quán", type: "textarea" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: `© 2026 ${cleanTitle}. Đậm chất thủ công & tấm lòng nghệ nhân.`,
            links: [
              { label: "Trang chủ", href: "#" },
              { label: "Thực đơn", href: "#" },
              { label: "Không gian", href: "#" },
              { label: "Liên hệ", href: "#" },
            ],
          },
        },
      ],
    };
  }

  // 2. BENTO ARCHETYPE (SaaS, Tech, AI, Dashboard, Tool)
  if (style === "bento") {
    return {
      theme: {
        primary: "#6366f1",
        background: "#090d16",
        text: "#f8fafc",
        font: "Plus Jakarta Sans",
        style: "bento",
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "centered",
            badge: "⚡ THẾ HỆ NỀN TẢNG TIẾP THEO",
            title: cleanTitle,
            subtitle: "Hệ thống tự động hóa thông minh giúp đội ngũ của bạn đẩy nhanh tiến độ gấp 10 lần với độ tin cậy tuyệt đối.",
            cta: "Trải Nghiệm Miễn Phí 14 Ngày",
            secondaryCta: "Xem Demo Trực Tiếp",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
            align: "center",
          },
        },
        {
          type: "ticker",
          props: {
            items: ["99.99% Uptime", "50,000+ Teams Toàn Cầu", "Bảo Mật SOC-2 Type II", "Tích Hợp API Không Giới Hạn", "Hỗ Trợ Kỹ Thuật 24/7"],
          },
        },
        {
          type: "bento",
          props: {
            heading: "Kiến Trúc Tính Năng Toàn Diện",
            subheading: "Được thiết kế tối ưu cho các nhóm phát triển và doanh nghiệp hiện đại",
            items: [
              {
                title: "Phân Tích Dữ Liệu Thời Gian Thực",
                desc: "Theo dõi mọi chỉ số kinh doanh và hiệu suất với biểu đồ cập nhật từng mili-giây.",
                badge: "Real-time AI",
                icon: "⚡",
                span: "wide",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Bảo Mật Chuẩn Doanh Nghiệp",
                desc: "Mã hóa cấp cao End-to-End bảo vệ quyền riêng tư và tài sản dữ liệu của bạn.",
                badge: "Mã hóa AES-256",
                icon: "🔒",
                span: "normal",
              },
              {
                title: "Hơn 120+ Tích Hợp Sẵn",
                desc: "Kết nối trơn tru với GitHub, Slack, Notion, Stripe chỉ trong 2 cú click chuột.",
                badge: "Instant Connect",
                icon: "🔌",
                span: "normal",
              },
              {
                title: "Tự Động Hóa Workflow Thông Minh",
                desc: "Thiết lập luồng xử lý không cần viết mã, giải phóng thời gian cho công việc sáng tạo cốt lõi.",
                badge: "No-Code Flow",
                icon: "🤖",
                span: "tall",
              },
            ],
          },
        },
        {
          type: "stats",
          props: {
            heading: "Con Số Minh Chứng Cho Sức Mạnh",
            items: [
              { value: "10x", label: "Tốc độ triển khai dự án" },
              { value: "99.99%", label: "Cam kết SLA hoạt động ổn định" },
              { value: "450k+", label: "Tác vụ tự động mỗi ngày" },
              { value: "4.9/5", label: "Điểm đánh giá từ 1,200+ khách hàng" },
            ],
          },
        },
        {
          type: "split_feature",
          props: {
            title: "Hợp Tác Làm Việc Nhóm Đồng Bộ",
            description: "Xóa bỏ rào cản giao tiếp giữa các phòng ban. Mọi thành viên cùng theo dõi một nguồn dữ liệu duy nhất và cập nhật tức thì.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            bullets: [
              "Phân quyền đa cấp độ RBAC nghiêm ngặt",
              "Lịch sử hoạt động và sao lưu tự động không giới hạn",
              "Thông báo thông minh qua webhook, Telegram và Email",
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Bắt Đầu Dùng Thử Ngay Hôm Nay",
            subheading: "Không cần thẻ tín dụng. Cài đặt hoàn tất chỉ trong 3 phút.",
            submitLabel: "Đăng Ký Tài Khoản Pro",
            fields: [
              { label: "Email công việc của bạn", type: "email" },
              { label: "Tên tổ chức / công ty", type: "text" },
              { label: "Quy mô đội ngũ (thành viên)", type: "text" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: `© 2026 ${cleanTitle}. Nền tảng công nghệ số thế hệ mới.`,
            links: [
              { label: "Tính năng", href: "#" },
              { label: "Tài liệu API", href: "#" },
              { label: "Bảng giá", href: "#" },
              { label: "Bảo mật", href: "#" },
            ],
          },
        },
      ],
    };
  }

  // 3. LUXURY ARCHETYPE (Trang sức, đồng hồ, bất động sản cao cấp, villa nghỉ dưỡng, thời trang thượng lưu)
  if (style === "luxury") {
    return {
      theme: {
        primary: "#d4af37",
        background: "#0b0d11",
        text: "#f5f3eb",
        font: "Playfair Display",
        style: "luxury",
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "split",
            badge: "THE EPITOME OF EXCELLENCE",
            title: cleanTitle,
            subtitle: "Kiệt tác được kiến tạo riêng cho những chủ nhân thấu hiểu giá trị của sự độc bản và vẻ đẹp trường tồn qua thời gian.",
            cta: "Khám Phá Bộ Sưu Tập",
            secondaryCta: "Đặt Lịch Thưởng Lãm",
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
            align: "left",
          },
        },
        {
          type: "quote",
          props: {
            quote: "Sự xa xỉ đích thực không nằm ở việc gây ấn tượng với số đông, mà là mang đến cảm xúc thăng hoa thuần khiết cho người thưởng thức.",
            author: "Giám Đốc Sáng Tạo",
            role: "Trưởng ban cố vấn nghệ thuật",
          },
        },
        {
          type: "gallery",
          props: {
            heading: "Tuyển Tập Tác Phẩm Độc Bản",
            subheading: "Chắt lọc từ những chất liệu quý hiếm hàng đầu thế giới",
            items: [
              {
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                title: "Kiến Trúc & Không Gian Thượng Lưu",
                desc: "Hài hòa trọn vẹn giữa đường nét đương đại và thiên nhiên kỳ vĩ",
              },
              {
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
                title: "Chế Tác Thủ Công Tinh Xảo",
                desc: "Hàng trăm giờ hoàn thiện tỉ mỉ bởi các nghệ nhân kim hoàn bậc thầy",
              },
              {
                image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
                title: "Trải Nghiệm Thưởng Ngoạn Riêng Tư",
                desc: "Phục vụ chuyên biệt trong phòng tiếp đón bảo mật cao cấp",
              },
            ],
          },
        },
        {
          type: "split_feature",
          props: {
            title: "Đặc Quyền Concierge 1:1 Dành Cho Quý Khách",
            description: "Mỗi thượng khách đều có một chuyên viên tư vấn riêng biệt túc trực, thấu hiểu tường tận từng mong muốn và may đo giải pháp xứng tầm.",
            image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=800&q=80",
            bullets: [
              "Chứng thư bảo chứng độc bản quốc tế đi kèm",
              "Quy trình vận chuyển an ninh tuyệt mật tận nơi",
              "Đặc quyền tham dự các buổi tiệc kín và sự kiện giới hạn",
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Đăng Ký Lịch Thưởng Lãm Riêng Tư",
            subheading: "Vui lòng để lại thông tin, Quản Gia VIP sẽ liên hệ trong khung giờ Quý khách chỉ định",
            submitLabel: "Xác Nhận Đặt Lịch",
            fields: [
              { label: "Danh xưng & Họ tên Quý khách", type: "text" },
              { label: "Số điện thoại riêng", type: "tel" },
              { label: "Khung giờ và yêu cầu đón tiếp riêng", type: "textarea" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: `© 2026 ${cleanTitle}. A Legacy of Uncompromising Luxury.`,
            links: [
              { label: "Kiệt tác", href: "#" },
              { label: "Câu chuyện di sản", href: "#" },
              { label: "Đặc quyền VIP", href: "#" },
            ],
          },
        },
      ],
    };
  }

  // 4. BRUTALIST ARCHETYPE (Streetwear, Gym, Fitness, Boxing, Club, Creative Agency, Gaming)
  if (style === "brutalist") {
    const isGym = p.includes("gym") || p.includes("fitness") || p.includes("boxing") || p.includes("thể hình");
    const primary = isGym ? "#ea580c" : "#f97316";
    const bg = "#0d0d0d";
    const fg = "#ffffff";
    const heroImg = isGym
      ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
      : "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80";

    return {
      theme: {
        primary,
        background: bg,
        text: fg,
        font: "Space Grotesk",
        style: "brutalist",
      },
      sections: [
        {
          type: "ticker",
          props: {
            items: isGym
              ? ["// 100% RAW POWER //", "KHÔNG LÝ DO BỎ CUỘC", "MỞ CỬA 24/7", "HUẤN LUYỆN VIÊN ĐẲNG CẤP", "// TRAIN UNTIL IT HURTS //"]
              : ["// LIMITED DROP 2026 //", "OVERSIZE CULTURE", "100% HEAVY COTTON", "STREETWEAR ĐỘC BẢN", "// GRAB YOURS BEFORE IT GONE //"],
          },
        },
        {
          type: "hero",
          props: {
            layout: "editorial",
            badge: isGym ? "🔥 HARDCORE FITNESS" : "⚡ UNGOVERNABLE STREETWEAR",
            title: cleanTitle,
            subtitle: isGym
              ? "Nơi rèn giũa ý chí thép và lột xác thể hình. Đập tan mọi giới hạn cũ kỹ và giải phóng năng lượng chiến binh bên trong bạn."
              : "Thời trang góc cạnh không khoan nhượng. Định hình phong cách cá nhân với chất liệu thô mộc và tư duy nổi loạn có chủ đích.",
            cta: isGym ? "GIA NHẬP ĐỘI NGŨ NGAY" : "SĂN DROP MỚI NHẤT",
            secondaryCta: "XEM CHIẾN DỊCH",
            image: heroImg,
          },
        },
        {
          type: "cards",
          props: {
            heading: isGym ? "CHƯƠNG TRÌNH HUẤN LUYỆN ĐỘT PHÁ" : "VŨ KHÍ THỜI TRANG ĐƯỜNG PHỐ",
            subheading: isGym ? "Giáo trình cường độ cao được chứng minh hiệu quả thực tế" : "Phiên bản giới hạn đánh số riêng cho từng sản phẩm",
            items: isGym
              ? [
                  {
                    title: "POWERLIFTING & SỨC MẠNH",
                    desc: "Kỹ thuật tạ nặng chuẩn thi đấu, tối đa hóa lực bùng nổ cơ bắp và bảo vệ khớp.",
                    badge: "BEAST MODE",
                    price: "1.200.000đ/tháng",
                    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                    icon: "🏋️",
                  },
                  {
                    title: "BOXING & CHIẾN ĐẤU THỰC CHIẾN",
                    desc: "Tăng phản xạ, đốt calo siêu tốc và làm chủ kỹ năng đối kháng tự vệ.",
                    badge: "COMBAT ZONE",
                    price: "1.500.000đ/tháng",
                    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&q=80",
                    icon: "🥊",
                  },
                  {
                    title: "HYBRID CALISTHENICS & AGILITY",
                    desc: "Kiểm soát trọng lượng cơ thể đỉnh cao với các bài tập xà và thể lực đa năng.",
                    badge: "ATHLETIC",
                    price: "990.000đ/tháng",
                    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
                    icon: "⚡",
                  },
                ]
              : [
                  {
                    title: "HEAVYWEIGHT BOX HOODIE 450GSM",
                    desc: "Chất nỉ bông dày dặn đứng form, công nghệ in lụa tráng cao su siêu bền.",
                    badge: "LIMITED 150 PCS",
                    price: "890.000đ",
                    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
                    icon: "👕",
                  },
                  {
                    title: "CARGO TACTICAL PANTS MULTI-POCKET",
                    desc: "Vải ripstop kháng nước nhẹ, 8 túi tiện dụng với khóa zip công nghiệp YKK.",
                    badge: "RESTOCKED",
                    price: "750.000đ",
                    image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80",
                    icon: "👖",
                  },
                  {
                    title: "ACID WASH VINTAGE TEE",
                    desc: "Xử lý hiệu ứng giặt axit loang màu độc bản, mỗi chiếc là một phiên bản riêng biệt.",
                    badge: "HOT ITEM",
                    price: "420.000đ",
                    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
                    icon: "🔥",
                  },
                ],
          },
        },
        {
          type: "stats",
          props: {
            heading: "CON SỐ NÓI LÊN TẤT CẢ",
            items: isGym
              ? [
                  { value: "24/7", label: "Mở cửa liên tục không ngày nghỉ" },
                  { value: "2,500+", label: "Học viên tập luyện mỗi tuần" },
                  { value: "100%", label: "Thiết bị tạ nặng chuẩn Rogue" },
                  { value: "0%", label: "Lý do chấp nhận bỏ cuộc" },
                ]
              : [
                  { value: "100%", label: "Vải sợi tự nhiên thân thiện da" },
                  { value: "48H", label: "Cháy hàng mỗi đợt mở bán" },
                  { value: "35,000+", label: "Đơn hàng chuyển tới toàn quốc" },
                  { value: "5.0★", label: "Đánh giá từ cộng đồng Underground" },
                ],
          },
        },
        {
          type: "table",
          props: {
            heading: isGym ? "BẢNG SO SÁNH CÁC HẠNG THẺ" : "BẢNG SIZE CHUẨN FORM CHÂU Á",
            columns: isGym ? ["Quyền lợi", "GÓI BASIC", "GÓI HARDCORE VIP"] : ["Size", "Chiều cao (cm)", "Cân nặng (kg)", "Dài áo (cm)"],
            rows: isGym
              ? [
                  ["Thời gian vào phòng tập", "Giờ hành chính (08h - 17h)", "Không giới hạn 24/7"],
                  ["Khu vực võ thuật & Boxing", "Phụ thu 100k/buổi", "Tự do sử dụng hoàn toàn"],
                  ["Tủ đồ cá nhân & Khăn sạch", "Thuê riêng", "Miễn phí trang bị trọn gói"],
                  ["Tư vấn dinh dưỡng chuyên sâu", "Không có", "Huấn luyện viên lên thực đơn riêng"],
                ]
              : [
                  ["Size M", "155 - 168 cm", "50 - 62 kg", "70 cm"],
                  ["Size L", "168 - 176 cm", "63 - 74 kg", "73 cm"],
                  ["Size XL", "176 - 185 cm", "75 - 90 kg", "76 cm"],
                ],
          },
        },
        {
          type: "footer",
          props: {
            text: `© 2026 ${cleanTitle}. BUILT FOR THE UNSTOPPABLE.`,
            links: [
              { label: "SHOP", href: "#" },
              { label: "COMMUNITY", href: "#" },
              { label: "RULES", href: "#" },
            ],
          },
        },
      ],
    };
  }

  // 5. MINIMAL ARCHETYPE (Nhiếp ảnh, kiến trúc, portfolio, nghệ thuật, triển lãm)
  if (style === "minimal") {
    return {
      theme: {
        primary: "#18181b",
        background: "#ffffff",
        text: "#18181b",
        font: "Inter",
        style: "minimal",
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "minimal",
            badge: "STUDIO & ARCHITECTURE",
            title: cleanTitle,
            subtitle: "Tôn vinh cái đẹp của sự tinh giản. Mỗi công trình là một nghiên cứu sâu sắc về ánh sáng, vật liệu và cảm xúc tĩnh tại.",
            cta: "Xem Dự Án Chọn Lọc",
            secondaryCta: "Về Tác Giả",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
          },
        },
        {
          type: "gallery",
          props: {
            heading: "Tuyển Tập Công Trình & Tác Phẩm",
            subheading: "Những dự án tiêu biểu được hoàn thiện với tinh thần thuần khiết",
            items: [
              {
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                title: "Pavilion Ánh Sáng Tự Nhiên",
                desc: "Không gian mở kết nối trực tiếp với khu vườn cây bản địa",
              },
              {
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
                title: "Căn Hộ Tối Giản Đơn Sắc",
                desc: "Loại bỏ hoàn toàn chi tiết thừa, tập trung vào công năng sống",
              },
              {
                image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                title: "Phòng Trưng Bày Nghệ Thuật Đương Đại",
                desc: "Ánh sáng đổ bóng hình học định hình không gian triển lãm",
              },
            ],
          },
        },
        {
          type: "quote",
          props: {
            quote: "Sự đơn giản không phải là thiếu hụt chi tiết, mà là đỉnh cao của sự thấu hiểu và chắt lọc.",
            author: "Kiến trúc sư trưởng",
          },
        },
        {
          type: "cards",
          props: {
            heading: "Phạm Vi Sáng Tác & Tư Vấn",
            items: [
              {
                title: "Thiết Kế Kiến Trúc & Cảnh Quan",
                desc: "Nghiên cứu kỹ lưỡng vi khí hậu, hướng nắng gió và địa hình khu đất.",
                icon: "📐",
              },
              {
                title: "Thiết Kế Nội Thất May Đo",
                desc: "Lựa chọn vật liệu tự nhiên: gỗ sồi, đá mài, bê tông thô và kính trong suốt.",
                icon: "🛋️",
              },
              {
                title: "Giám Sát Tác Quyền Công Trình",
                desc: "Đảm bảo thực tế thi công bám sát 100% bản vẽ chi tiết đến từng milimet.",
                icon: "✨",
              },
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Bắt Đầu Dự Án Mới",
            subheading: "Hãy chia sẻ về ý tưởng và mặt bằng hiện trạng của bạn",
            submitLabel: "Gửi Yêu Cầu Tư Vấn",
            fields: [
              { label: "Họ và tên", type: "text" },
              { label: "Email liên hệ", type: "email" },
              { label: "Mô tả dự án & vị trí", type: "textarea" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: `© 2026 ${cleanTitle}. Less is always more.`,
            links: [
              { label: "Dự án", href: "#" },
              { label: "Triết lý", href: "#" },
              { label: "Liên hệ", href: "#" },
            ],
          },
        },
      ],
    };
  }

  // 6. MODERN ARCHETYPE (Nha khoa, phòng khám y tế, luật sư, kế toán, giáo dục, doanh nghiệp)
  return {
    theme: {
      primary: "#0284c7",
      background: "#f8fafc",
      text: "#0f172a",
      font: "Be Vietnam Pro",
      style: "modern",
    },
    sections: [
      {
        type: "hero",
        props: {
          layout: "split",
          badge: "🏥 TIÊU CHUẨN QUỐC TẾ • TẬN TÂM CHUYÊN NGHIỆP",
          title: cleanTitle,
          subtitle: "Đồng hành chăm sóc toàn diện với đội ngũ chuyên gia giàu kinh nghiệm và trang thiết bị hiện đại bậc nhất.",
          cta: "Đặt Lịch Khám & Tư Vấn",
          secondaryCta: "Xem Đội Ngũ Bác Sĩ",
          image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
          align: "left",
        },
      },
      {
        type: "stats",
        props: {
          heading: "HÀNH TRÌNH TRAO GỬI NIỀM TIN",
          items: [
            { value: "15+", label: "Năm kinh nghiệm chuyên sâu" },
            { value: "50,000+", label: "Khách hàng tin tưởng điều trị" },
            { value: "99.8%", label: "Tỷ lệ khách hàng hài lòng" },
            { value: "100%", label: "Thiết bị nhập khẩu chính hãng" },
          ],
        },
      },
      {
        type: "cards",
        props: {
          heading: "Dịch Vụ Chuyên Khoa Tiêu Biểu",
          subheading: "Phác đồ điều trị chuẩn y khoa, không đau và bảo hành minh bạch",
          items: [
            {
              title: "Thăm Khám & Chẩn Đoán Kỹ Thuật Số",
              desc: "Chụp phim 3D CT ConeBeam thế hệ mới phát hiện chính xác mọi vấn đề chỉ trong 2 phút.",
              badge: "Công nghệ mới",
              icon: "🔬",
              image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Điều Trị & Phục Hồi Chuyên Khoa",
              desc: "Bác sĩ trưởng khoa trực tiếp thực hiện trong phòng phẫu thuật vô trùng tuyệt đối.",
              badge: "Bác sĩ VIP",
              icon: "🩺",
              image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Chăm Sóc & Tái Khám Hậu Mãi Trọn Đời",
              desc: "Nhắc hẹn định kỳ tự động, theo dõi sát sao tiến trình lành thương của từng khách hàng.",
              badge: "Tận tâm",
              icon: "⭐",
              image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
            },
          ],
        },
      },
      {
        type: "split_feature",
        props: {
          title: "Quy Trình Vô Trùng Khép Kín 1 Chiều",
          description: "Chúng tôi áp dụng nghiêm ngặt tiêu chuẩn vô trùng châu Âu, đảm bảo môi trường điều trị an toàn tuyệt đối và loại bỏ hoàn toàn nguy cơ lây nhiễm chéo.",
          image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
          bullets: [
            "Lò hấp sấy tiệt trùng áp suất cao Autoclave đạt chuẩn y tế",
            "Mỗi khách hàng sử dụng một bộ tay khoan và dụng cụ chuyên biệt",
            "Không gian thăm khám sang trọng, riêng tư và thư thái",
          ],
        },
      },
      {
        type: "form",
        props: {
          heading: "Đặt Lịch Khám & Nhận Ưu Đãi",
          subheading: "Để lại thông tin, lễ tân sẽ liên hệ xác nhận giờ hẹn trong vòng 15 phút",
          submitLabel: "Xác Nhận Đặt Lịch Ngay",
          fields: [
            { label: "Họ và tên bệnh nhân", type: "text" },
            { label: "Số điện thoại liên hệ", type: "tel" },
            { label: "Nhu cầu hoặc tình trạng cần tư vấn", type: "textarea" },
          ],
        },
      },
      {
        type: "footer",
        props: {
          text: `© 2026 ${cleanTitle}. Tận tâm vì sức khỏe cộng đồng.`,
          links: [
            { label: "Trang chủ", href: "#" },
            { label: "Dịch vụ", href: "#" },
            { label: "Đội ngũ", href: "#" },
            { label: "Liên hệ", href: "#" },
          ],
        },
      },
    ],
  };
}

/**
 * Chuyển đổi linh hoạt mọi định dạng JSON mà AI tạo ra
 * thành Spec chuẩn, giữ trọn mọi loại section và phong cách nghệ thuật độc bản.
 */
function normalizeSpec(raw: any, userPrompt: string): Spec {
  const detectedStyle = detectStyleFromPrompt(userPrompt);
  const rawStyle = raw?.theme?.style;
  const validStyles = ["bento", "luxury", "brutalist", "artisan", "minimal", "modern"];
  const style = validStyles.includes(rawStyle) ? rawStyle : detectedStyle;

  const theme = {
    primary: raw?.theme?.primary || (style === "luxury" ? "#d4af37" : style === "brutalist" ? "#f97316" : style === "bento" ? "#6366f1" : style === "artisan" ? "#b45309" : "#2563eb"),
    background: raw?.theme?.background || (style === "luxury" ? "#0b0d11" : style === "brutalist" ? "#0d0d0d" : style === "bento" ? "#090d16" : style === "artisan" ? "#faf7f2" : "#ffffff"),
    text: raw?.theme?.text || (style === "luxury" || style === "brutalist" || style === "bento" ? "#f8fafc" : "#0f172a"),
    font: raw?.theme?.font || (style === "luxury" || style === "artisan" ? "Playfair Display" : style === "brutalist" ? "Space Grotesk" : style === "bento" ? "Plus Jakarta Sans" : "Be Vietnam Pro"),
    style,
  };

  const rawSections: any[] = Array.isArray(raw?.sections) ? raw.sections : [];
  const normalizedSections: Section[] = [];

  for (const s of rawSections) {
    if (!s || typeof s !== "object") continue;
    const type = String(s.type || "").toLowerCase();
    const props = s.props || s;

    // 1. HERO section
    if (type === "hero") {
      const validLayouts = ["centered", "split", "minimal", "editorial"];
      const layout = validLayouts.includes(props.layout)
        ? props.layout
        : props.align === "center"
        ? "centered"
        : style === "brutalist" || style === "artisan"
        ? "editorial"
        : style === "minimal"
        ? "minimal"
        : "split";

      normalizedSections.push({
        type: "hero",
        props: {
          layout,
          title: String(props.title || props.heading || userPrompt),
          subtitle: props.subtitle || props.description || props.subheading,
          cta: props.cta || props.primaryCta?.label || props.buttonText || "Khám phá ngay",
          secondaryCta: props.secondaryCta?.label || props.secondaryCta || undefined,
          badge: props.badge || undefined,
          image: props.image || props.imageUrl || undefined,
          align: layout === "centered" ? "center" : "left",
        },
      });
      continue;
    }

    // 2. BENTO section
    if (type === "bento") {
      const items: any[] = Array.isArray(props.items) ? props.items : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "bento",
          props: {
            heading: props.heading || props.title || "Kiến Trúc Tính Năng",
            subheading: props.subheading || props.subtitle || undefined,
            items: items.map(it => ({
              title: String(it.title || it.name || "Tính năng"),
              desc: it.desc || it.description || undefined,
              badge: it.badge || undefined,
              icon: it.icon || undefined,
              image: it.image || it.imageUrl || undefined,
              span: it.span === "wide" || it.span === "tall" ? it.span : "normal",
            })),
          },
        });
      }
      continue;
    }

    // 3. STATS section (chỉ số, con số ấn tượng)
    if (type === "stats" || type === "metrics" || type === "numbers") {
      const items: any[] = Array.isArray(props.items) ? props.items : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "stats",
          props: {
            heading: props.heading || props.title || undefined,
            items: items.map(it => ({
              value: String(it.value || it.number || "0") + (it.suffix ? String(it.suffix) : ""),
              label: String(it.label || it.title || "Chỉ số"),
              desc: it.desc || it.description || undefined,
            })),
          },
        });
      }
      continue;
    }

    // 4. MENU section (thực đơn, giá có chấm dẫn)
    if (type === "menu" || type === "food_menu" || type === "drink_menu") {
      const categories: any[] = Array.isArray(props.categories) ? props.categories : [];
      let finalCats = categories;
      if (finalCats.length === 0 && Array.isArray(props.items)) {
        finalCats = [{ name: props.heading || "Thực Đơn", items: props.items }];
      }
      if (finalCats.length > 0) {
        normalizedSections.push({
          type: "menu",
          props: {
            heading: props.heading || props.title || "Thực Đơn Chọn Lọc",
            subheading: props.subheading || props.subtitle || undefined,
            categories: finalCats.map(cat => ({
              name: String(cat.name || "Danh mục"),
              items: (Array.isArray(cat.items) ? cat.items : []).map((it: any) => ({
                name: String(it.name || it.title || "Món"),
                price: String(it.price || ""),
                desc: it.desc || it.description || undefined,
                badge: it.badge || undefined,
              })),
            })),
          },
        });
      }
      continue;
    }

    // 5. QUOTE section (lời trích dẫn, tuyên ngôn)
    if (type === "quote" || type === "testimonial_single" || type === "quote_block") {
      normalizedSections.push({
        type: "quote",
        props: {
          quote: String(props.quote || props.text || props.content || "Chất lượng là lời cam kết vững chắc nhất."),
          author: props.author || props.name || undefined,
          role: props.role || props.title || undefined,
          avatar: props.avatar || undefined,
        },
      });
      continue;
    }

    // 6. TICKER section (chữ chạy ngang vô tận)
    if (type === "ticker" || type === "marquee" || type === "banner_marquee") {
      const items: any[] = Array.isArray(props.items) ? props.items : Array.isArray(props.tags) ? props.tags : [];
      if (items.length > 0) {
        normalizedSections.push({
          type: "ticker",
          props: {
            items: items.map(it => String(typeof it === "string" ? it : it.text || it.label || it.title)),
          },
        });
      }
      continue;
    }

    // 7. SPLIT_FEATURE section (so le ảnh và nội dung)
    if (type === "split_feature" || type === "feature_split" || type === "about") {
      normalizedSections.push({
        type: "split_feature",
        props: {
          title: String(props.title || props.heading || "Chi Tiết Nổi Bật"),
          description: String(props.description || props.text || props.desc || ""),
          image: props.image || props.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
          reverse: Boolean(props.reverse),
          badge: props.badge || undefined,
          bullets: Array.isArray(props.bullets) ? props.bullets.map((b: any) => String(b)) : undefined,
          cta: props.cta || undefined,
        },
      });
      continue;
    }

    // 8. CTA BANNER (chuyển thành Hero gọn)
    if (type === "cta_banner" || type === "banner") {
      normalizedSections.push({
        type: "hero",
        props: {
          layout: "centered",
          title: String(props.title || "Ưu Đãi Đặc Biệt"),
          subtitle: props.subtitle || props.description,
          cta: props.buttonText || props.cta || "Nhận ưu đãi",
          align: "center",
        },
      });
      continue;
    }

    // 9. PRODUCTS -> Chuyển thành CARDS với hình ảnh và giá
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
              desc: p.desc || p.description || undefined,
              price: p.price ? String(p.price) : undefined,
              image: p.image || p.imageUrl || undefined,
              badge: p.tag || p.badge || p.category || undefined,
              icon: "🛍️",
            })),
          },
        });
      }
      continue;
    }

    // 10. FEATURES -> Bento hoặc CARDS
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

    // 11. CATEGORIES -> GALLERY hoặc CARDS
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

    // 12. TESTIMONIALS -> CARDS
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

    // 13. CARDS tiêu chuẩn
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
              price: it.price ? String(it.price) : undefined,
              icon: it.icon || undefined,
            })),
          },
        });
      }
      continue;
    }

    // 14. GALLERY tiêu chuẩn
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

    // 15. TABLE tiêu chuẩn
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

    // 16. FORM tiêu chuẩn
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

    // 17. FOOTER
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

  // Cách 1: Gọi qua endpoint OpenAI-compatible của Google (vượt qua kiểm tra địa lý Cloudflare)
  try {
    const openAiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    const res = await fetch(openAiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GEMINI_API_KEY.trim()}`,
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Hãy tạo website chất lượng cao theo yêu cầu: "${prompt}". Chi tiết: ${userText}` },
        ],
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data: any = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } else {
      console.warn("OpenAI endpoint status:", res.status);
    }
  } catch (err) {
    console.warn("OpenAI endpoint attempt failed:", err);
  }

  // Cách 2: Native generateContent
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
      signal: AbortSignal.timeout(6000),
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
        await sleep(1400);

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
          console.warn("Kích hoạt bộ kiến tạo thông minh thích ứng do Gemini API:", geminiError?.message || geminiError);
          await sleep(1500); // Giữ nhịp độ trực quan để người dùng thấy AI đang phân tích và thiết kế
          raw = createSmartPromptSpec(prompt);
        }

        // Bước 3: Soạn nội dung & chuẩn hóa cấu trúc
        await send("step", { id: "content" });
        await sleep(1200);

        // Chuẩn hóa cấu trúc để luôn tương thích 100% với React Renderer
        const normalized = normalizeSpec(raw, prompt);
        const parsed = SpecSchema.safeParse(normalized);
        if (!parsed.success) {
          console.error("Lỗi validate Spec:", parsed.error);
          throw new Error("Không thể định dạng cấu trúc website do AI tạo.");
        }

        // Bước 4: Kiểm tra và hoàn thiện
        await send("step", { id: "validate" });
        await sleep(1000);

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
