# Dựng.site – tạo website bằng chat (React + Cloudflare Pages + D1 + Gemini)

## Luồng
Landing → bấm "Tạo website" → nhập yêu cầu → `POST /api/generate` (SSE) → tiến trình 4 bước → Renderer hiển thị kết quả.
Gemini chỉ trả **JSON spec**; React render bằng component có sẵn (an toàn, dễ chỉnh sửa, dễ versioning).

## Chạy thử
```bash
npm install
cp .dev.vars.example .dev.vars          # điền GEMINI_API_KEY
npx wrangler d1 create ai-site-builder  # dán database_id vào wrangler.toml
npm run db:local                        # áp migration vào D1 local
npm run build
npm run preview                         # http://localhost:8788 (có /api + D1)
```
Dev giao diện nhanh: chạy `npm run preview` ở một terminal, `npm run dev` ở terminal khác (Vite proxy /api sang 8788).

## Triển khai
```bash
npm run db:remote
npx wrangler pages secret put GEMINI_API_KEY
npm run deploy
```

## Cấu trúc
- `shared/schema.ts` – zod schema + danh sách bước (dùng chung client/server)
- `functions/api/generate.ts` – gọi Gemini, validate, retry 1 lần, lưu D1, phát SSE
- `functions/api/_prompt.ts` – system prompt
- `functions/api/projects/[id].ts` – lấy bản mới nhất cho link chia sẻ `/p/:id`
- `src/components/Renderer.tsx`, `sections.tsx` – registry + component section
- `src/lib/useGenerate.ts` – hook đọc SSE
- `migrations/0001_init.sql` – schema D1 (có bảng rate_limits)

## Hướng mở rộng gợi ý
1. Thêm section mới: schema → component → registry → cập nhật SYSTEM_PROMPT.
2. Dùng `streamGenerateContent` để section hiện dần.
3. Turnstile + đăng nhập; giới hạn theo user thay vì IP.
4. Undo/redo từ bảng `templates`; đọc lại `messages` để giữ ngữ cảnh hội thoại.
5. Xuất bản ra subdomain (Pages/Workers for Platforms), thu form (lưu submissions vào D1).
6. Dọn bảng `rate_limits` định kỳ (Cron Trigger).
