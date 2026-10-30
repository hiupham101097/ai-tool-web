import { z } from "zod";

const Cta = z.string().max(100).optional();

export const SectionSchema = z.discriminatedUnion("type", [
  // 1. HERO - Hỗ trợ nhiều layout: split, centered, bold-editorial, minimal
  z.object({
    type: z.literal("hero"),
    props: z.object({
      layout: z.enum(["split", "centered", "editorial", "minimal"]).optional(),
      title: z.string(),
      subtitle: z.string().optional(),
      cta: Cta,
      secondaryCta: Cta,
      badge: z.string().optional(),
      image: z.string().optional(),
      align: z.enum(["left", "center"]).optional(),
    }),
  }),

  // 2. BENTO GRID - Bố cục bất đối xứng hiện đại (thẻ to, thẻ nhỏ, thẻ rộng)
  z.object({
    type: z.literal("bento"),
    props: z.object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      items: z.array(
        z.object({
          title: z.string(),
          desc: z.string().optional(),
          badge: z.string().optional(),
          image: z.string().optional(),
          icon: z.string().optional(),
          span: z.enum(["normal", "wide", "tall"]).optional(),
        })
      ).min(2).max(8),
    }),
  }),

  // 3. CARDS / PRODUCTS - Danh sách thẻ sản phẩm / dịch vụ
  z.object({
    type: z.literal("cards"),
    props: z.object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      items: z.array(
        z.object({
          title: z.string(),
          desc: z.string().optional(),
          badge: z.string().optional(),
          image: z.string().optional(),
          icon: z.string().optional(),
          price: z.string().optional(),
        })
      ).min(1).max(12),
    }),
  }),

  // 4. SPLIT FEATURE / NARRATIVE - Kể chuyện so le (Ảnh bên trái, chữ bên phải hoặc ngược lại)
  z.object({
    type: z.literal("split_feature"),
    props: z.object({
      badge: z.string().optional(),
      title: z.string(),
      description: z.string(),
      bullets: z.array(z.string()).optional(),
      image: z.string(),
      reverse: z.boolean().optional(),
      cta: Cta,
    }),
  }),

  // 5. STATS / METRICS - Các con số ấn tượng
  z.object({
    type: z.literal("stats"),
    props: z.object({
      heading: z.string().optional(),
      items: z.array(
        z.object({
          value: z.string(),
          label: z.string(),
          desc: z.string().optional(),
        })
      ).min(2).max(6),
    }),
  }),

  // 6. MENU / PRICELIST - Thực đơn / bảng giá dạng dòng chấm leader cổ điển
  z.object({
    type: z.literal("menu"),
    props: z.object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      categories: z.array(
        z.object({
          name: z.string(),
          items: z.array(
            z.object({
              name: z.string(),
              price: z.string(),
              desc: z.string().optional(),
              badge: z.string().optional(),
            })
          ),
        })
      ).min(1).max(4),
    }),
  }),

  // 7. QUOTE / TESTIMONIAL - Câu trích dẫn triết lý hoặc đánh giá khách hàng
  z.object({
    type: z.literal("quote"),
    props: z.object({
      quote: z.string(),
      author: z.string().optional(),
      role: z.string().optional(),
      avatar: z.string().optional(),
    }),
  }),

  // 8. TICKER / MARQUEE - Dải chữ chạy ngang ấn tượng
  z.object({
    type: z.literal("ticker"),
    props: z.object({
      items: z.array(z.string()).min(2).max(10),
    }),
  }),

  // 9. GALLERY - Bộ sưu tập hình ảnh
  z.object({
    type: z.literal("gallery"),
    props: z.object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      items: z.array(
        z.object({
          image: z.string(),
          title: z.string().optional(),
          desc: z.string().optional(),
        })
      ).min(2).max(8),
    }),
  }),

  // 10. TABLE - Bảng so sánh
  z.object({
    type: z.literal("table"),
    props: z.object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      columns: z.array(z.string()).min(1).max(8),
      rows: z.array(z.array(z.string())).max(40),
    }),
  }),

  // 11. FORM - Đăng ký / Liên hệ
  z.object({
    type: z.literal("form"),
    props: z.object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      submitLabel: z.string().optional(),
      fields: z.array(
        z.object({
          label: z.string(),
          type: z.enum(["text", "email", "tel", "textarea"]),
        })
      ).min(1).max(12),
    }),
  }),

  // 12. FOOTER
  z.object({
    type: z.literal("footer"),
    props: z.object({
      text: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string() })).max(12).optional(),
    }),
  }),
]);

export const SpecSchema = z.object({
  theme: z.object({
    style: z.enum(["bento", "luxury", "brutalist", "artisan", "minimal", "modern"]).optional(),
    primary: z.string(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
    font: z.string().optional(),
    radius: z.enum(["none", "sm", "md", "lg", "full"]).optional(),
  }),
  sections: z.array(SectionSchema).min(1).max(20),
});

export type Spec = z.infer<typeof SpecSchema>;
export type Section = z.infer<typeof SectionSchema>;

export const STEPS = [
  { id: "analyze", label: "Phân tích yêu cầu & chọn phong cách thiết kế độc bản" },
  { id: "design", label: "AI định hình bố cục (Bento, Editorial, Luxury...)" },
  { id: "content", label: "Phối màu, chọn ảnh Unsplash & soạn nội dung" },
  { id: "validate", label: "Hoàn thiện chi tiết & tạo hiệu ứng chuyển động" },
] as const;
