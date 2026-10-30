import type { Spec } from "../../shared/schema";

/**
 * Xuất spec website thành một file HTML độc lập hoàn chỉnh,
 * hỗ trợ đầy đủ 6 Style Archetypes và 12 loại Section độc bản.
 */
export function generateStandaloneHtml(spec: Spec): string {
  const { theme, sections } = spec;
  const primary = theme.primary || "#2563eb";
  const bg = theme.background || "#ffffff";
  const fg = theme.text || "#0f172a";
  const font = theme.font || "Be Vietnam Pro";
  const styleArchetype = theme.style || "modern";

  const renderSectionHtml = (s: Spec["sections"][number]): string => {
    switch (s.type) {
      case "hero": {
        const p = s.props;
        if (p.layout === "editorial") {
          return `
    <header class="section s-hero s-hero-editorial">
      <div class="container">
        ${p.badge ? `<div class="s-editorial-meta"><span class="s-editorial-badge">${escapeHtml(p.badge)}</span></div>` : ""}
        <h1 class="s-editorial-title">${escapeHtml(p.title)}</h1>
        <div class="s-editorial-bottom">
          ${p.subtitle ? `<p class="s-editorial-sub">${escapeHtml(p.subtitle)}</p>` : ""}
          <div class="hero-actions">
            ${p.cta ? `<a href="#contact" class="btn btn-primary">${escapeHtml(p.cta)}</a>` : ""}
            ${p.secondaryCta ? `<a href="#details" class="btn btn-outline">${escapeHtml(p.secondaryCta)}</a>` : ""}
          </div>
        </div>
        ${p.image ? `<div class="s-editorial-media"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="s-editorial-img" loading="lazy" /></div>` : ""}
      </div>
    </header>`;
        }

        if (p.layout === "centered" || p.align === "center") {
          return `
    <header class="section s-hero s-hero-centered" style="text-align: center;">
      <div class="container">
        <div class="s-hero-centered-inner">
          ${p.badge ? `<div class="hero-badge-wrap"><span class="badge hero-badge"><span class="badge-dot"></span>${escapeHtml(p.badge)}</span></div>` : ""}
          <h1 class="hero-title">${escapeHtml(p.title)}</h1>
          ${p.subtitle ? `<p class="hero-sub">${escapeHtml(p.subtitle)}</p>` : ""}
          <div class="hero-actions justify-center">
            ${p.cta ? `<a href="#contact" class="btn btn-primary">${escapeHtml(p.cta)}</a>` : ""}
            ${p.secondaryCta ? `<a href="#details" class="btn btn-outline">${escapeHtml(p.secondaryCta)}</a>` : ""}
          </div>
        </div>
        ${p.image ? `<div class="s-hero-centered-image"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="s-centered-img" loading="lazy" /></div>` : ""}
      </div>
    </header>`;
        }

        // Split Layout (Default)
        return `
    <header class="section s-hero s-hero-split">
      <div class="container hero-container">
        <div class="hero-content">
          ${p.badge ? `<div class="hero-badge-wrap"><span class="badge hero-badge"><span class="badge-dot"></span>${escapeHtml(p.badge)}</span></div>` : ""}
          <h1 class="hero-title">${escapeHtml(p.title)}</h1>
          ${p.subtitle ? `<p class="hero-sub">${escapeHtml(p.subtitle)}</p>` : ""}
          <div class="hero-actions">
            ${p.cta ? `<a href="#contact" class="btn btn-primary">${escapeHtml(p.cta)}</a>` : ""}
            ${p.secondaryCta ? `<a href="#details" class="btn btn-outline">${escapeHtml(p.secondaryCta)}</a>` : ""}
          </div>
        </div>
        ${
          p.image
            ? `<div class="hero-image-wrap">
          <div class="image-frame">
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="hero-img" loading="lazy" />
          </div>
        </div>`
            : ""
        }
      </div>
    </header>`;
      }

      case "bento": {
        const p = s.props;
        return `
    <section class="section s-bento-section" id="bento">
      <div class="container">
        ${p.heading || p.subheading ? `<div class="section-header">${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}</div>` : ""}
        <div class="s-bento-grid">
          ${p.items
            .map(
              it => `
          <div class="s-bento-card ${it.span === "wide" ? "s-bento-wide" : it.span === "tall" ? "s-bento-tall" : ""}">
            ${it.image ? `<div class="s-bento-img-wrap"><img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.title)}" class="s-bento-img" loading="lazy" /></div>` : ""}
            <div class="s-bento-content">
              <div class="card-top">
                ${it.icon ? `<span class="card-icon">${escapeHtml(it.icon)}</span>` : ""}
                ${it.badge ? `<span class="badge">${escapeHtml(it.badge)}</span>` : ""}
              </div>
              <h3 class="card-title">${escapeHtml(it.title)}</h3>
              ${it.desc ? `<p class="card-desc">${escapeHtml(it.desc)}</p>` : ""}
            </div>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
      }

      case "split_feature": {
        const p = s.props;
        return `
    <section class="section s-split-feature ${p.reverse ? "s-split-reverse" : ""}">
      <div class="container s-split-grid">
        <div class="s-split-col s-split-text">
          ${p.badge ? `<span class="badge" style="margin-bottom: 1.25rem;">${escapeHtml(p.badge)}</span>` : ""}
          <h2 class="section-title">${escapeHtml(p.title)}</h2>
          <p class="s-split-desc">${escapeHtml(p.description)}</p>
          ${
            p.bullets && p.bullets.length > 0
              ? `<ul class="s-split-bullets">
            ${p.bullets.map(b => `<li><span class="bullet-check">✓</span><span>${escapeHtml(b)}</span></li>`).join("")}
          </ul>`
              : ""
          }
          ${p.cta ? `<a href="#contact" class="btn btn-primary">${escapeHtml(p.cta)}</a>` : ""}
        </div>
        <div class="s-split-col s-split-media">
          <div class="image-frame">
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="hero-img" loading="lazy" />
          </div>
        </div>
      </div>
    </section>`;
      }

      case "stats": {
        const p = s.props;
        return `
    <section class="section s-stats-section">
      <div class="container">
        ${p.heading ? `<h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${escapeHtml(p.heading)}</h2>` : ""}
        <div class="s-stats-grid">
          ${p.items
            .map(
              it => `
          <div class="s-stat-card">
            <div class="s-stat-val">${escapeHtml(it.value)}</div>
            <div class="s-stat-lbl">${escapeHtml(it.label)}</div>
            ${it.desc ? `<div class="s-stat-desc">${escapeHtml(it.desc)}</div>` : ""}
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
      }

      case "menu": {
        const p = s.props;
        return `
    <section class="section s-menu-section" id="menu">
      <div class="container">
        ${p.heading || p.subheading ? `<div class="section-header">${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}</div>` : ""}
        <div class="s-menu-container">
          ${p.categories
            .map(
              cat => `
          <div class="s-menu-category">
            <h3 class="s-menu-cat-title">${escapeHtml(cat.name)}</h3>
            <div class="s-menu-items">
              ${cat.items
                .map(
                  it => `
              <div class="s-menu-item">
                <div class="s-menu-line">
                  <span class="s-menu-name">${escapeHtml(it.name)}${it.badge ? ` <span class="badge">${escapeHtml(it.badge)}</span>` : ""}</span>
                  <span class="s-menu-leader"></span>
                  <span class="s-menu-price">${escapeHtml(it.price)}</span>
                </div>
                ${it.desc ? `<p class="s-menu-desc">${escapeHtml(it.desc)}</p>` : ""}
              </div>`
                )
                .join("")}
            </div>
          </div>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
      }

      case "quote": {
        const p = s.props;
        return `
    <section class="section s-quote-section">
      <div class="container">
        <div class="s-quote-inner">
          <span class="s-quote-mark">“</span>
          <blockquote class="s-quote-text">${escapeHtml(p.quote)}</blockquote>
          ${
            p.author || p.role
              ? `<div class="s-quote-author-wrap">
            ${p.avatar ? `<img src="${escapeHtml(p.avatar)}" alt="${escapeHtml(p.author || "")}" class="s-quote-avatar" />` : ""}
            <div>
              ${p.author ? `<cite class="s-quote-author">${escapeHtml(p.author)}</cite>` : ""}
              ${p.role ? `<span class="s-quote-role">${escapeHtml(p.role)}</span>` : ""}
            </div>
          </div>`
              : ""
          }
        </div>
      </div>
    </section>`;
      }

      case "ticker": {
        const p = s.props;
        return `
    <div class="s-ticker-wrap">
      <div class="s-ticker-track">
        ${p.items
          .concat(p.items)
          .map(t => `<span class="s-ticker-item"><span class="s-ticker-star">✦</span>${escapeHtml(t)}</span>`)
          .join("")}
      </div>
    </div>`;
      }

      case "cards": {
        const p = s.props;
        return `
    <section class="section s-cards" id="details">
      <div class="container">
        ${p.heading || p.subheading ? `<div class="section-header">${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}</div>` : ""}
        <div class="grid">
          ${p.items
            .map(
              item => `
          <div class="card">
            ${item.image ? `<div class="card-img-wrap"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="card-img" loading="lazy" /></div>` : ""}
            <div class="card-body">
              <div class="card-top">
                ${item.icon ? `<span class="card-icon">${escapeHtml(item.icon)}</span>` : ""}
                ${item.badge ? `<span class="badge">${escapeHtml(item.badge)}</span>` : ""}
              </div>
              <h3 class="card-title">${escapeHtml(item.title)}</h3>
              ${item.desc ? `<p class="card-desc">${escapeHtml(item.desc)}</p>` : ""}
              ${item.price ? `<div class="s-card-price">${escapeHtml(item.price)}</div>` : ""}
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
        ${p.heading || p.subheading ? `<div class="section-header">${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}</div>` : ""}
        <div class="gallery-grid">
          ${p.items
            .map(
              item => `
          <div class="gallery-item">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title || "Gallery image")}" class="gallery-img" loading="lazy" />
            ${item.title || item.desc ? `<div class="gallery-overlay">${item.title ? `<h4>${escapeHtml(item.title)}</h4>` : ""}${item.desc ? `<p>${escapeHtml(item.desc)}</p>` : ""}</div>` : ""}
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
        ${p.heading || p.subheading ? `<div class="section-header">${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}</div>` : ""}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>${p.columns.map(c => `<th>${escapeHtml(c)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${p.rows.map(r => `<tr>${r.map((cell, idx) => `<td class="${idx === 0 ? "td-lead" : ""}">${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
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
        ${p.heading || p.subheading ? `<div class="section-header">${p.heading ? `<h2 class="section-title">${escapeHtml(p.heading)}</h2>` : ""}${p.subheading ? `<p class="section-sub">${escapeHtml(p.subheading)}</p>` : ""}</div>` : ""}
        <form class="form" onsubmit="event.preventDefault(); alert('Cảm ơn bạn! Thông tin đã được gửi thành công.');">
          ${p.fields
            .map(
              f => `
          <div class="form-group">
            <label>${escapeHtml(f.label)}</label>
            ${f.type === "textarea" ? `<textarea rows="4" placeholder="Nhập ${escapeHtml(f.label).toLowerCase()}..." required></textarea>` : `<input type="${f.type}" placeholder="Nhập ${escapeHtml(f.label).toLowerCase()}..." required />`}
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
        ${p.links && p.links.length > 0 ? `<nav class="footer-links">${p.links.map(l => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`).join("")}</nav>` : ""}
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
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font-family);
      background-color: var(--bg);
      color: var(--fg);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .container { width: min(1180px, 92vw); margin: 0 auto; }
    .section { padding: 5.5rem 0; }
    .section-header { margin-bottom: 3rem; text-align: center; }
    .section-title { font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 0.75rem; }
    .section-sub { font-size: 1.1rem; opacity: 0.8; max-width: 620px; margin: 0 auto; }
    
    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;
      padding: 0.9rem 1.85rem; font-size: 1.05rem; font-weight: 700; border-radius: 12px; cursor: pointer;
      border: 1px solid transparent; transition: all 0.25s ease;
    }
    .btn-primary { background: var(--primary); color: #ffffff; box-shadow: 0 4px 18px color-mix(in srgb, var(--primary) 35%, transparent); }
    .btn-primary:hover { opacity: 0.92; transform: translateY(-2px); }
    .btn-outline { background: transparent; color: var(--fg); border-color: color-mix(in srgb, var(--fg) 25%, transparent); }
    .btn-submit { width: 100%; padding: 1.1rem; font-size: 1.1rem; }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: color-mix(in srgb, var(--primary) 14%, transparent); color: var(--primary); font-size: 0.85rem; font-weight: 700; padding: 0.35rem 0.85rem; border-radius: 999px; }
    .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); }

    /* Hero */
    .s-hero { padding: 6.5rem 0 5.5rem; position: relative; }
    .hero-container { display: grid; gap: 3.5rem; align-items: center; }
    .s-hero-split .hero-container { grid-template-columns: 1.1fr 0.9fr; }
    .hero-title { font-size: clamp(2.5rem, 5.5vw, 4.4rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.03em; margin-bottom: 1.35rem; }
    .hero-sub { font-size: clamp(1.1rem, 2vw, 1.3rem); opacity: 0.85; line-height: 1.6; margin-bottom: 2.25rem; }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .justify-center { justify-content: center; }
    .image-frame { border-radius: 20px; overflow: hidden; box-shadow: 0 25px 60px -10px color-mix(in srgb, var(--fg) 18%, transparent); }
    .hero-img { width: 100%; height: auto; aspect-ratio: 4/3; object-fit: cover; display: block; }

    /* Editorial Hero */
    .s-hero-editorial .s-editorial-title { font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.04em; margin-bottom: 2rem; }
    .s-editorial-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .s-editorial-sub { font-size: 1.25rem; max-width: 580px; opacity: 0.85; }
    .s-editorial-media { width: 100%; aspect-ratio: 21/9; border-radius: 16px; overflow: hidden; }
    .s-editorial-img { width: 100%; height: 100%; object-fit: cover; }

    /* Bento Grid */
    .s-bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .s-bento-card { background: color-mix(in srgb, var(--fg) 4%, var(--bg)); border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s ease; }
    .s-bento-wide { grid-column: span 2; }
    .s-bento-tall { grid-row: span 2; }
    .s-bento-img-wrap { width: 100%; aspect-ratio: 16/10; overflow: hidden; }
    .s-bento-img { width: 100%; height: 100%; object-fit: cover; }
    .s-bento-content { padding: 1.75rem; display: flex; flex-direction: column; flex: 1; }

    /* Split Feature */
    .s-split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4.5rem; align-items: center; }
    .s-split-reverse .s-split-grid { direction: rtl; }
    .s-split-reverse .s-split-col { direction: ltr; }
    .s-split-desc { font-size: 1.1rem; opacity: 0.85; line-height: 1.7; margin: 1rem 0 1.5rem; }
    .s-split-bullets { list-style: none; padding: 0; margin-bottom: 2rem; display: grid; gap: 10px; }
    .s-split-bullets li { display: flex; align-items: center; gap: 10px; font-weight: 500; }
    .bullet-check { background: var(--primary); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; }

    /* Stats */
    .s-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center; }
    .s-stat-val { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: var(--primary); line-height: 1; margin-bottom: 0.5rem; }
    .s-stat-lbl { font-size: 1.1rem; font-weight: 700; }

    /* Menu / Pricelist */
    .s-menu-container { max-width: 860px; margin: 0 auto; display: grid; gap: 3rem; }
    .s-menu-cat-title { font-size: 1.6rem; border-bottom: 2px solid var(--primary); padding-bottom: 0.5rem; margin-bottom: 1.5rem; color: var(--primary); }
    .s-menu-items { display: grid; gap: 1.25rem; }
    .s-menu-line { display: flex; align-items: baseline; gap: 8px; }
    .s-menu-name { font-size: 1.15rem; font-weight: 700; }
    .s-menu-leader { flex: 1; border-bottom: 1px dotted color-mix(in srgb, var(--fg) 30%, transparent); margin: 0 4px; }
    .s-menu-price { font-size: 1.15rem; font-weight: 700; color: var(--primary); }
    .s-menu-desc { font-size: 0.9rem; opacity: 0.75; margin-top: 4px; }

    /* Quote */
    .s-quote-inner { max-width: 800px; margin: 0 auto; text-align: center; }
    .s-quote-text { font-size: clamp(1.4rem, 3vw, 2.2rem); font-style: italic; line-height: 1.45; margin-bottom: 1.5rem; }
    .s-quote-author { font-style: normal; font-weight: 700; display: block; }
    .s-quote-role { font-size: 0.9rem; opacity: 0.75; }

    /* Ticker */
    .s-ticker-wrap { overflow: hidden; white-space: nowrap; background: var(--primary); color: #fff; padding: 12px 0; font-weight: 700; text-transform: uppercase; }
    .s-ticker-track { display: inline-flex; animation: ticker 25s linear infinite; }
    .s-ticker-item { display: inline-flex; align-items: center; gap: 16px; margin-right: 24px; }
    .s-ticker-star { opacity: 0.8; }
    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    /* Cards */
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .card { background: color-mix(in srgb, var(--fg) 4%, var(--bg)); border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; }
    .card-img-wrap { width: 100%; aspect-ratio: 16/10; overflow: hidden; }
    .card-img { width: 100%; height: 100%; object-fit: cover; }
    .card-body { padding: 1.75rem; display: flex; flex-direction: column; flex: 1; }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; }
    .card-icon { font-size: 1.8rem; }
    .card-title { font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary); }
    .card-desc { opacity: 0.85; font-size: 0.98rem; }
    .s-card-price { margin-top: 1rem; font-size: 1.2rem; font-weight: 800; color: var(--primary); }

    /* Gallery */
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    .gallery-item { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 4/3; }
    .gallery-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%); color: #fff; display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem; }

    /* Table & Form */
    .table-wrap { overflow-x: auto; border-radius: 16px; border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent); }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background: color-mix(in srgb, var(--primary) 10%, var(--bg)); color: var(--primary); padding: 1.15rem 1.4rem; font-weight: 700; border-bottom: 2px solid var(--primary); }
    td { padding: 1.05rem 1.4rem; border-bottom: 1px solid color-mix(in srgb, var(--fg) 8%, transparent); }
    .td-lead { font-weight: 600; color: var(--primary); }
    .form-container { max-width: 620px; }
    .form { display: flex; flex-direction: column; gap: 1.35rem; background: color-mix(in srgb, var(--fg) 3%, var(--bg)); padding: 2.5rem; border-radius: 20px; border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent); }
    .form-group { display: flex; flex-direction: column; gap: 0.6rem; font-weight: 700; font-size: 0.95rem; }
    .form-group input, .form-group textarea { padding: 0.95rem 1.15rem; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--fg) 20%, transparent); background: var(--bg); color: var(--fg); font-family: inherit; font-size: 1rem; }
    
    /* Footer */
    .s-footer { border-top: 1px solid color-mix(in srgb, var(--fg) 12%, transparent); padding: 3.5rem 0; }
    .footer-content { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem; }
    .footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .footer-links a { color: var(--primary); text-decoration: none; font-weight: 600; }

    @media (max-width: 900px) {
      .s-bento-grid { grid-template-columns: 1fr; }
      .s-bento-wide, .s-bento-tall { grid-column: span 1; grid-row: span 1; }
      .s-split-grid { grid-template-columns: 1fr; gap: 2.5rem; }
      .s-hero-split .hero-container { grid-template-columns: 1fr; text-align: center; }
      .hero-actions { justify-content: center; }
    }
  </style>
</head>
<body class="style-${styleArchetype}">
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
