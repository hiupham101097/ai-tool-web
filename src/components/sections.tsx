import type { Section } from "../../shared/schema";

type P<T extends Section["type"]> = Extract<Section, { type: T }>["props"];

export function Hero({ title, subtitle, cta, align = "center" }: P<"hero">) {
  return (
    <header className="s-hero" style={{ textAlign: align }}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {cta && <button className="s-btn">{cta}</button>}
    </header>
  );
}

export function Cards({ heading, items }: P<"cards">) {
  return (
    <section className="s-block">
      {heading && <h2>{heading}</h2>}
      <div className="s-grid">
        {items.map((it, i) => (
          <article key={i} className="s-card">
            {it.badge && <span className="s-badge">{it.badge}</span>}
            <h3>{it.title}</h3>
            {it.desc && <p>{it.desc}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

export function Table({ heading, columns, rows }: P<"table">) {
  return (
    <section className="s-block">
      {heading && <h2>{heading}</h2>}
      <div className="s-scroll">
        <table className="s-table">
          <thead><tr>{columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

export function Form({ heading, fields, submitLabel = "Gửi" }: P<"form">) {
  return (
    <section className="s-block s-form-wrap">
      {heading && <h2>{heading}</h2>}
      {/* Bản preview: chưa gửi dữ liệu đi đâu. */}
      <div className="s-form">
        {fields.map((f, i) => (
          <label key={i}>
            {f.label}
            {f.type === "textarea" ? <textarea rows={4} /> : <input type={f.type} />}
          </label>
        ))}
        <button className="s-btn" type="button">{submitLabel}</button>
      </div>
    </section>
  );
}

export function Footer({ text, links }: P<"footer">) {
  return (
    <footer className="s-footer">
      <p>{text}</p>
      {links && <nav>{links.map((l, i) => <a key={i} href={l.href} onClick={e => e.preventDefault()}>{l.label}</a>)}</nav>}
    </footer>
  );
}
