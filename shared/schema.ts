import { z } from "zod";

const Cta = z.string().max(60).optional();

export const SectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    props: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      cta: Cta,
      secondaryCta: Cta,
      badge: z.string().optional(),
      image: z.string().optional(),
      align: z.enum(["left", "center"]).optional(),
    }),
  }),
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
        })
      ).min(1).max(12),
    }),
  }),
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
      ).min(1).max(8),
    }),
  }),
  z.object({
    type: z.literal("table"),
    props: z.object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      columns: z.array(z.string()).min(1).max(6),
      rows: z.array(z.array(z.string())).max(30),
    }),
  }),
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
      ).min(1).max(8),
    }),
  }),
  z.object({
    type: z.literal("footer"),
    props: z.object({
      text: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string() })).max(8).optional(),
    }),
  }),
]);

export const SpecSchema = z.object({
  theme: z.object({
    primary: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    background: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    text: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    font: z.enum(["Be Vietnam Pro", "Bricolage Grotesque", "Georgia", "system-ui"]).optional(),
  }),
  sections: z.array(SectionSchema).min(1).max(12),
});

export type Spec = z.infer<typeof SpecSchema>;
export type Section = z.infer<typeof SectionSchema>;

export const STEPS = [
  { id: "analyze", label: "Phân tích yêu cầu & phong cách thiết kế" },
  { id: "design", label: "Chọn bảng màu, typography & hình ảnh Unsplash" },
  { id: "content", label: "Soạn nội dung & hiệu ứng chuyển động" },
  { id: "validate", label: "Kiểm tra chất lượng & sẵn sàng xuất bản" },
] as const;
