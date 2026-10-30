import { z } from "zod";

const Cta = z.string().max(100).optional();

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
      ).min(1).max(20),
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
      ).min(1).max(12),
    }),
  }),
  z.object({
    type: z.literal("table"),
    props: z.object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      columns: z.array(z.string()).min(1).max(8),
      rows: z.array(z.array(z.string())).max(40),
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
      ).min(1).max(12),
    }),
  }),
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
    primary: z.string(),
    background: z.string().optional(),
    text: z.string().optional(),
    font: z.string().optional(),
  }),
  sections: z.array(SectionSchema).min(1).max(20),
});

export type Spec = z.infer<typeof SpecSchema>;
export type Section = z.infer<typeof SectionSchema>;

export const STEPS = [
  { id: "analyze", label: "Phân tích yêu cầu & định hình phong cách" },
  { id: "design", label: "AI suy nghĩ, chọn bảng màu & hình ảnh Unsplash" },
  { id: "content", label: "Soạn nội dung & cấu trúc từng phần" },
  { id: "validate", label: "Kiểm tra và hoàn thiện website" },
] as const;
