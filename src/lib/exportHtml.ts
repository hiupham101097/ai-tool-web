import type { Spec } from "../../shared/schema";

/**
 * Xuất spec website thành một file HTML độc lập hoàn chỉnh,
 * có thể mở trực tiếp trong trình duyệt hoặc đưa lên bất kỳ hosting nào.
 */
export function generateStandaloneHtml(spec: Spec): string {
  const { theme, sections } = spec;
  const primary = theme.primary || "#1f5eff";
  const bg = theme.background || "#ffffff";
  const fg = theme.text || "#18181b";
  const font = theme.font || "Be Vietnam Pro";

  const renderSectionHtml = (s: Spec["sections"][number]): string => {
    switch (s.type) {
      case "hero": {
        const p = s.props;
        const align = p.align || "center";
        return `
    <header class="section s-hero" style="text-align: ${align};">
      <div class="container">
        <h1 class="hero-title">${escapeHtml(p.title)}</h1>
        ${p.subtitle ? `<p class="hero-sub">${escapeHtml(p.subtitle)}</p>` : ""}
        ${p.cta ? `<div class="hero-actions"><a href="#contact" class="btn btn-primary">${escapeHtml(p.cta)}</a></div>` : ""}
      </div>
    </header>`;
      }
      case "cards": {
        const p = s.props;
        return `
    <section class="section s-cards">
      <div class="container">
        ${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}
        <div class="grid">
          ${p.items
            .map(
              item => `
          <div class="card">
            ${item.badge ? `<span class="badge">${escapeHtml(item.badge)}</span>` : ""}
            <h3 class="card-title">${escapeHtml(item.title)}</h3>
            ${item.desc ? `<p class="card-desc">${escapeHtml(item.desc)}</p>` : ""}
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
        ${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>${p.columns.map(c => `<th>${escapeHtml(c)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${p.rows
                .map(
                  r => `
              <tr>${r.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
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
      <div class="container">
        ${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}
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
          <button type="submit" class="btn btn-primary">${escapeHtml(p.submitLabel || "Gửi thông tin")}</button>
        </form>
      </div>
    </section>`;
      }
      case "footer": {
        const p = s.props;
        return `
    <footer class="section s-footer">
      <div class="container footer-content">
        <p>${escapeHtml(p.text)}</p>
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
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Bricolage+Grotesque:wght@600;700;800&display=swap" rel="stylesheet" />
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
    body {
      font-family: var(--font-family);
      background-color: var(--bg);
      color: var(--fg);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      width: min(1140px, 90vw);
      margin: 0 auto;
    }
    .section {
      padding: 5rem 0;
    }
    .section-title {
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      font-weight: 700;
      margin-bottom: 2rem;
      letter-spacing: -0.02em;
    }
    /* Hero */
    .s-hero {
      padding: 6.5rem 0 5rem;
    }
    .hero-title {
      font-size: clamp(2.4rem, 5.5vw, 4.2rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.025em;
      margin-bottom: 1.25rem;
    }
    .hero-sub {
      font-size: clamp(1.1rem, 2vw, 1.35rem);
      opacity: 0.85;
      max-width: 680px;
      margin: 0 auto 2.25rem;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    /* Button */
    .btn {
      display: inline-block;
      text-decoration: none;
      padding: 0.85rem 1.75rem;
      font-size: 1.05rem;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 4px 14px color-mix(in srgb, var(--primary) 35%, transparent);
    }
    .btn-primary:hover {
      opacity: 0.92;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px color-mix(in srgb, var(--primary) 45%, transparent);
    }
    /* Cards */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .card {
      background: color-mix(in srgb, var(--fg) 4%, var(--bg));
      border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
      border-radius: 14px;
      padding: 1.75rem;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .card:hover {
      transform: translateY(-3px);
      border-color: color-mix(in srgb, var(--primary) 40%, transparent);
    }
    .badge {
      display: inline-block;
      background: color-mix(in srgb, var(--primary) 15%, transparent);
      color: var(--primary);
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      margin-bottom: 0.75rem;
    }
    .card-title {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: var(--primary);
      font-weight: 700;
    }
    .card-desc {
      opacity: 0.85;
      font-size: 0.95rem;
      line-height: 1.55;
    }
    /* Table */
    .table-wrap {
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
      background: color-mix(in srgb, var(--fg) 2%, var(--bg));
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: color-mix(in srgb, var(--primary) 10%, var(--bg));
      color: var(--primary);
      padding: 1rem 1.25rem;
      font-weight: 600;
      border-bottom: 2px solid var(--primary);
    }
    td {
      padding: 0.9rem 1.25rem;
      border-bottom: 1px solid color-mix(in srgb, var(--fg) 8%, transparent);
      opacity: 0.9;
    }
    tr:last-child td {
      border-bottom: none;
    }
    /* Form */
    .form {
      max-width: 560px;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: color-mix(in srgb, var(--fg) 3%, var(--bg));
      padding: 2rem;
      border-radius: 14px;
      border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-group label {
      font-size: 0.95rem;
      font-weight: 600;
    }
    .form-group input, .form-group textarea {
      padding: 0.8rem 1rem;
      border-radius: 8px;
      border: 1px solid color-mix(in srgb, var(--fg) 20%, transparent);
      background: var(--bg);
      color: var(--fg);
      font-family: inherit;
      font-size: 0.95rem;
      transition: border-color 0.2s ease;
    }
    .form-group input:focus, .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
    }
    /* Footer */
    .s-footer {
      border-top: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
      padding: 3rem 0;
      opacity: 0.9;
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
      font-weight: 500;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      .section { padding: 3.5rem 0; }
      .footer-content { flex-direction: column; text-align: center; }
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

