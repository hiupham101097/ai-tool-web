import type { Spec } from "../../shared/schema";

/**
 * Xuất spec website thành một file HTML độc lập hoàn chỉnh,
 * chuẩn thẩm mỹ cao cấp với hình ảnh Unsplash sắc nét và hiệu ứng animation mượt mà.
 */
export function generateStandaloneHtml(spec: Spec): string {
  const { theme, sections } = spec;
  const primary = theme.primary || "#2563eb";
  const bg = theme.background || "#ffffff";
  const fg = theme.text || "#0f172a";
  const font = theme.font || "Be Vietnam Pro";

  const renderSectionHtml = (s: Spec["sections"][number]): string => {
    switch (s.type) {
      case "hero": {
        const p = s.props;
        const hasImage = Boolean(p.image && p.image.trim());
        const align = hasImage ? "left" : p.align || "center";
        return `
    <header class="section s-hero ${hasImage ? "s-hero-split" : "s-hero-single"}" style="text-align: ${align};">
      <div class="container hero-container">
        <div class="hero-content">
          ${
            p.badge
              ? `<div class="hero-badge-wrap"><span class="badge hero-badge"><span class="badge-dot"></span>${escapeHtml(p.badge)}</span></div>`
              : ""
          }
          <h1 class="hero-title">${escapeHtml(p.title)}</h1>
          ${p.subtitle ? `<p class="hero-sub">${escapeHtml(p.subtitle)}</p>` : ""}
          <div class="hero-actions ${align === "center" ? "justify-center" : ""}">
            ${p.cta ? `<a href="#contact" class="btn btn-primary">${escapeHtml(p.cta)}</a>` : ""}
            ${p.secondaryCta ? `<a href="#details" class="btn btn-outline">${escapeHtml(p.secondaryCta)}</a>` : ""}
          </div>
        </div>
        ${
          hasImage
            ? `<div class="hero-image-wrap">
          <div class="image-frame">
            <img src="${escapeHtml(p.image!)}" alt="${escapeHtml(p.title)}" class="hero-img" loading="lazy" />
            <div class="image-glow"></div>
          </div>
        </div>`
            : ""
        }
      </div>
    </header>`;
      }

      case "cards": {
        const p = s.props;
        return `
    <section class="section s-cards" id="details">
      <div class="container">
        ${
          p.heading || p.subheading
            ? `<div class="section-header">
          ${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}
          ${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}
        </div>`
            : ""
        }
        <div class="grid">
          ${p.items
            .map(
              item => `
          <div class="card">
            ${
              item.image
                ? `<div class="card-img-wrap"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="card-img" loading="lazy" /></div>`
                : ""
            }
            <div class="card-body">
              <div class="card-top">
                ${item.icon ? `<span class="card-icon">${escapeHtml(item.icon)}</span>` : ""}
                ${item.badge ? `<span class="badge">${escapeHtml(item.badge)}</span>` : ""}
              </div>
              <h3 class="card-title">${escapeHtml(item.title)}</h3>
              ${item.desc ? `<p class="card-desc">${escapeHtml(item.desc)}</p>` : ""}
            </div>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
      }

      case "gallery": {
        const p = s.props;
        return `
    <section class="section s-gallery">
      <div class="container">
        ${
          p.heading || p.subheading
            ? `<div class="section-header">
          ${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}
          ${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}
        </div>`
            : ""
        }
        <div class="gallery-grid">
          ${p.items
            .map(
              item => `
          <div class="gallery-item">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title || "Gallery image")}" class="gallery-img" loading="lazy" />
            ${
              item.title || item.desc
                ? `<div class="gallery-overlay">
              ${item.title ? `<h4>${escapeHtml(item.title)}</h4>` : ""}
              ${item.desc ? `<p>${escapeHtml(item.desc)}</p>` : ""}
            </div>`
                : ""
            }
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
      }

      case "table": {
        const p = s.props;
        return `
    <section class="section s-table-section">
      <div class="container">
        ${
          p.heading || p.subheading
            ? `<div class="section-header">
          ${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}
          ${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}
        </div>`
            : ""
        }
        <div class="table-wrap">
          <table>
            <thead>
              <tr>${p.columns.map(c => `<th>${escapeHtml(c)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${p.rows
                .map(
                  r => `
              <tr>${r.map((cell, idx) => `<td class="${idx === 0 ? "td-lead" : ""}">${escapeHtml(cell)}</td>`).join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>`;
      }

      case "form": {
        const p = s.props;
        return `
    <section class="section s-form-section" id="contact">
      <div class="container form-container">
        ${
          p.heading || p.subheading
            ? `<div class="section-header">
          ${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}
          ${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}
        </div>`
            : ""
        }
        <form class="form" onsubmit="event.preventDefault(); alert('Cảm ơn bạn! Thông tin đã được gửi thành công.');">
          ${p.fields
            .map(
              f => `
          <div class="form-group">
            <label>${escapeHtml(f.label)}</label>
            ${
              f.type === "textarea"
                ? `<textarea rows="4" placeholder="Nhập ${escapeHtml(f.label).toLowerCase()}..." required></textarea>`
                : `<input type="${f.type}" placeholder="Nhập ${escapeHtml(f.label).toLowerCase()}..." required />`
            }
          </div>`
            )
            .join("")}
          <button type="submit" class="btn btn-primary btn-submit">${escapeHtml(p.submitLabel || "Gửi thông tin ngay")}</button>
        </form>
      </div>
    </section>`;
      }

      case "footer": {
        const p = s.props;
        return `
    <footer class="section s-footer">
      <div class="container footer-content">
        <p class="footer-text">${escapeHtml(p.text)}</p>
        ${
          p.links && p.links.length > 0
            ? `<nav class="footer-links">
          ${p.links.map(l => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`).join("")}
        </nav>`
            : ""
        }
      </div>
    </footer>`;
      }

      default:
        return "";
    }
  };

  const sectionsHtml = sections.map(renderSectionHtml).join("\n");
  const firstHero = sections.find(s => s.type === "hero");
  const siteTitle = (firstHero && firstHero.type === "hero" ? firstHero.props.title : "Website của tôi") || "Website";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(siteTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --primary: ${primary};
      --bg: ${bg};
      --fg: ${fg};
      --font-family: "${font}", "Be Vietnam Pro", system-ui, -apple-system, sans-serif;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html {
      scroll-behavior: smooth;
    }
    body {
      font-family: var(--font-family);
      background-color: var(--bg);
      color: var(--fg);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      width: min(1180px, 92vw);
      margin: 0 auto;
    }
    .section {
      padding: 5.5rem 0;
    }
    .section-header {
      margin-bottom: 3rem;
      text-align: center;
    }
    .section-title {
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.025em;
      line-height: 1.2;
      margin-bottom: 0.75rem;
    }
    .section-sub {
      font-size: 1.1rem;
      opacity: 0.8;
      max-width: 600px;
      margin: 0 auto;
    }
    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
      padding: 0.9rem 1.85rem;
      font-size: 1.05rem;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-primary {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 4px 18px color-mix(in srgb, var(--primary) 35%, transparent);
    }
    .btn-primary:hover {
      opacity: 0.92;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px color-mix(in srgb, var(--primary) 45%, transparent);
    }
    .btn-outline {
      background: transparent;
      color: var(--fg);
      border-color: color-mix(in srgb, var(--fg) 25%, transparent);
    }
    .btn-outline:hover {
      background: color-mix(in srgb, var(--fg) 6%, transparent);
      transform: translateY(-2px);
    }
    .btn-submit {
      width: 100%;
      padding: 1.1rem;
      font-size: 1.1rem;
    }
    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: color-mix(in srgb, var(--primary) 14%, transparent);
      color: var(--primary);
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--primary);
      box-shadow: 0 0 8px var(--primary);
    }
    /* Hero */
    .s-hero {
      padding: 6.5rem 0 5.5rem;
      position: relative;
    }
    .hero-container {
      display: grid;
      gap: 3.5rem;
      align-items: center;
    }
    .s-hero-split .hero-container {
      grid-template-columns: 1.1fr 0.9fr;
    }
    .hero-badge-wrap {
      margin-bottom: 1.5rem;
    }
    .hero-title {
      font-size: clamp(2.5rem, 5.5vw, 4.4rem);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.03em;
      margin-bottom: 1.35rem;
    }
    .hero-sub {
      font-size: clamp(1.1rem, 2vw, 1.3rem);
      opacity: 0.85;
      line-height: 1.6;
      margin-bottom: 2.25rem;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .justify-center {
      justify-content: center;
    }
    .image-frame {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 60px -10px color-mix(in srgb, var(--fg) 18%, transparent);
      animation: floatSmooth 6s ease-in-out infinite;
    }
    .hero-img {
      width: 100%;
      height: auto;
      aspect-ratio: 4/3;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }
    .image-frame:hover .hero-img {
      transform: scale(1.03);
    }
    @keyframes floatSmooth {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    /* Cards */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .card {
      background: color-mix(in srgb, var(--fg) 4%, var(--bg));
      border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      border-color: color-mix(in srgb, var(--primary) 40%, transparent);
      box-shadow: 0 16px 36px -8px color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .card-img-wrap {
      width: 100%;
      aspect-ratio: 16/10;
      overflow: hidden;
      background: #eee;
    }
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }
    .card:hover .card-img {
      transform: scale(1.06);
    }
    .card-body {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
    }
    .card-icon {
      font-size: 1.8rem;
    }
    .card-title {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 0.6rem;
      color: var(--primary);
    }
    .card-desc {
      opacity: 0.85;
      font-size: 0.98rem;
      line-height: 1.6;
    }
    /* Gallery */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .gallery-item {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 4/3;
      box-shadow: 0 10px 30px -5px color-mix(in srgb, var(--fg) 10%, transparent);
    }
    .gallery-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s ease;
    }
    .gallery-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 60%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.5rem;
      opacity: 0.95;
      transition: opacity 0.3s ease;
    }
    .gallery-overlay h4 {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .gallery-overlay p {
      font-size: 0.85rem;
      opacity: 0.85;
    }
    .gallery-item:hover .gallery-img {
      transform: scale(1.08);
    }
    /* Table */
    .table-wrap {
      overflow-x: auto;
      border-radius: 16px;
      border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
      background: color-mix(in srgb, var(--fg) 2%, var(--bg));
      box-shadow: 0 8px 24px -4px color-mix(in srgb, var(--fg) 6%, transparent);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: color-mix(in srgb, var(--primary) 10%, var(--bg));
      color: var(--primary);
      padding: 1.15rem 1.4rem;
      font-weight: 700;
      font-size: 1rem;
      border-bottom: 2px solid var(--primary);
    }
    td {
      padding: 1.05rem 1.4rem;
      border-bottom: 1px solid color-mix(in srgb, var(--fg) 8%, transparent);
      opacity: 0.9;
    }
    .td-lead {
      font-weight: 600;
      color: var(--primary);
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: color-mix(in srgb, var(--primary) 4%, transparent);
    }
    /* Form */
    .form-container {
      max-width: 620px;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 1.35rem;
      background: color-mix(in srgb, var(--fg) 3%, var(--bg));
      padding: 2.5rem;
      border-radius: 20px;
      border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
      box-shadow: 0 16px 40px -10px color-mix(in srgb, var(--fg) 10%, transparent);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .form-group label {
      font-size: 0.95rem;
      font-weight: 700;
    }
    .form-group input, .form-group textarea {
      padding: 0.95rem 1.15rem;
      border-radius: 10px;
      border: 1px solid color-mix(in srgb, var(--fg) 20%, transparent);
      background: var(--bg);
      color: var(--fg);
      font-family: inherit;
      font-size: 1rem;
      transition: all 0.2s ease;
    }
    .form-group input:focus, .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent);
    }
    /* Footer */
    .s-footer {
      border-top: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
      padding: 3.5rem 0;
    }
    .footer-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }
    .footer-links {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .footer-links a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    @media (max-width: 860px) {
      .s-hero-split .hero-container {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .hero-actions {
        justify-content: center;
      }
      .section {
        padding: 4rem 0;
      }
      .footer-content {
        flex-direction: column;
        text-align: center;
      }
    }
  </style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}

/**
 * Tải file index.html về máy của người dùng
 */
export function downloadWebsite(spec: Spec, filename = "index.html") {
  const htmlContent = generateStandaloneHtml(spec);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sao chép mã nguồn HTML vào clipboard
 */
export async function copyWebsiteHtml(spec: Spec): Promise<boolean> {
  const htmlContent = generateStandaloneHtml(spec);
  try {
    await navigator.clipboard.writeText(htmlContent);
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
