import type { Section } from "../../shared/schema";

type P<T extends Section["type"]> = Extract<Section, { type: T }>["props"];

export function Hero({
  title,
  subtitle,
  cta,
  secondaryCta,
  badge,
  image,
  align = "center",
}: P<"hero">) {
  const hasImage = Boolean(image && image.trim());
  const effectiveAlign = hasImage ? "left" : align;

  return (
    <header className={`s-hero ${hasImage ? "s-hero-split" : "s-hero-single"}`} style={{ textAlign: effectiveAlign }}>
      <div className="s-hero-content">
        {badge && (
          <div className="s-hero-badge-wrap">
            <span className="s-hero-badge">
              <span className="s-badge-dot" />
              {badge}
            </span>
          </div>
        )}
        <h1 className="s-hero-title">{title}</h1>
        {subtitle && <p className="s-hero-sub">{subtitle}</p>}
        {(cta || secondaryCta) && (
          <div className={`s-hero-actions ${effectiveAlign === "center" ? "justify-center" : ""}`}>
            {cta && <button className="s-btn s-btn-primary">{cta}</button>}
            {secondaryCta && <button className="s-btn s-btn-outline">{secondaryCta}</button>}
          </div>
        )}
      </div>

      {hasImage && (
        <div className="s-hero-image-wrap">
          <div className="s-image-frame">
            <img src={image} alt={title} className="s-hero-img" loading="lazy" />
            <div className="s-image-glow" />
          </div>
        </div>
      )}
    </header>
  );
}

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
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

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
        <form className="s-form" onSubmit={e => { e.preventDefault(); alert("Cảm ơn bạn! Thông tin đã được tiếp nhận."); }}>
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
