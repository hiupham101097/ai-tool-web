import type { Section } from "../../shared/schema";

type P<T extends Section["type"]> = Extract<Section, { type: T }>["props"];

/* ==========================================================================
   1. HERO (Hỗ trợ 4 kiểu layout khác nhau hoàn toàn)
   ========================================================================== */
export function Hero({
  layout = "split",
  title,
  subtitle,
  cta,
  secondaryCta,
  badge,
  image,
  align = "left",
}: P<"hero">) {
  // Editorial Hero: Chữ khổng lồ, thẩm mỹ tạp chí thời trang/nghệ thuật
  if (layout === "editorial") {
    return (
      <header className="s-hero s-hero-editorial">
        <div className="s-editorial-meta">
          {badge && <span className="s-editorial-badge">{badge}</span>}
        </div>
        <h1 className="s-editorial-title">{title}</h1>
        <div className="s-editorial-bottom">
          {subtitle && <p className="s-editorial-sub">{subtitle}</p>}
          {(cta || secondaryCta) && (
            <div className="s-hero-actions">
              {cta && <button className="s-btn s-btn-primary">{cta}</button>}
              {secondaryCta && <button className="s-btn s-btn-outline">{secondaryCta}</button>}
            </div>
          )}
        </div>
        {image && (
          <div className="s-editorial-media">
            <img src={image} alt={title} className="s-editorial-img" loading="lazy" />
          </div>
        )}
      </header>
    );
  }

  // Centered Hero: Tập trung trung tâm với phông nền lớn
  if (layout === "centered" || align === "center") {
    return (
      <header className="s-hero s-hero-centered">
        <div className="s-hero-centered-inner">
          {badge && (
            <div className="s-hero-badge-wrap">
              <span className="s-hero-badge"><span className="s-badge-dot" />{badge}</span>
            </div>
          )}
          <h1 className="s-hero-title">{title}</h1>
          {subtitle && <p className="s-hero-sub">{subtitle}</p>}
          {(cta || secondaryCta) && (
            <div className="s-hero-actions justify-center">
              {cta && <button className="s-btn s-btn-primary">{cta}</button>}
              {secondaryCta && <button className="s-btn s-btn-outline">{secondaryCta}</button>}
            </div>
          )}
        </div>
        {image && (
          <div className="s-hero-centered-image">
            <img src={image} alt={title} className="s-centered-img" loading="lazy" />
          </div>
        )}
      </header>
    );
  }

  // Minimal Hero: Tối giản, không rườm rà
  if (layout === "minimal") {
    return (
      <header className="s-hero s-hero-minimal">
        {badge && <span className="s-minimal-label">{badge}</span>}
        <h1 className="s-minimal-title">{title}</h1>
        {subtitle && <p className="s-minimal-sub">{subtitle}</p>}
        {cta && <button className="s-btn s-btn-primary s-minimal-cta">{cta}</button>}
      </header>
    );
  }

  // Mặc định: Split 2 cột hiện đại
  return (
    <header className={`s-hero s-hero-split ${image ? "" : "s-hero-no-img"}`}>
      <div className="s-hero-content">
        {badge && (
          <div className="s-hero-badge-wrap">
            <span className="s-hero-badge"><span className="s-badge-dot" />{badge}</span>
          </div>
        )}
        <h1 className="s-hero-title">{title}</h1>
        {subtitle && <p className="s-hero-sub">{subtitle}</p>}
        {(cta || secondaryCta) && (
          <div className="s-hero-actions">
            {cta && <button className="s-btn s-btn-primary">{cta}</button>}
            {secondaryCta && <button className="s-btn s-btn-outline">{secondaryCta}</button>}
          </div>
        )}
      </div>

      {image && (
        <div className="s-hero-image-wrap">
          <div className="s-image-frame">
            <img src={image} alt={title} className="s-hero-img" loading="lazy" />
          </div>
        </div>
      )}
    </header>
  );
}

/* ==========================================================================
   2. BENTO GRID (Bố cục khối bất đối xứng cao cấp kiểu Apple / Linear)
   ========================================================================== */
export function BentoGrid({ heading, subheading, items }: P<"bento">) {
  return (
    <section className="s-block s-bento-section">
      {(heading || subheading) && (
        <div className="s-section-header">
          {heading && <h2>{heading}</h2>}
          {subheading && <p className="s-section-sub">{subheading}</p>}
        </div>
      )}
      <div className="s-bento-grid">
        {items.map((it, i) => {
          const spanClass = it.span === "wide" ? "s-bento-wide" : it.span === "tall" ? "s-bento-tall" : "";
          return (
            <div key={i} className={`s-bento-card ${spanClass}`}>
              {it.image && (
                <div className="s-bento-img-wrap">
                  <img src={it.image} alt={it.title} className="s-bento-img" loading="lazy" />
                </div>
              )}
              <div className="s-bento-content">
                <div className="s-bento-top">
                  {it.icon && <span className="s-bento-icon">{it.icon}</span>}
                  {it.badge && <span className="s-badge">{it.badge}</span>}
                </div>
                <h3>{it.title}</h3>
                {it.desc && <p>{it.desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ==========================================================================
   3. SPLIT FEATURE (Kể chuyện thương hiệu xen kẽ ảnh & lời bình)
   ========================================================================== */
export function SplitFeature({
  badge,
  title,
  description,
  bullets,
  image,
  reverse = false,
  cta,
}: P<"split_feature">) {
  return (
    <section className={`s-block s-split-feature ${reverse ? "s-split-reverse" : ""}`}>
      <div className="s-split-col s-split-text">
        {badge && <span className="s-badge s-split-badge">{badge}</span>}
        <h2>{title}</h2>
        <p className="s-split-desc">{description}</p>
        {bullets && bullets.length > 0 && (
          <ul className="s-split-bullets">
            {bullets.map((b, i) => (
              <li key={i}>
                <span className="s-bullet-check">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {cta && <button className="s-btn s-btn-primary s-split-cta">{cta}</button>}
      </div>
      <div className="s-split-col s-split-media">
        <div className="s-split-frame">
          <img src={image} alt={title} className="s-split-img" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   4. STATS (Các con số ấn tượng & chỉ số nổi bật)
   ========================================================================== */
export function Stats({ heading, items }: P<"stats">) {
  return (
    <section className="s-block s-stats-section">
      {heading && <h2 className="s-stats-heading">{heading}</h2>}
      <div className="s-stats-grid">
        {items.map((it, i) => (
          <div key={i} className="s-stat-card">
            <div className="s-stat-val">{it.value}</div>
            <div className="s-stat-lbl">{it.label}</div>
            {it.desc && <div className="s-stat-desc">{it.desc}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   5. MENU / PRICELIST (Thực đơn / Dịch vụ dạng dòng chấm leader)
   ========================================================================== */
export function Menu({ heading, subheading, categories }: P<"menu">) {
  return (
    <section className="s-block s-menu-section">
      {(heading || subheading) && (
        <div className="s-section-header">
          {heading && <h2>{heading}</h2>}
          {subheading && <p className="s-section-sub">{subheading}</p>}
        </div>
      )}
      <div className="s-menu-container">
        {categories.map((cat, i) => (
          <div key={i} className="s-menu-category">
            <h3 className="s-menu-cat-title">{cat.name}</h3>
            <div className="s-menu-items">
              {cat.items.map((item, j) => (
                <div key={j} className="s-menu-item">
                  <div className="s-menu-line">
                    <span className="s-menu-name">
                      {item.name}
                      {item.badge && <span className="s-badge s-menu-badge">{item.badge}</span>}
                    </span>
                    <span className="s-menu-leader" />
                    <span className="s-menu-price">{item.price}</span>
                  </div>
                  {item.desc && <p className="s-menu-desc">{item.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   6. QUOTE (Trích dẫn phong cách tạp chí / lời chứng thực)
   ========================================================================== */
export function Quote({ quote, author, role, avatar }: P<"quote">) {
  return (
    <section className="s-block s-quote-section">
      <div className="s-quote-inner">
        <span className="s-quote-mark">“</span>
        <blockquote className="s-quote-text">{quote}</blockquote>
        {(author || role) && (
          <div className="s-quote-author-wrap">
            {avatar && <img src={avatar} alt={author || "Author"} className="s-quote-avatar" />}
            <div>
              {author && <cite className="s-quote-author">{author}</cite>}
              {role && <span className="s-quote-role">{role}</span>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
   7. TICKER / MARQUEE (Dải chữ chạy ngang không ngừng)
   ========================================================================== */
export function Ticker({ items }: P<"ticker">) {
  return (
    <div className="s-ticker-wrap">
      <div className="s-ticker-track">
        {items.concat(items).concat(items).map((text, i) => (
          <span key={i} className="s-ticker-item">
            <span className="s-ticker-star">✦</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   8. CARDS / PRODUCTS
   ========================================================================== */
export function Cards({ heading, subheading, items }: P<"cards">) {
  return (
    <section className="s-block s-cards-section">
      {(heading || subheading) && (
        <div className="s-section-header">
          {heading && <h2>{heading}</h2>}
          {subheading && <p className="s-section-sub">{subheading}</p>}
        </div>
      )}
      <div className="s-grid">
        {items.map((it, i) => (
          <article key={i} className="s-card">
            {it.image && (
              <div className="s-card-img-wrap">
                <img src={it.image} alt={it.title} className="s-card-img" loading="lazy" />
              </div>
            )}
            <div className="s-card-body">
              <div className="s-card-top">
                {it.icon && <span className="s-card-icon">{it.icon}</span>}
                {it.badge && <span className="s-badge">{it.badge}</span>}
              </div>
              <h3>{it.title}</h3>
              {it.desc && <p>{it.desc}</p>}
              {it.price && <div className="s-card-price">{it.price}</div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   9. GALLERY
   ========================================================================== */
export function Gallery({ heading, subheading, items }: P<"gallery">) {
  return (
    <section className="s-block s-gallery-section">
      {(heading || subheading) && (
        <div className="s-section-header">
          {heading && <h2>{heading}</h2>}
          {subheading && <p className="s-section-sub">{subheading}</p>}
        </div>
      )}
      <div className="s-gallery-grid">
        {items.map((it, i) => (
          <div key={i} className="s-gallery-item">
            <img src={it.image} alt={it.title || "Gallery image"} className="s-gallery-img" loading="lazy" />
            {(it.title || it.desc) && (
              <div className="s-gallery-overlay">
                {it.title && <h4>{it.title}</h4>}
                {it.desc && <p>{it.desc}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   10. TABLE
   ========================================================================== */
export function Table({ heading, subheading, columns, rows }: P<"table">) {
  return (
    <section className="s-block s-table-section">
      {(heading || subheading) && (
        <div className="s-section-header">
          {heading && <h2>{heading}</h2>}
          {subheading && <p className="s-section-sub">{subheading}</p>}
        </div>
      )}
      <div className="s-scroll s-table-card">
        <table className="s-table">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className={j === 0 ? "s-td-lead" : ""}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ==========================================================================
   11. FORM
   ========================================================================== */
export function Form({ heading, subheading, fields, submitLabel = "Gửi thông tin" }: P<"form">) {
  return (
    <section className="s-block s-form-wrap">
      <div className="s-form-container">
        {(heading || subheading) && (
          <div className="s-section-header">
            {heading && <h2>{heading}</h2>}
            {subheading && <p className="s-section-sub">{subheading}</p>}
          </div>
        )}
        <form className="s-form" onSubmit={e => { e.preventDefault(); alert("Cảm ơn bạn! Thông tin đã được gửi thành công."); }}>
          {fields.map((f, i) => (
            <label key={i} className="s-field-label">
              <span>{f.label}</span>
              {f.type === "textarea" ? (
                <textarea rows={4} placeholder={`Nhập ${f.label.toLowerCase()}...`} required />
              ) : (
                <input type={f.type} placeholder={`Nhập ${f.label.toLowerCase()}...`} required />
              )}
            </label>
          ))}
          <button className="s-btn s-btn-primary s-btn-submit" type="submit">
            {submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ==========================================================================
   12. FOOTER
   ========================================================================== */
export function Footer({ text, links }: P<"footer">) {
  return (
    <footer className="s-footer">
      <div className="s-footer-inner">
        <p className="s-footer-text">{text}</p>
        {links && links.length > 0 && (
          <nav className="s-footer-nav">
            {links.map((l, i) => (
              <a key={i} href={l.href} onClick={e => e.preventDefault()}>
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
