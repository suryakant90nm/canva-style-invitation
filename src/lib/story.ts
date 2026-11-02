import { pagesOf, withPages, makeText, type Doc, type Page, type TextEl } from "@/lib/design";
import { pack } from "@/lib/i18n-copy";
import { getLanguage, type LangCode } from "@/lib/languages";
import { S, D, C, divider, ornament } from "./decor";
import { artBlend } from "./templates/art";

export type StoryEvent = { key: string; date: string; time: string; venue: string };

const W = 700;
const H = 1000;
const GOLD = "#e0bc6a";
const GOLD_D = "#b8933f";
const MAROON = "#7d1226";
const CREAM = "linear-gradient(180deg,#fdf3e3,#f7e2c4)";

const PALETTES: Record<string, { bg: string; accent: string; ink: string }> = {
  main: { bg: "linear-gradient(165deg,#5c0d1c,#8c1c2e 45%,#5c0d1c)", accent: GOLD, ink: "#fff3d6" },
  haldi: { bg: "linear-gradient(180deg,#fff9c4,#ffe082)", accent: "#e65100", ink: "#6b3a00" },
  mehendi: { bg: "linear-gradient(180deg,#fff6d8,#ffe6a8)", accent: "#2e7d32", ink: "#6b3a00" },
  sangeet: { bg: "linear-gradient(165deg,#160b2e,#3a1160 55%,#0d0620)", accent: "#27e6ff", ink: "#ffffff" },
  shaadi: { bg: CREAM, accent: MAROON, ink: "#5a2d0c" },
  reception: { bg: "linear-gradient(180deg,#fff5f8,#ffe4ec)", accent: "#ad1457", ink: "#8a4a63" },
};

function eventPage(opts: {
  lang: LangCode;
  eventKey: string;
  title: string;
  tagline: string;
  emoji: string;
  couple: string;
  date: string;
  time: string;
  venue: string;
  labels: { date: string; time: string; venue: string };
  index: number;
  total: number;
}): Page {
  const p = PALETTES[opts.eventKey] ?? PALETTES.main;
  const isDark = opts.eventKey === "main" || opts.eventKey === "sangeet";
  /** small caps-style caption; text is passed separately so it is never overridden */
  const label = (): Partial<TextEl> => ({ fontFamily: "Montserrat", fontSize: 15, letterSpacing: 4, color: p.accent, fontWeight: 700 });

  const els = [
    ...ornament(W, 54, `${opts.emoji}`, 46),
    C(W, opts.title, 126, { fontFamily: getLanguage(opts.lang).font, fontSize: opts.title.length > 14 ? 58 : 72, color: isDark ? p.accent : p.accent, lineHeight: 1.1 }),
    C(W, opts.tagline, 226, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: isDark ? "#f3d9a4" : "#6b5a3a" }),
    ...divider(W, 292, p.accent, "floral", 220),

    ...artBlend("ganesha-gold", W / 2 - 70, 316, 140, 140, { opacity: isDark ? 0.9 : 1 }),

    C(W, opts.couple, 486, { fontFamily: "Great Vibes", fontSize: 92, color: isDark ? GOLD : MAROON, lineHeight: 1.05 }),

    S("rect", 110, 620, W - 220, 250, {
      fill: isDark ? "rgba(255,255,255,0.08)" : "#fffdf5",
      radius: 24,
      stroke: p.accent,
      strokeWidth: 1.6,
    }),

    C(W, opts.labels.date.toUpperCase(), 648, label()),
    C(W, opts.date, 678, { fontFamily: "Cormorant Garamond", fontSize: 34, color: isDark ? p.ink : "#3a2d1a", fontWeight: 400 }),

    C(W, opts.labels.time.toUpperCase(), 736, label()),
    C(W, opts.time, 766, { fontFamily: "Montserrat", fontSize: 24, color: isDark ? p.ink : "#3a2d1a" }),

    C(W, opts.labels.venue.toUpperCase(), 818, label()),
    C(W, opts.venue, 846, { fontFamily: "Cormorant Garamond", fontSize: 26, color: isDark ? p.ink : "#3a2d1a", lineHeight: 1.3 }),

    ...divider(W, 926, p.accent, "dots", 170),
    C(W, `${opts.index} / ${opts.total}`, 944, { fontFamily: "Montserrat", fontSize: 14, letterSpacing: 4, color: isDark ? "#d6c6ff" : "#a8802f" }),
  ];

  return { id: `pg-${opts.eventKey}`, name: opts.title, background: p.bg, elements: els };
}

/**
 * Build a multi-page "story invite": one card per celebration event.
 * Haldi → Mehendi → Sangeet → Shaadi → Reception, in the chosen language.
 */
export function buildStoryInvite(opts: {
  lang: LangCode;
  couple: string;
  events: StoryEvent[];
  includeGanesha?: boolean;
}): Doc {
  const pk = pack(opts.lang);
  const base: Doc = D(W, H, CREAM, []);

  const chosen = opts.events.filter((e) => e.date || e.venue || e.time);
  if (!chosen.length) return base;

  const pages: Page[] = chosen.map((ev, i) => {
    const def = pk.events.find((x) => x.key === ev.key) ?? pk.events[0];
    return eventPage({
      lang: opts.lang,
      eventKey: ev.key,
      title: def.title,
      tagline: def.tagline,
      emoji: def.emoji,
      couple: opts.couple,
      date: ev.date || "—",
      time: ev.time || "—",
      venue: ev.venue || "—",
      labels: pk.labels,
      index: i + 1,
      total: chosen.length,
    });
  });

  return withPages(base, pages);
}

/** Language-appropriate default events (all 6, user can blank out what they don't need). */
export function defaultStoryEvents(lang: LangCode): StoryEvent[] {
  const pk = pack(lang);
  const seedDates: Record<string, string> = {
    haldi: "10 December 2026",
    mehendi: "11 December 2026",
    sangeet: "12 December 2026",
    shaadi: "14 December 2026",
    reception: "15 December 2026",
    main: "14 December 2026",
  };
  return pk.events
    .filter((e) => e.key !== "main")
    .map((e) => ({ key: e.key, date: seedDates[e.key] ?? "", time: "7:00 PM", venue: "" }));
}
