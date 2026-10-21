import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Khi dev: chạy `npm run preview` (wrangler pages dev) ở cổng 8788 để có /api và D1.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://127.0.0.1:8788" } },
});
