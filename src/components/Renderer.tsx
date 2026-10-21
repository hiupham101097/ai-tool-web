import type { CSSProperties } from "react";
import type { Section, Spec } from "../../shared/schema";
import { Hero, Cards, Table, Form, Footer } from "./sections";

type P<T extends Section["type"]> = Extract<Section, { type: T }>["props"];

// Thêm section mới: khai báo trong shared/schema.ts + thêm component vào đây.
const registry: { [K in Section["type"]]: (p: P<K>) => JSX.Element } = {
  hero: Hero, cards: Cards, table: Table, form: Form, footer: Footer,
};

export function Renderer({ spec }: { spec: Spec }) {
  const { theme } = spec;
  const style = {
    "--primary": theme.primary,
    "--bg": theme.background ?? "#ffffff",
    "--fg": theme.text ?? "#18181b",
    fontFamily: `"${theme.font ?? "Be Vietnam Pro"}", system-ui, sans-serif`,
  } as CSSProperties;

  return (
    <div className="site" style={style}>
      {spec.sections.map((s, i) => {
        const C = registry[s.type] as (p: any) => JSX.Element;
        return C ? <C key={i} {...s.props} /> : null;
      })}
    </div>
  );
}
