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
 * Chỉnh sửa hoặc bổ sung trực tiếp trên nền Spec hiện có (Incremental Edit)
 * Giữ nguyên 100% bố cục, hình ảnh, phong cách và các section cũ trừ những phần người dùng yêu cầu sửa đổi/thêm/xóa.
 */
function modifyExistingSpec(currentSpec: Spec, prompt: string): Spec {
  const updated: Spec = JSON.parse(JSON.stringify(currentSpec));
  const p = stripVietnamese(prompt);

  // 1. Tinh chỉnh màu sắc / Giao diện / Chế độ Sáng - Tối
  if (p.includes("toi") || p.includes("dark") || p.includes("den") || p.includes("nen den")) {
    updated.theme.background = "#0f172a";
    updated.theme.text = "#f8fafc";
  } else if (p.includes("sang") || p.includes("light") || p.includes("trang") || p.includes("nen trang")) {
    updated.theme.background = "#ffffff";
    updated.theme.text = "#0f172a";
  }

  // Tinh chỉnh màu chủ đạo
  if (p.includes("xanh la") || p.includes("xanh luc") || p.includes("green")) {
    updated.theme.primary = "#16a34a";
  } else if (p.includes("xanh duong") || p.includes("xanh bien") || p.includes("blue")) {
    updated.theme.primary = "#2563eb";
  } else if (p.includes("mau do") || p.includes("tone do") || (p.includes("do") && (p.includes("mau") || p.includes("tong")))) {
    updated.theme.primary = "#dc2626";
  } else if (p.includes("mau cam") || (p.includes("cam") && (p.includes("mau") || p.includes("tong")))) {
    updated.theme.primary = "#ea580c";
  } else if (p.includes("mau vang") || (p.includes("vang") && (p.includes("mau") || p.includes("tong") || p.includes("gold")))) {
    updated.theme.primary = "#d97706";
  } else if (p.includes("mau tim") || (p.includes("tim") && (p.includes("mau") || p.includes("tong") || p.includes("purple")))) {
    updated.theme.primary = "#7c3aed";
  } else if (p.includes("mau hong") || (p.includes("hong") && (p.includes("mau") || p.includes("tong") || p.includes("pink")))) {
    updated.theme.primary = "#db2777";
  } else if (p.includes("mau nau") || (p.includes("nau") && (p.includes("mau") || p.includes("tong") || p.includes("coffee")))) {
    updated.theme.primary = "#78350f";
  }

  // 2. Chuyển đổi Archetype style nếu yêu cầu
  if (p.includes("luxury") || p.includes("sang trong")) {
    updated.theme.style = "luxury";
    updated.theme.font = "Playfair Display";
  } else if (p.includes("bento") || p.includes("hien dai cong nghe")) {
    updated.theme.style = "bento";
    updated.theme.font = "Be Vietnam Pro";
  } else if (p.includes("brutalist") || p.includes("pha cach") || p.includes("duong pho")) {
    updated.theme.style = "brutalist";
    updated.theme.font = "Bricolage Grotesque";
  } else if (p.includes("artisan") || p.includes("am ap") || p.includes("vintage") || p.includes("co dien")) {
    updated.theme.style = "artisan";
    updated.theme.font = "Playfair Display";
  } else if (p.includes("minimal") || p.includes("toi gian")) {
    updated.theme.style = "minimal";
    updated.theme.font = "system-ui";
  }

  // Helper để chèn section mới ngay trước footer
  const insertBeforeFooter = (newSection: Section) => {
    const footerIdx = updated.sections.findIndex(s => s.type === "footer");
    if (footerIdx >= 0) {
      updated.sections.splice(footerIdx, 0, newSection);
    } else {
      updated.sections.push(newSection);
    }
  };

  // 3. Xử lý xóa section nếu có từ khóa xóa
  const isDelete = p.includes("xoa") || p.includes("bo ") || p.includes("loai bo") || p.includes("delete") || p.includes("remove");
  if (isDelete) {
    if (p.includes("bang gia") || p.includes("table")) {
      updated.sections = updated.sections.filter(s => s.type !== "table");
    }
    if (p.includes("form") || p.includes("lien he") || p.includes("dat ban")) {
      updated.sections = updated.sections.filter(s => s.type !== "form");
    }
    if (p.includes("menu") || p.includes("thuc don")) {
      updated.sections = updated.sections.filter(s => s.type !== "menu");
    }
    if (p.includes("gallery") || p.includes("anh") || p.includes("bo suu tap")) {
      updated.sections = updated.sections.filter(s => s.type !== "gallery");
    }
    if (p.includes("quote") || p.includes("danh gia") || p.includes("nhan xet")) {
      updated.sections = updated.sections.filter(s => s.type !== "quote");
    }
    if (p.includes("stats") || p.includes("thong ke")) {
      updated.sections = updated.sections.filter(s => s.type !== "stats");
    }
    if (p.includes("ticker") || p.includes("chu chay")) {
      updated.sections = updated.sections.filter(s => s.type !== "ticker");
    }
    return updated;
  }

  // 4. Sửa tiêu đề Hero nếu có yêu cầu
  if (
    p.includes("doi ten") || p.includes("sua ten") || p.includes("doi tieu de") ||
    p.includes("sua tieu de") || p.includes("dat ten") || p.includes("tieu de thanh")
  ) {
    const match = prompt.match(/(?:doi|sua|dat|thay)\s+(?:ten|tieu de|brand)?\s*(?:thanh|la|:)?\s*["'“]?([^"'”\n,.]+)/i);
    const newTitle = match?.[1]?.trim();
    const heroSection = updated.sections.find(s => s.type === "hero");
    if (heroSection && heroSection.type === "hero" && newTitle) {
      heroSection.props.title = newTitle;
    }
  }

  let sectionAdded = false;

  // 5. Thêm Section Bảng Giá (Table)
  if (
    p.includes("bang gia") || p.includes("gia ca") || p.includes("goi cuoc") ||
    p.includes("pricing") || p.includes("chi phi") || p.includes("bang phi")
  ) {
    const hasTable = updated.sections.some(s => s.type === "table");
    if (!hasTable) {
      insertBeforeFooter({
        type: "table",
        props: {
          heading: "Bảng Giá Dịch Vụ & Sản Phẩm",
          subheading: "Bảng giá chi tiết, minh bạch và cam kết chất lượng hàng đầu",
          columns: ["Gói Dịch Vụ / Hạng Mục", "Nội Dung Quyền Lợi", "Mức Giá Chi Tiết"],
          rows: [
            ["Gói Tiêu Chuẩn (Standard)", "Đầy đủ các quyền lợi cốt lõi, tư vấn & hỗ trợ tận tình", "Liên hệ ưu đãi"],
            ["Gói Chuyên Nghiệp (Pro)", "Ưu tiên dịch vụ cao cấp, tặng kèm tiện ích độc quyền", "Giảm 20% hôm nay"],
            ["Gói Doanh Nghiệp (VIP)", "Đồng hành trực tiếp 1-1, tối ưu hóa riêng theo yêu cầu", "Báo giá trực tiếp"],
          ],
        },
      });
      sectionAdded = true;
    }
  }

  // 6. Thêm Form liên hệ / Đặt bàn / Đặt lịch (Form)
  if (
    p.includes("form") || p.includes("lien he") || p.includes("dat ban") ||
    p.includes("dat lich") || p.includes("dang ky") || p.includes("tu van") || p.includes("gui tin nhan")
  ) {
    const hasForm = updated.sections.some(s => s.type === "form");
    if (!hasForm) {
      const isBooking = p.includes("dat ban") || p.includes("dat cho") || p.includes("dat lich");
      insertBeforeFooter({
        type: "form",
        props: {
          heading: isBooking ? "Đặt Chỗ / Đặt Lịch Hẹn Trực Tuyến" : "Đăng Ký Tư Vấn & Nhận Báo Giá",
          subheading: "Vui lòng để lại thông tin, chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút",
          submitLabel: isBooking ? "Xác Nhận Đặt Chỗ Ngay" : "Gửi Thông Tin Cho Chúng Tôi",
          fields: [
            { label: "Họ và tên của bạn", type: "text" },
            { label: "Số điện thoại liên hệ", type: "tel" },
            { label: isBooking ? "Thời gian & Số lượng khách" : "Nội dung cần tư vấn", type: "textarea" },
          ],
        },
      });
      sectionAdded = true;
    }
  }

  // 7. Thêm Thực Đơn / Menu (Menu)
  if (p.includes("menu") || p.includes("thuc don") || p.includes("do uong") || p.includes("mon an")) {
    const hasMenu = updated.sections.some(s => s.type === "menu");
    if (!hasMenu) {
      insertBeforeFooter({
        type: "menu",
        props: {
          heading: "Thực Đơn & Món Nổi Bật",
          subheading: "Được chắt lọc từ những nguyên liệu tươi ngon và chất lượng nhất",
          categories: [
            {
              name: "Món Bán Chạy Nhất (Signature)",
              items: [
                { name: "Món Đặc Trưng Thượng Hạng", desc: "Hương vị độc đáo, chế biến công phu theo công thức riêng", price: "Mức giá hợp lý", badge: "Signature" },
                { name: "Món Tuyển Chọn Yêu Thích", desc: "Nguyên liệu tươi sạch mỗi ngày, dinh dưỡng và thơm ngon", price: "Bán chạy", badge: "Hot" },
                { name: "Món Thanh Mát Dịu Lành", desc: "Thanh mát cơ thể, giải nhiệt và sảng khoái tinh thần", price: "Khuyên dùng" },
              ],
            },
          ],
        },
      });
      sectionAdded = true;
    }
  }

  // 8. Thêm Đánh giá / Khách hàng nhận xét (Quote)
  if (
    p.includes("danh gia") || p.includes("review") || p.includes("nhan xet") ||
    p.includes("khach hang") || p.includes("feedback") || p.includes("cam nhan") || p.includes("quote")
  ) {
    const hasQuote = updated.sections.some(s => s.type === "quote");
    if (!hasQuote) {
      insertBeforeFooter({
        type: "quote",
        props: {
          quote: "Dịch vụ vượt trên cả sự mong đợi! Đội ngũ phục vụ chuyên nghiệp, sản phẩm chỉn chu đến từng chi tiết nhỏ và luôn mang lại cảm giác an tâm.",
          author: "Nguyễn Thu Thảo",
          role: "Khách hàng thân thiết",
        },
      });
      sectionAdded = true;
    }
  }

  // 9. Thêm Bộ Sưu Tập / Hình ảnh (Gallery)
  if (p.includes("gallery") || p.includes("anh") || p.includes("album") || p.includes("hinh anh") || p.includes("bo suu tap")) {
    const hasGallery = updated.sections.some(s => s.type === "gallery");
    if (!hasGallery) {
      insertBeforeFooter({
        type: "gallery",
        props: {
          heading: "Bộ Sưu Tập Hình Ảnh & Hoạt Động",
          subheading: "Những góc nhìn chân thực về sản phẩm, không gian và trải nghiệm",
          items: [
            { image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80", title: "Không Gian Tinh Tế", desc: "Ấm áp và tràn đầy cảm hứng" },
            { image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80", title: "Chất Lượng Thượng Hạng", desc: "Tỉ mỉ trong từng đường nét" },
            { image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80", title: "Sự Hài Lòng", desc: "Được khách hàng yêu mến bình chọn" },
          ],
        },
      });
      sectionAdded = true;
    }
  }

  // 10. Thêm Thống kê / Thành tích (Stats)
  if (p.includes("stats") || p.includes("thong ke") || p.includes("so lieu") || p.includes("thanh tuu") || p.includes("con so")) {
    const hasStats = updated.sections.some(s => s.type === "stats");
    if (!hasStats) {
      insertBeforeFooter({
        type: "stats",
        props: {
          heading: "Thành Tựu & Những Con Số Biết Nói",
          items: [
            { value: "98.5%", label: "Khách Hàng Hài Lòng", desc: "Từ hơn 5,000+ lượt đánh giá" },
            { value: "10,000+", label: "Lượt Phục Vụ", desc: "Đồng hành mỗi năm" },
            { value: "Top 1", label: "Chất Lượng Hàng Đầu", desc: "Được tin tưởng và khẳng định" },
          ],
        },
      });
      sectionAdded = true;
    }
  }

  // 11. Thêm Dải chữ chạy (Ticker)
  if (p.includes("ticker") || p.includes("chu chay") || p.includes("chay chu") || p.includes("banner chay")) {
    const hasTicker = updated.sections.some(s => s.type === "ticker");
    if (!hasTicker) {
      const heroIdx = updated.sections.findIndex(s => s.type === "hero");
      const insertIdx = heroIdx >= 0 ? heroIdx + 1 : 0;
      updated.sections.splice(insertIdx, 0, {
        type: "ticker",
        props: {
          items: ["CHẤT LƯỢNG HÀNG ĐẦU", "ƯU ĐÃI ĐẶC QUYỀN TRONG THÁNG", "DỊCH VỤ TẬN TÂM CHUYÊN NGHIỆP", "CAM KẾT HÀI LÒNG 100%"],
        },
      });
      sectionAdded = true;
    }
  }

  // 12. Nếu người dùng mô tả thêm nội dung bất kỳ mà chưa match các loại cụ thể ở trên
  if (!sectionAdded && (p.includes("them") || p.includes("bo sung") || p.includes("xay dung") || p.includes("tao them") || p.includes("viet them"))) {
    const featureTitle = prompt.length > 55 ? prompt.slice(0, 52) + "..." : prompt;
    insertBeforeFooter({
      type: "split_feature",
      props: {
        badge: "THÔNG TIN BỔ SUNG",
        title: featureTitle,
        description: "Nội dung được cập nhật và bổ sung riêng theo yêu cầu của bạn, hoàn toàn đồng điệu với nhận diện của trang web.",
        bullets: [
          "Đảm bảo tiêu chuẩn chất lượng cao và trải nghiệm chuyên nghiệp",
          "Được đồng bộ màu sắc và kiểu dáng theo bố cục sẵn có",
          "Sẵn sàng phục vụ và mang lại giá trị thiết thực nhất cho khách hàng",
        ],
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
        cta: "Tìm hiểu thêm",
      },
    });
  }

  return updated;
}

/**
 * Bộ sinh thông minh dựa trên ngữ cảnh thực tế của prompt nếu mạng bị gián đoạn hoặc bị hạn chế vị trí
 */
function createSmartPromptSpec(prompt: string): Spec {
  const p = stripVietnamese(prompt);
  const cleanTitle = prompt.length > 55 ? prompt.slice(0, 52) + "..." : prompt;
  const style = detectStyleFromPrompt(prompt);

  // 0. SHOP HOA TƯƠI / HOA NGHỆ THUẬT / FLORIST BOUTIQUE
  const isFlower = p.includes("hoa tuoi") || p.includes("shop hoa") || p.includes("tiem hoa") || p.includes("flower") || /\bhoa\b/.test(p);
  if (isFlower) {
    return {
      theme: {
        primary: "#e11d48",
        secondary: "#fda4af",
        accent: "#f43f5e",
        background: "#fff9f9",
        text: "#1e1b1b",
        font: "Playfair Display",
        style: "artisan",
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "centered",
            badge: "🌸 HOA NGHỆ THUẬT & THIẾT KẾ ĐỘC BẢN",
            title: cleanTitle,
            subtitle: "Mỗi đóa hoa là một tác phẩm mang theo câu chuyện cảm xúc, tuyển chọn hoa tươi nhập khẩu trong ngày và sáng tạo thủ công bởi nghệ nhân.",
            cta: "Đặt Hoa Thiết Kế",
            secondaryCta: "Xem Bộ Sưu Tập",
            image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80",
          },
        },
        {
          type: "ticker",
          props: {
            items: [
              "🌸 HOA TƯƠI NHẬP KHẨU TRONG NGÀY",
              "💐 THIẾT KẾ HOA CƯỚI & SỰ KIỆN ĐỘC BẢN",
              "🚀 GIAO HOA HỎA TỐC 60 PHÚT NỘI THÀNH",
              "💌 TẶNG KÈM THIỆP THIẾT KẾ & BĂNG RÔN",
              "🌿 CAM KẾT HOA TƯƠI TỐI THIỂU 3 NGÀY"
            ],
          },
        },
        {
          type: "cards",
          props: {
            heading: "Bộ Sưu Tập Hoa Tươi Nghệ Thuật",
            subheading: "Được thiết kế kỳ công từ những cành hoa tươi sắc nét nhất",
            items: [
              {
                title: "Bó Hồng Juliet & David Austin",
                desc: "Hương thơm ngọt ngào, cánh xoăn quý phái nhập khẩu Anh Quốc kèm lá bạc khuynh diệp.",
                badge: "Signature",
                price: "950.000đ",
                image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Lẵng Lan Hồ Điệp Hoàng Gia",
                desc: "Lan hồ điệp vàng quý phái kết hợp đồng tiền và cẩm tú cầu rực rỡ đón vượng khí.",
                badge: "Khai trương",
                price: "1.650.000đ",
                image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Hộp Hoa Tulip Hà Lan Pastel",
                desc: "15 cành tulip màu hồng phấn mềm mại trong hộp nhung trang nhã kèm nơ lụa cao cấp.",
                badge: "Bán chạy",
                price: "880.000đ",
                image: "https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Bó Hoa Cưới Cầm Tay Cô Dâu",
                desc: "Linh lan trắng kết hợp mẫu đơn và baby sấy giữ trọn khoảnh khắc thiêng liêng nhất.",
                badge: "Wedding VIP",
                price: "1.450.000đ",
                image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
              },
            ],
          },
        },
        {
          type: "split_feature",
          props: {
            badge: "TRIẾT LÝ SÁNG TẠO",
            title: "Cắm Hoa Theo Cảm Xúc, Không Rập Khuôn",
            description: "Chúng tôi tin rằng hoa không chỉ để trang trí, hoa thay lời muốn nói những điều chân thành nhất. Mỗi bó hoa ra đời là duy nhất, gói trọn tâm tư bạn muốn gửi trao.",
            image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=80",
            bullets: [
              "Chỉ sử dụng hoa mới cắt sáng sớm từ vườn Đà Lạt và nhập khẩu Hà Lan",
              "Tạo hình theo phong cách cắm hoa tự nhiên mộc mạc châu Âu",
              "Chụp ảnh gửi bạn duyệt thực tế trước khi giao hàng tận nơi",
            ],
            cta: "Tìm hiểu thêm",
          },
        },
        {
          type: "gallery",
          props: {
            heading: "Khoảnh Khắc Hoa Trao Tay",
            subheading: "Hình ảnh thực tế được khách hàng ghi lại trong những dịp kỷ niệm thiêng liêng",
            items: [
              { image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80", title: "Ngày Chung Đôi", desc: "Không gian tiệc cưới hoa tươi rực rỡ" },
              { image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80", title: "Hồng David Austin", desc: "Trao gửi yêu thương ngày sinh nhật" },
              { image: "https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=800&q=80", title: "Tulip Hà Lan Mùa Xuân", desc: "Món quà tinh tế và thanh lịch" },
              { image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80", title: "Lẵng Chúc Mừng", desc: "Khởi đầu hồng phát và thịnh vượng" },
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Đặt Hoa Thiết Kế Theo Dịp",
            subheading: "Để lại yêu cầu và ngân sách, florist của chúng tôi sẽ tư vấn mẫu hoa ưng ý nhất",
            submitLabel: "Gửi Yêu Cầu Đặt Hoa",
            fields: [
              { label: "Họ và tên của bạn", type: "text" },
              { label: "Số điện thoại nhận hoa", type: "tel" },
              { label: "Dịp tặng & Ngân sách dự kiến", type: "text" },
              { label: "Lời nhắn trên thiệp / Lời chúc", type: "textarea" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: `© 2026 ${cleanTitle}. Tiệm Hoa Nghệ Thuật & Thiết Kế Độc Bản.`,
            links: [
              { label: "Trang chủ", href: "#" },
              { label: "Bộ sưu tập", href: "#" },
              { label: "Hoa cưới", href: "#" },
              { label: "Liên hệ", href: "#" },
            ],
          },
        },
      ],
    };
  }

  // 1. ARTISAN ARCHETYPE (Cà phê, trà bánh, tiệm gốm, đồ thủ công mộc mạc)
  if (style === "artisan") {
    const primary = "#b45309";
    const bg = "#faf7f2";
    const fg = "#1f1610";
    const heroImg = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80";

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
            layout: "split",
            badge: "☕ HƯƠNG VỊ RANG XAY THỦ CÔNG",
            title: cleanTitle,
            subtitle: "Hạt cà phê đặc sản rang mộc mẻ nhỏ mỗi tuần, lưu giữ trọn vẹn hương vị mộc mạc và sự thanh tĩnh của đất trời.",
            cta: "Khám Phá Menu Thức Uống",
            secondaryCta: "Tìm Hiểu Không Gian",
            image: heroImg,
          },
        },
        {
          type: "ticker",
          props: {
            items: [
              "HẠT ARABICA CẦU ĐẤT ĐẶC TẢ",
              "BÁNH TƯƠI NƯỚNG NÓNG MỖI SÁNG",
              "KHÔNG GIAN YÊN BÌNH MỘC MẠC",
              "PHA PHIN & POUR OVER THỦ CÔNG",
              "100% NGUYÊN BẢN KHÔNG PHỤ GIA"
            ],
          },
        },
        {
          type: "cards",
          props: {
            heading: "Thức Uống & Món Bán Chạy",
            subheading: "Được chắt lọc từ những nguyên liệu sạch và công thức pha chế thủ công",
            items: [
              {
                title: "Cà Phê Cold Brew Cam Vàng",
                desc: "Ủ lạnh 16 tiếng từ hạt Arabica Cầu Đất cùng hương cam thanh mát sảng khoái.",
                badge: "Signature",
                price: "65.000đ",
                image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Bánh Croissant Bơ Normandy Nóng",
                desc: "Ngàn lớp giòn rụm với bơ Pháp nguyên chất thơm nồng nàn nướng mới mỗi sáng.",
                badge: "Bánh tươi",
                price: "48.000đ",
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Trà Đào Cam Sả Mật Ong Rừng",
                desc: "Trà thảo mộc thơm lành thanh nhiệt, vị ngọt thanh tự nhiên từ mật ong rừng nguyên chất.",
                badge: "Thanh mát",
                price: "58.000đ",
                image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
              },
            ],
          },
        },
        {
          type: "menu",
          props: {
            heading: "Thực Đơn Đậm Chất Nghệ Nhân",
            subheading: "Được chắt lọc kỹ lưỡng từ nguồn nguyên liệu thượng hạng",
            categories: [
              {
                name: "Cà Phê & Đồ Uống",
                items: [
                  { name: "Espresso Con Panna Thượng Hạng", desc: "Cốt cà phê đậm sâu kết hợp lớp kem tươi béo mịn thủ công", price: "55.000đ", badge: "Best" },
                  { name: "Cà Phê Muối Xứ Huế", desc: "Vị đắng đượm quyện kem béo mặn mòi khó quên", price: "45.000đ" },
                  { name: "Matcha Latte Nhật Bản", desc: "Bột trà Uji nguyên chất đánh cùng sữa hạt yến mạch", price: "60.000đ" },
                ],
              },
            ],
          },
        },
        {
          type: "split_feature",
          props: {
            title: "Sự Tỉ Mỉ Trong Từng Khâu Thực Hiện",
            description: "Từ tuyển chọn nguồn nguyên liệu xanh sạch đến công đoạn chế tác bằng tay, tất cả đều tuân thủ sự chân thành và tinh thần nghệ nhân nguyên bản.",
            image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
            bullets: [
              "Hạt cà phê chỉ rang và sử dụng trong vòng 14 ngày",
              "Bảo quản hoàn toàn tự nhiên, không chất phụ gia độc hại",
              "Không gian mộc mạc yên bình lý tưởng để đọc sách và làm việc",
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Đặt Bàn Hoặc Đặt Tiệc Nhỏ",
            subheading: "Để lại thông tin, chúng tôi sẽ liên hệ chuẩn bị chu đáo nhất cho bạn",
            submitLabel: "Xác Nhận Đặt Bàn",
            fields: [
              { label: "Họ và tên của bạn", type: "text" },
              { label: "Số điện thoại liên hệ", type: "tel" },
              { label: "Số người & giờ ghé quán", type: "textarea" },
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

  // 1.5. NHÀ HÀNG SUSHI / OMAKASE / ẨM THỰC CAO CẤP
  const isSushi = p.includes("sushi") || p.includes("nha hang") || p.includes("omakase") || p.includes("am thuc") || p.includes("hai san");
  if (isSushi) {
    return {
      theme: {
        primary: "#dc2626",
        background: "#0c0a09",
        text: "#fafaf9",
        font: "Playfair Display",
        style: "luxury",
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "centered",
            badge: "🍣 OMAKASE THƯỢNG HẠNG NHẬT BẢN",
            title: cleanTitle,
            subtitle: "Hải sản tươi sống vận chuyển hỏa tốc từ chợ cá Toyosu Tokyo, kết hợp tài hoa hơn 20 năm của bếp trưởng người Nhật.",
            cta: "Đặt Bàn Trực Tuyến",
            secondaryCta: "Xem Thực Đơn Mùa Này",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
          },
        },
        {
          type: "ticker",
          props: {
            items: [
              "HẢI SẢN TƯƠI BAY TRONG NGÀY TỪ NHẬT BẢN",
              "BÒ WAGYU A5 CHỨNG NHẬN MIYAZAKI",
              "PHÒNG VIP RIÊNG TƯ CHUẨN PHONG CÁCH TỐI GIẢN",
              "BẾP TRƯỞNG 25 NĂM KINH NGHIỆM TẠI GINZA",
              "BỘ SƯU TẬP RƯỢU SAKE THƯỢNG HẠNG"
            ],
          },
        },
        {
          type: "cards",
          props: {
            heading: "Tuyệt Tác Ẩm Thực Tươi Ngon",
            subheading: "Mỗi món ăn là sự kết tinh của nguyên liệu hiếm có và kỹ nghệ điêu luyện",
            items: [
              {
                title: "Nigiri Bò Wagyu A5 Truffle",
                desc: "Thịt bò nướng tái mặt mỡ tan chảy trên đầu lưỡi cùng sốt nấm Truffle đen thơm nồng.",
                badge: "Signature",
                price: "320.000đ / miếng",
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Sashimi Otoro Bụng Cá Hồi Xanh",
                desc: "Thớ mỡ vân cẩm thạch ngậy béo, cắt dày nguyên bản giữ trọn vị ngọt đại dương.",
                badge: "Bán chạy",
                price: "850.000đ / set",
                image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Cơm Nhím Biển Uni Hokkaido",
                desc: "Trứng nhím biển vàng ươm béo ngậy ăn kèm rong biển nướng giòn và wasabi tươi giã tay.",
                badge: "Mùa này",
                price: "720.000đ / phần",
                image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
              },
            ],
          },
        },
        {
          type: "split_feature",
          props: {
            badge: "TRIẾT LÝ OMAKASE",
            title: "Trọn Niềm Tin Vào Đôi Tay Bếp Trưởng",
            description: "Tại nhà hàng của chúng tôi, thực khách không gọi món theo danh mục thông thường. Bếp trưởng sẽ lắng nghe khẩu vị của bạn và thiết kế một hành trình ẩm thực riêng biệt.",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
            bullets: [
              "Gạo Koshihikari thượng hạng nấu bằng nước suối khoáng tự nhiên",
              "Wasabi tươi mài bằng da cá đuối truyền thống Shizuoka",
              "Không gian quầy bar gỗ Hinoki thơm dịu và ấm cúng",
            ],
            cta: "Đặt chỗ trước",
          },
        },
        {
          type: "form",
          props: {
            heading: "Đặt Chỗ Trực Tuyến & Phòng Tiệc VIP",
            subheading: "Vui lòng đặt trước ít nhất 24 giờ để chúng tôi chuẩn bị hải sản tươi ngon nhất",
            submitLabel: "Xác Nhận Giữ Chỗ",
            fields: [
              { label: "Họ và tên của bạn", type: "text" },
              { label: "Số điện thoại liên hệ", type: "tel" },
              { label: "Số lượng khách & Thời gian đến", type: "text" },
              { label: "Ghi chú dị ứng hoặc yêu cầu riêng", type: "textarea" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: `© 2026 ${cleanTitle}. Tinh hoa ẩm thực xứ sở Phù Tang.`,
            links: [
              { label: "Thực đơn Omakase", href: "#" },
              { label: "Rượu Sake", href: "#" },
              { label: "Không gian", href: "#" },
              { label: "Đặt bàn", href: "#" },
            ],
          },
        },
      ],
    };
  }

  // 1.7. PHẦN MỀM QUẢN LÝ NHÂN SỰ / HRM / CHẤM CÔNG / TUYỂN DỤNG / TIỀN LƯƠNG
  const isHR = p.includes("nhan su") || p.includes("hrm") || p.includes("cham cong") || p.includes("tuyen dung") || p.includes("tinh luong") || p.includes("tien luong");
  if (isHR) {
    return {
      theme: {
        primary: "#4f46e5",
        secondary: "#818cf8",
        accent: "#06b6d4",
        background: "#0b0f19",
        text: "#f8fafc",
        font: "Be Vietnam Pro",
        style: "bento",
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "split",
            badge: "⚡ NỀN TẢNG QUẢN TRỊ NHÂN SỰ THÔNG MINH (HRM)",
            title: cleanTitle,
            subtitle: "Giải pháp toàn diện tự động hóa quản lý hồ sơ nhân sự, máy chấm công vân tay/khuôn mặt, tính lương tự động và tối ưu hóa quy trình tuyển dụng nhân tài.",
            cta: "Trải Nghiệm Dùng Thử 14 Ngày",
            secondaryCta: "Đăng Ký Tư Vấn 1:1",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
            align: "left",
          },
        },
        {
          type: "ticker",
          props: {
            items: [
              "CHẤM CÔNG GPS & NHẬN DIỆN KHUÔN MẶT AI",
              "BẢNG LƯƠNG TỰ ĐỘNG CHUẨN THUẾ & BHXH",
              "SỐ HÓA 100% HỒ SƠ & HỢP ĐỒNG ĐIỆN TỬ",
              "QUẢN LÝ ĐƠN TỪ NGHỈ PHÉP REAL-TIME",
              "HƠN 1,500+ DOANH NGHIỆP TIN DÙNG"
            ],
          },
        },
        {
          type: "bento",
          props: {
            heading: "Phân Hệ Tính Năng Cốt Lõi",
            subheading: "Được thiết kế tinh gọn giúp phòng HR và ban lãnh đạo tiết kiệm 80% thời gian tác nghiệp",
            items: [
              {
                title: "Chấm Công Đa Nền Tảng Thông Minh",
                desc: "Đồng bộ tức thì từ máy quét vân tay, nhận diện khuôn mặt và chấm công định vị GPS chống gian lận.",
                badge: "Auto Sync",
                icon: "⏱️",
                span: "wide",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Bảng Tính Lương Tự Động 1-Click",
                desc: "Tự động kết xuất công, phụ cấp, OT, hoa hồng và khấu trừ thuế TNCN, BHXH chính xác tuyệt đối.",
                badge: "Không sai sót",
                icon: "📊",
                span: "normal",
              },
              {
                title: "Quản Lý Tuyển Dụng & Onboarding",
                desc: "Phễu sàng lọc ứng viên tự động, lưu trữ CV tập trung và hướng dẫn hội nhập nhân viên mới.",
                badge: "Tuyển dụng 4.0",
                icon: "🎯",
                span: "normal",
              },
              {
                title: "Đơn Từ Online & Phê Duyệt Di Động",
                desc: "Nhân viên làm đơn nghỉ phép, xin đi muộn/về sớm trực tiếp trên điện thoại; sếp duyệt trong 3 giây.",
                badge: "Paperless",
                icon: "📱",
                span: "tall",
              },
            ],
          },
        },
        {
          type: "stats",
          props: {
            heading: "HIỆU QUẢ ĐƯỢC CHỨNG MINH THỰC TẾ",
            items: [
              { value: "85%", label: "Giảm thời gian xử lý bảng lương hàng tháng" },
              { value: "100%", label: "Minh bạch dữ liệu ngày công và ca kíp" },
              { value: "1,500+", label: "Doanh nghiệp trong và ngoài nước sử dụng" },
              { value: "99.9%", label: "Độ chính xác trong tính toán phúc lợi" },
            ],
          },
        },
        {
          type: "split_feature",
          props: {
            badge: "BẢO MẬT & PHÂN QUYỀN",
            title: "Dữ Liệu Nhân Sự Bảo Mật Cấp Ngân Hàng",
            description: "Toàn bộ thông tin nhân sự, bảng lương và hợp đồng được mã hóa nhiều lớp với hệ thống phân quyền chi tiết theo từng phòng ban và vị trí chức vụ.",
            image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
            bullets: [
              "Hệ thống phân quyền Role-Based Access Control (RBAC) nghiêm ngặt",
              "Nhật ký chỉnh sửa Audit Log lưu vết lịch sử mọi thao tác thay đổi",
              "Sao lưu dữ liệu tự động mỗi ngày trên hạ tầng điện toán đám mây",
            ],
            cta: "Tìm hiểu kiến trúc bảo mật",
          },
        },
        {
          type: "form",
          props: {
            heading: "Đăng Ký Tư Vấn & Nhận Bản Demo Miễn Phí",
            subheading: "Chuyên viên giải pháp của chúng tôi sẽ liên hệ thiết lập bản dùng thử phù hợp với quy mô doanh nghiệp bạn",
            submitLabel: "Nhận Tư Vấn Trực Tiếp",
            fields: [
              { label: "Họ và tên của bạn", type: "text" },
              { label: "Số điện thoại liên hệ", type: "tel" },
              { label: "Tên doanh nghiệp / Công ty", type: "text" },
              { label: "Quy mô nhân sự (VD: 20-50, 50-200, >500 người)", type: "text" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: `© 2026 ${cleanTitle}. Nền tảng quản trị nhân sự và chuyển đổi số doanh nghiệp.`,
            links: [
              { label: "Tính năng HRM", href: "#" },
              { label: "Chấm công & Tiền lương", href: "#" },
              { label: "Bảng giá gói", href: "#" },
              { label: "Hỗ trợ khách hàng", href: "#" },
            ],
          },
        },
      ],
    };
  }

  // 1.8. KHÓA HỌC / GIÁO DỤC TRỰC TUYẾN / LẬP TRÌNH / HỌC TẬP
  const isCourse = p.includes("khoa hoc") || p.includes("lap trinh") || p.includes("hoc") || p.includes("dao tao") || p.includes("giao duc");
  if (isCourse) {
    return {
      theme: {
        primary: "#2563eb",
        secondary: "#60a5fa",
        accent: "#f59e0b",
        background: "#0b1329",
        text: "#f8fafc",
        font: "Be Vietnam Pro",
        style: "bento",
      },
      sections: [
        {
          type: "hero",
          props: {
            layout: "split",
            badge: "🚀 LỘ TRÌNH ĐÀO TẠO THỰC CHIẾN 2026",
            title: cleanTitle,
            subtitle: "Học từ chuyên gia đang làm việc tại các tập đoàn công nghệ lớn. Cam kết hỗ trợ việc làm với mức lương hấp dẫn sau khi tốt nghiệp.",
            cta: "Đăng Ký Tư Vấn Khóa Học",
            secondaryCta: "Xem Lộ Trình Chi Tiết",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          },
        },
        {
          type: "ticker",
          props: {
            items: [
              "🔥 98% HỌC VIÊN CÓ VIỆC LÀM SAU 3 THÁNG",
              "💻 HƠN 50+ DỰ ÁN THỰC CHIẾN ĐƯA VÀO CV",
              "👨‍🏫 MENTOR 1 KÈM 1 HỖ TRỢ CODE HÀNG NGÀY",
              "🎁 TẶNG BỘ TÀI LIỆU & CODE MẪU BẢN QUYỀN",
              "🏢 KẾT NỐI HƠN 400+ DOANH NGHIỆP TUYỂN DỤNG"
            ],
          },
        },
        {
          type: "cards",
          props: {
            heading: "Các Khóa Học Tiêu Biểu & Chuyên Sâu",
            subheading: "Được cập nhật công nghệ mới nhất theo nhu cầu thực tế của thị trường",
            items: [
              {
                title: "Frontend React & TypeScript Pro",
                desc: "Làm chủ React 19, Next.js App Router, TailwindCSS và xây dựng các Web App phức tạp.",
                badge: "Bán chạy nhất",
                price: "4.500.000đ",
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Backend Node.js & Microservices",
                desc: "Thiết kế RESTful API, NestJS, Docker, Redis, Message Queue và cơ sở dữ liệu phân tán.",
                badge: "Hot 2026",
                price: "5.200.000đ",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Fullstack Web & AI Integration",
                desc: "Kết nối LLM, xây dựng ứng dụng AI tự động hóa và triển khai Cloudflare / AWS.",
                badge: "Chuyên sâu VIP",
                price: "7.800.000đ",
                image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
              },
            ],
          },
        },
        {
          type: "stats",
          props: {
            heading: "NHỮNG CON SỐ BIẾT NÓI",
            items: [
              { value: "12,000+", label: "Học viên đã tốt nghiệp" },
              { value: "98.2%", label: "Tỷ lệ có việc làm đúng ngành" },
              { value: "15-25tr", label: "Mức lương khởi điểm trung bình" },
              { value: "400+", label: "Doanh nghiệp đối tác tuyển dụng" },
            ],
          },
        },
        {
          type: "table",
          props: {
            heading: "So Sánh Lộ Trình Đào Tạo",
            subheading: "Lựa chọn hình thức học tập phù hợp nhất với quỹ thời gian của bạn",
            columns: ["Quyền Lợi & Hỗ Trợ", "Lớp Tự Học Có Video", "Lớp Mentor Kèm 1-1"],
            rows: [
              ["Video bài giảng Full HD trọn đời", "Có (Truy cập 24/7)", "Có (Cập nhật liên tục)"],
              ["Hỗ trợ review code trực tiếp", "Hỏi đáp qua forum", "1-1 hàng tuần cùng Tech Lead"],
              ["Bài tập dự án thực tế", "5 dự án cơ bản", "12 dự án lớn chuẩn doanh nghiệp"],
              ["Hỗ trợ kết nối phỏng vấn", "Hỗ trợ sửa CV", "Cam kết kết nối trực tiếp HR"],
            ],
          },
        },
        {
          type: "form",
          props: {
            heading: "Nhận Lộ Trình Học & Ưu Đãi Học Bổng 30%",
            subheading: "Để lại thông tin để được đội ngũ tuyển sinh tư vấn lộ trình phù hợp với xuất phát điểm của bạn",
            submitLabel: "Đăng Ký Nhận Tư Vấn Ngay",
            fields: [
              { label: "Họ và tên học viên", type: "text" },
              { label: "Số điện thoại liên hệ", type: "tel" },
              { label: "Khóa học bạn đang quan tâm", type: "text" },
            ],
          },
        },
        {
          type: "footer",
          props: {
            text: `© 2026 ${cleanTitle}. Đào tạo lập trình thực chiến chuẩn quốc tế.`,
            links: [
              { label: "Khóa học", href: "#" },
              { label: "Lộ trình", href: "#" },
              { label: "Học bổng", href: "#" },
              { label: "Tuyển dụng", href: "#" },
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

  const isUpdate = Boolean(
    currentSpec &&
    typeof currentSpec === "object" &&
    Array.isArray((currentSpec as any).sections) &&
    (currentSpec as any).sections.length > 0
  );

  const userText = JSON.stringify({
    isUpdate,
    prompt,
    ...(isUpdate ? { currentSpec } : {}),
    ...(retryHint ? { lastError: retryHint } : {}),
  });

  const promptMessage = isUpdate
    ? `YÊU CẦU TINH CHỈNH / BỔ SUNG TRÊN WEBSITE HIỆN TẠI (currentSpec): "${prompt}".
QUY TẮC BẮT BUỘC: Hãy GIỮ NGUYÊN tất cả các section, phong cách (theme.style), màu sắc, tiêu đề và nội dung cũ của currentSpec!
Chỉ thêm section mới (ngay trước footer) hoặc sửa đổi/cập nhật section tương ứng theo đúng yêu cầu.
Xuất ra JSON Spec đầy đủ hoàn chỉnh gồm tất cả các section cũ và mới. Chi tiết: ${userText}`
    : `Hãy tạo website chất lượng cao theo yêu cầu: "${prompt}". Chi tiết: ${userText}`;

  const candidateModels = ["gemini-flash-lite-latest", "gemini-3.8-flash", "gemini-flash-latest"];
  const baseUrl = env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";
  let lastErrorMsg = "";

  for (const modelName of candidateModels) {
    // Cách 1: Native generateContent với thời gian chờ thoải mái (40s) để AI suy nghĩ kỹ
    try {
      const url = `${baseUrl}/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY.trim())}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: promptMessage }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
        }),
        signal: AbortSignal.timeout(40000),
      });

      if (res.ok) {
        const data: any = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return JSON.parse(rawText);
        }
      } else {
        const errText = await res.text().catch(() => "");
        lastErrorMsg = `Model ${modelName} (${res.status}): ${errText.slice(0, 100)}`;
        console.warn(lastErrorMsg);
      }
    } catch (nativeErr: any) {
      lastErrorMsg = `Model ${modelName} native error: ${nativeErr?.message || nativeErr}`;
      console.warn(lastErrorMsg);
    }

    // Cách 2: Endpoint OpenAI-compatible của Google
    try {
      const openAiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      const res = await fetch(openAiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.GEMINI_API_KEY.trim()}`,
        },
        body: JSON.stringify({
          model: modelName,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: promptMessage },
          ],
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(40000),
      });

      if (res.ok) {
        const data: any = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          return JSON.parse(content);
        }
      }
    } catch (openAiErr) {
      console.warn(`OpenAI endpoint for ${modelName} failed`);
    }
  }

  throw new Error(lastErrorMsg || "Không thể kết nối đến AI sau khi đã thử tất cả các model.");
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json().catch(() => null)) as
      | { projectId?: string; prompt?: string; currentSpec?: unknown; isTweak?: boolean }
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

    const p = stripVietnamese(prompt);
    const isIncrementalIntent = Boolean(body?.isTweak) ||
      p.includes("them") || p.includes("bo sung") || p.includes("sua") || p.includes("doi") ||
      p.includes("thay") || p.includes("xoa") || p.includes("bo ") || p.includes("chinh") ||
      p.includes("tang") || p.includes("giam") || p.includes("mau") || p.includes("tong") ||
      p.includes("font") || p.includes("dark") || p.includes("sang") || p.includes("toi") ||
      p.includes("bang gia") || p.includes("form") || p.includes("menu") || p.includes("danh gia") ||
      p.includes("gallery") || p.includes("ticker") || p.includes("xay dung them") || p.includes("tao them");

    const hasExistingSpec = Boolean(
      body?.currentSpec &&
      typeof body.currentSpec === "object" &&
      Array.isArray((body.currentSpec as any).sections) &&
      (body.currentSpec as any).sections.length > 0
    );

    const shouldModifyExisting = hasExistingSpec && (Boolean(body?.isTweak) || isIncrementalIntent);

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
          raw = await callGemini(env, prompt, shouldModifyExisting ? body?.currentSpec : undefined);
        } catch (geminiError: any) {
          console.warn("Kích hoạt bộ kiến tạo thông minh thích ứng do Gemini API:", geminiError?.message || geminiError);
          await sleep(1500); // Giữ nhịp độ trực quan để người dùng thấy AI đang phân tích và thiết kế
          if (shouldModifyExisting) {
            raw = modifyExistingSpec(body!.currentSpec as Spec, prompt);
          } else {
            raw = createSmartPromptSpec(prompt);
          }
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
