import type { CSSProperties } from "react";
import type { Section, Spec } from "../../shared/schema";
import {
  Hero,
  BentoGrid,
  Cards,
  SplitFeature,
  Stats,
  Menu,
  Quote,
  Ticker,
  Gallery,
  Table,
  Form,
  Footer,
} from "./sections";

type P<T extends Section["type"]> = Extract<Section, { type: T }>["props"];

const registry: { [K in Section["type"]]: (p: P<K>) => JSX.Element } = {
  hero: Hero,
  bento: BentoGrid,
  cards: Cards,
  split_feature: SplitFeature,
  stats: Stats,
  menu: Menu,
  quote: Quote,
  ticker: Ticker,
  gallery: Gallery,
  table: Table,
  form: Form,
  footer: Footer,
};

export function Renderer({ spec }: { spec: Spec }) {
  const { theme } = spec;
  const styleArchetype = theme.style || "modern";

  const style = {
    "--primary": theme.primary,
    "--secondary": theme.secondary || theme.primary,
    "--accent": theme.accent || theme.primary,
    "--bg": theme.background ?? "#ffffff",
    "--fg": theme.text ?? "#18181b",
    fontFamily: `"${theme.font ?? "Be Vietnam Pro"}", system-ui, -apple-system, sans-serif`,
  } as CSSProperties;

  return (
    <div className={`site ai-rendered-site style-${styleArchetype}`} style={style}>
      {spec.sections.map((s, i) => {
        const C = registry[s.type] as (p: any) => JSX.Element;
        return C ? <C key={i} {...s.props} /> : null;
      })}
    </div>
  );
}
