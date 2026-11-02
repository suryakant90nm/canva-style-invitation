"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DesignView, ElementBody, makeU } from "@/components/DesignView";
import { CATEGORIES } from "@/lib/categories";
import { ART } from "@/lib/art";
import {
  SIZE_PRESETS,
  makeImage,
  makeShape,
  makeText,
  type Doc,
  type El,
  type ShapeKind,
  type TextEl,
} from "@/lib/design";
import { Btn, ColorPicker } from "./ui";

export type PanelApi = {
  doc: Doc;
  category: string;
  selectedId: string | null;
  addEl: (el: El, center?: boolean) => void;
  addImage: (src: string) => void;
  setBackground: (css: string) => void;
  applyDoc: (doc: Doc) => void;
  resizeTo: (w: number, h: number) => void;
  select: (id: string | null) => void;
  updateEl: (id: string, patch: Record<string, unknown>) => void;
  deleteEl: (id: string) => void;
  reorder: (id: string, dir: "up" | "down" | "front" | "back") => void;
  uploads: string[];
  onUpload: (files: FileList | null) => Promise<void>;
};

const H = ({ children }: { children: ReactNode }) => (
  <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400 first:mt-0">{children}</h3>
);

/* ───────────────────────── Templates ───────────────────────── */
type TplRow = { slug: string; title: string; category: string; data: Doc };

export function TemplatesPanel({ api }: { api: PanelApi }) {
  const [cat, setCat] = useState(api.category);
  const [rows, setRows] = useState<TplRow[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(`/api/templates${cat ? `?category=${cat}` : ""}`)
      .then((r) => r.json())
      .then((j: { templates: TplRow[] }) => alive && setRows(j.templates))
      .catch(() => alive && setRows([]));
    return () => {
      alive = false;
    };
  }, [cat]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {[{ slug: "", name: "All" }, ...CATEGORIES].map((c) => (
          <button
            key={c.slug}
            onClick={() => {
              setRows(null);
              setCat(c.slug);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              cat === c.slug ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Clicking a template replaces your current design (you can undo with Ctrl+Z).
      </p>
      {!rows && <p className="text-sm text-slate-400">Loading…</p>}
      <div className="grid grid-cols-2 gap-3">
        {rows?.map((t) => (
          <button
            key={t.slug}
            onClick={() => api.applyDoc(t.data)}
            className="group text-left"
            title={t.title}
          >
            <div className="overflow-hidden rounded-lg bg-slate-100 p-1.5 ring-1 ring-slate-200 transition group-hover:ring-violet-400">
              <div className="flex aspect-[4/5] items-center justify-center">
                <div style={{ width: `${Math.min(100, (t.data.width / t.data.height / 0.8) * 100)}%` }}>
                  <DesignView doc={t.data} />
                </div>
              </div>
            </div>
            <p className="mt-1 truncate text-[11px] text-slate-600">{t.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

const DIVIDERS = ["— ❖ —", "❀ ❀ ❀", "✦ ✦ ✦", "♥ ─────── ♥", "• • •", "❦", "✿ ━━━ ✿"];

const EMOJI_SETS: { name: string; items: string[] }[] = [
  { name: "Wedding", items: ["💍", "💒", "👰", "🤵", "🕉️", "🪔", "💐", "🥂", "❤️", "💞", "🌹", "🌸", "🌼", "🌺", "🪷", "🌿", "🍃", "✨", "🎶", "🐚"] },
  { name: "Party", items: ["🎈", "🎂", "🎉", "🎁", "🎊", "🥳", "🍰", "🧁", "🍭", "🎵", "🎤", "🪩", "🍹", "🎆", "🎇", "🏡", "🎓", "🕯️", "🍾", "☕"] },
  { name: "Baby", items: ["🍼", "🧸", "👶", "🎀", "🐘", "🦁", "🦒", "🐥", "⭐", "🌙", "☁️", "🌈", "🦄", "🐣", "👑", "💙", "💖", "🚼", "🤰", "🌴"] },
  { name: "Festival", items: ["🪔", "✨", "🎆", "🎇", "🕉️", "🌟", "🪁", "🌸", "🛕", "🪷", "🎊", "🧨"] },
];

/* ───────────────────────── Elements ───────────────────────── */
const SHAPES: { kind: ShapeKind; label: string }[] = [
  { kind: "rect", label: "Square" },
  { kind: "circle", label: "Circle" },
  { kind: "ring", label: "Ring" },
  { kind: "semi", label: "Semi circle" },
  { kind: "quarter", label: "Quarter" },
  { kind: "leaf", label: "Leaf" },
  { kind: "wave", label: "Wave" },
  { kind: "flower", label: "Flower" },
  { kind: "triangle", label: "Triangle" },
  { kind: "diamond", label: "Diamond" },
  { kind: "star", label: "Star" },
  { kind: "heart", label: "Heart" },
  { kind: "hexagon", label: "Hexagon" },
  { kind: "arch", label: "Arch" },
];

/** Ready-made photo frames & collages – click, then click a frame to add your photo. */
const FRAME_SETS: { name: string; build: (W: number, Hh: number) => El[] }[] = [
  { name: "1 full photo", build: (W, Hh) => [makeImage("", { x: 0, y: 0, w: W, h: Hh, frame: "rect" })] },
  {
    name: "Rounded frame",
    build: (W, Hh) => [makeImage("", { x: W * 0.1, y: Hh * 0.1, w: W * 0.8, h: Hh * 0.8, frame: "rounded", radius: 32 })],
  },
  {
    name: "Circle frame",
    build: (W, Hh) => [makeImage("", { x: W * 0.2, y: Hh * 0.15, w: W * 0.6, h: W * 0.6, frame: "circle" })],
  },
  {
    name: "Arch frame",
    build: (W, Hh) => [makeImage("", { x: W * 0.2, y: Hh * 0.12, w: W * 0.6, h: Hh * 0.65, frame: "arch" })],
  },
  {
    name: "2 photos",
    build: (W, Hh) => [
      makeImage("", { x: W * 0.06, y: Hh * 0.22, w: W * 0.42, h: Hh * 0.42, frame: "rect" }),
      makeImage("", { x: W * 0.52, y: Hh * 0.22, w: W * 0.42, h: Hh * 0.42, frame: "rect" }),
    ],
  },
  {
    name: "1 big + 2",
    build: (W, Hh) => [
      makeImage("", { x: W * 0.1, y: Hh * 0.16, w: W * 0.8, h: Hh * 0.4, frame: "rect" }),
      makeImage("", { x: W * 0.1, y: Hh * 0.58, w: W * 0.39, h: Hh * 0.26, frame: "rect" }),
      makeImage("", { x: W * 0.51, y: Hh * 0.58, w: W * 0.39, h: Hh * 0.26, frame: "rect" }),
    ],
  },
  {
    name: "4 photo grid",
    build: (W, Hh) => [
      makeImage("", { x: W * 0.06, y: Hh * 0.14, w: W * 0.42, h: Hh * 0.34, frame: "rect" }),
      makeImage("", { x: W * 0.52, y: Hh * 0.14, w: W * 0.42, h: Hh * 0.34, frame: "rect" }),
      makeImage("", { x: W * 0.06, y: Hh * 0.5, w: W * 0.42, h: Hh * 0.34, frame: "rect" }),
      makeImage("", { x: W * 0.52, y: Hh * 0.5, w: W * 0.42, h: Hh * 0.34, frame: "rect" }),
    ],
  },
  {
    name: "3 photo stack",
    build: (W, Hh) => [
      makeImage("", { x: W * 0.12, y: Hh * 0.1, w: W * 0.5, h: Hh * 0.22, frame: "rect", rotation: -3 }),
      makeImage("", { x: W * 0.2, y: Hh * 0.36, w: W * 0.5, h: Hh * 0.22, frame: "rect", rotation: 3 }),
      makeImage("", { x: W * 0.14, y: Hh * 0.62, w: W * 0.5, h: Hh * 0.22, frame: "rect", rotation: -2 }),
    ],
  },
  {
    name: "Polaroid",
    build: (W, Hh) => [
      makeShape("rect", { x: W * 0.2, y: Hh * 0.16, w: W * 0.6, h: Hh * 0.5, fill: "#ffffff", radius: 6, rotation: -2 }),
      makeImage("", { x: W * 0.24, y: Hh * 0.2, w: W * 0.52, h: Hh * 0.36, frame: "rect", rotation: -2 }),
      makeText("cheese! 📸", { x: W * 0.2, y: Hh * 0.58, w: W * 0.6, h: Hh * 0.05, fontFamily: "Caveat", fontSize: 34, color: "#6b7280", align: "center", rotation: -2 }),
    ],
  },
  {
    name: "Film strip",
    build: (W, Hh) => [
      makeShape("rect", { x: W * 0.08, y: Hh * 0.08, w: W * 0.84, h: Hh * 0.84, fill: "#141414", radius: 10 }),
      makeImage("", { x: W * 0.14, y: Hh * 0.12, w: W * 0.72, h: Hh * 0.36, frame: "rect" }),
      makeImage("", { x: W * 0.14, y: Hh * 0.5, w: W * 0.35, h: Hh * 0.3, frame: "rect" }),
      makeImage("", { x: W * 0.51, y: Hh * 0.5, w: W * 0.35, h: Hh * 0.3, frame: "rect" }),
    ],
  },
];

/* ───────────────────────── Elements ───────────────────────── */
export function ElementsPanel({ api }: { api: PanelApi }) {
  const { doc } = api;
  const u = makeU("px", 1);
  const W = doc.width;
  const Hh = doc.height;
  return (
    <div>
      <H>Shapes</H>
      <div className="grid grid-cols-4 gap-2">
        {SHAPES.map((s) => {
          const preview = makeShape(s.kind, { w: 44, h: 44, fill: "#7c3aed" });
          return (
            <button
              key={s.kind}
              title={s.label}
              onClick={() => api.addEl(makeShape(s.kind, { w: 200, h: s.kind === "arch" ? 260 : 200, fill: "#c9a24b" }))}
              className="grid aspect-square place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200 transition hover:bg-violet-50 hover:ring-violet-300"
            >
              <div style={{ width: 44, height: 44, position: "relative" }}>
                <ElementBody el={preview} u={u} />
              </div>
            </button>
          );
        })}
      </div>

      <H>Lines</H>
      <div className="grid grid-cols-2 gap-2">
        {[2, 4, 8].map((t) => (
          <button
            key={t}
            onClick={() => api.addEl(makeShape("line", { w: 300, h: t, strokeWidth: t, stroke: "#c9a24b" }))}
            className="flex h-12 items-center rounded-xl bg-slate-50 px-4 ring-1 ring-slate-200 hover:bg-violet-50"
          >
            <span className="block w-full bg-slate-700" style={{ height: t }} />
          </button>
        ))}
      </div>

      <H>Borders &amp; frames</H>
      <div className="grid grid-cols-3 gap-2">
        {[
          { name: "Thin", f: () => [makeShape("rect", { x: 30, y: 30, w: W - 60, h: Hh - 60, fill: "transparent", stroke: "#c9a24b", strokeWidth: 2 })] },
          {
            name: "Double",
            f: () => [
              makeShape("rect", { x: 28, y: 28, w: W - 56, h: Hh - 56, fill: "transparent", stroke: "#c9a24b", strokeWidth: 3 }),
              makeShape("rect", { x: 44, y: 44, w: W - 88, h: Hh - 88, fill: "transparent", stroke: "#c9a24b", strokeWidth: 1.5 }),
            ],
          },
          { name: "Rounded", f: () => [makeShape("rect", { x: 30, y: 30, w: W - 60, h: Hh - 60, fill: "transparent", stroke: "#c9a24b", strokeWidth: 3, radius: 28 })] },
        ].map((b) => (
          <button
            key={b.name}
            onClick={() => b.f().forEach((el) => api.addEl(el, false))}
            className="rounded-xl bg-slate-50 py-3 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-violet-50"
          >
            {b.name}
          </button>
        ))}
      </div>

      <H>Dividers</H>
      <div className="grid grid-cols-2 gap-2">
        {DIVIDERS.map((d) => (
          <button
            key={d}
            onClick={() =>
              api.addEl(makeText(d, { w: Math.min(W - 100, 420), fontSize: 32, fontFamily: "Cormorant Garamond", color: "#c9a24b" }))
            }
            className="truncate rounded-xl bg-slate-50 px-2 py-2.5 text-center text-lg text-amber-600 ring-1 ring-slate-200 hover:bg-violet-50"
          >
            {d}
          </button>
        ))}
      </div>

      {EMOJI_SETS.map((set) => (
        <div key={set.name}>
          <H>{set.name} stickers</H>
          <div className="grid grid-cols-5 gap-1.5">
            {set.items.map((e) => (
              <button
                key={e}
                onClick={() => api.addEl(makeText(e, { w: 120, fontSize: 80, lineHeight: 1.1 }))}
                className="grid aspect-square place-items-center rounded-lg text-2xl transition hover:scale-110 hover:bg-violet-50"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Premium illustration library – one click adds the artwork to the canvas. */
export function ArtPanel({ api }: { api: PanelApi }) {
  const [group, setGroup] = useState<string>("All");
  const groups = ["All", ...Array.from(new Set(ART.map((a) => a.group)))];
  const list = group === "All" ? ART : ART.filter((a) => a.group === group);
  const W = api.doc.width;
  return (
    <div>
      <p className="mb-3 rounded-lg bg-violet-50 px-3 py-2 text-[11px] leading-snug text-violet-900">
        Premium illustrations (free, included with the app). Click any artwork to add it — then drag, resize and
        recolour the card behind it.
      </p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              group === g ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {list.map((a) => (
          <button
            key={a.id}
            title={a.name}
            onClick={() => {
              const h = a.ratio >= 1 ? W * 0.6 : W * 0.8;
              api.addImage(a.src);
            }}
            className="group overflow-hidden rounded-xl bg-slate-50 p-1.5 ring-1 ring-slate-200 transition hover:ring-violet-400"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.src} alt={a.name} className="h-24 w-full object-contain" />
            <span className="mt-1 block truncate text-[10px] font-medium text-slate-600">{a.name}</span>
          </button>
        ))}
      </div>
      <H>Dividers</H>
      <div className="grid grid-cols-2 gap-2">
        {DIVIDERS.map((d) => (
          <button
            key={d}
            onClick={() =>
              api.addEl(makeText(d, { w: Math.min(W - 100, 420), fontSize: 32, fontFamily: "Cormorant Garamond", color: "#c9a24b" }))
            }
            className="truncate rounded-xl bg-slate-50 px-2 py-2.5 text-center text-lg text-amber-600 ring-1 ring-slate-200 hover:bg-violet-50"
          >
            {d}
          </button>
        ))}
      </div>

      {EMOJI_SETS.map((set) => (
        <div key={set.name}>
          <H>{set.name} stickers</H>
          <div className="grid grid-cols-5 gap-1.5">
            {set.items.map((e) => (
              <button
                key={e}
                onClick={() => api.addEl(makeText(e, { w: 120, fontSize: 80, lineHeight: 1.1 }))}
                className="grid aspect-square place-items-center rounded-lg text-2xl transition hover:scale-110 hover:bg-violet-50"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Text ───────────────────────── */
const TEXT_STYLES: { label: string; sample: string; props: Partial<TextEl>; w?: number }[] = [
  { label: "Script title", sample: "Aarav & Ananya", props: { fontFamily: "Great Vibes", fontSize: 84, color: "#8c1c2e" } },
  { label: "Elegant caps", sample: "THE WEDDING OF", props: { fontFamily: "Cinzel", fontSize: 30, letterSpacing: 6, color: "#1f2937" } },
  { label: "Serif italic", sample: "Together with their families", props: { fontFamily: "Cormorant Garamond", fontSize: 34, italic: true, color: "#4b5563" } },
  { label: "Bold poster", sample: "PARTY TIME", props: { fontFamily: "Abril Fatface", fontSize: 72, color: "#7b61ff" } },
  { label: "Playful", sample: "Let's Celebrate!", props: { fontFamily: "Pacifico", fontSize: 54, color: "#ff5e7e" } },
  { label: "Handwritten", sample: "Dinner & dancing to follow", props: { fontFamily: "Caveat", fontSize: 44, fontWeight: 700, color: "#2e7d32" } },
  { label: "Modern spaced", sample: "SATURDAY · 14 DEC · 7 PM", props: { fontFamily: "Montserrat", fontSize: 22, letterSpacing: 5, fontWeight: 700, color: "#111827" } },
  { label: "Hindi heading", sample: "शुभ विवाह", props: { fontFamily: "Yatra One", fontSize: 72, color: "#b8560a" } },
  { label: "Hindi shloka", sample: "॥ श्री गणेशाय नमः ॥", props: { fontFamily: "Tiro Devanagari Hindi", fontSize: 34, color: "#9a6b00" } },
  { label: "Kids fun", sample: "Baby Shower", props: { fontFamily: "Fredoka", fontSize: 60, fontWeight: 600, color: "#2d6cdf" } },
];

const PHRASES = [
  "You're Invited",
  "Save the Date",
  "Together with their families",
  "Request the pleasure of your company",
  "Date · Time · Venue",
  "RSVP by 1st of next month",
  "Dress code: Traditional",
  "Dinner & drinks to follow",
  "गोद भराई",
  "मेहंदी & हल्दी",
  "Baby Shower",
  "It's a Boy!",
  "It's a Girl!",
  "Join us to celebrate",
];

export function TextPanel({ api }: { api: PanelApi }) {
  return (
    <div>
      <button
        onClick={() => api.addEl(makeText("Add a heading", { w: 520, fontSize: 64, fontWeight: 700, fontFamily: "Poppins" }))}
        className="mb-2 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700"
      >
        + Add a text box
      </button>
      <div className="grid gap-2">
        <button
          onClick={() => api.addEl(makeText("Heading", { w: 520, fontSize: 64, fontWeight: 700 }))}
          className="rounded-xl bg-slate-50 px-3 py-2 text-left text-2xl font-bold ring-1 ring-slate-200 hover:bg-violet-50"
        >
          Heading
        </button>
        <button
          onClick={() => api.addEl(makeText("Subheading", { w: 480, fontSize: 36, fontWeight: 700 }))}
          className="rounded-xl bg-slate-50 px-3 py-2 text-left text-lg font-semibold ring-1 ring-slate-200 hover:bg-violet-50"
        >
          Subheading
        </button>
        <button
          onClick={() => api.addEl(makeText("A little bit of body text", { w: 460, fontSize: 24 }))}
          className="rounded-xl bg-slate-50 px-3 py-2 text-left text-sm ring-1 ring-slate-200 hover:bg-violet-50"
        >
          A little bit of body text
        </button>
      </div>

      <H>Styled text</H>
      <div className="grid gap-2">
        {TEXT_STYLES.map((s) => (
          <button
            key={s.label}
            onClick={() => api.addEl(makeText(s.sample, { w: Math.min(api.doc.width - 80, 560), ...s.props }))}
            className="overflow-hidden rounded-xl bg-slate-50 px-3 py-2.5 text-center ring-1 ring-slate-200 transition hover:bg-violet-50 hover:ring-violet-300"
            title={s.label}
          >
            <span
              style={{
                fontFamily: `'${s.props.fontFamily}'`,
                fontStyle: s.props.italic ? "italic" : "normal",
                fontWeight: s.props.fontWeight ?? 400,
                color: s.props.color,
                letterSpacing: (s.props.letterSpacing ?? 0) / 4,
                fontSize: Math.min(28, (s.props.fontSize ?? 30) / 2.2),
                lineHeight: 1.2,
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {s.sample}
            </span>
          </button>
        ))}
      </div>

      <H>Quick phrases</H>
      <div className="flex flex-wrap gap-1.5">
        {PHRASES.map((p) => (
          <button
            key={p}
            onClick={() =>
              api.addEl(
                makeText(p, {
                  w: Math.min(api.doc.width - 80, 520),
                  fontSize: 36,
                  fontFamily: /[\u0900-\u097F]/.test(p) ? "Yatra One" : "Cormorant Garamond",
                  color: "#1f2937",
                }),
              )
            }
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700 hover:bg-violet-100 hover:text-violet-700"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Photos ───────────────────────── */
type Stock = { id: string; thumb: string; full: string; credit: string };

export function PhotosPanel({ api }: { api: PanelApi }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("wedding flowers");
  const [stock, setStock] = useState<Stock[]>([]);
  const [provider, setProvider] = useState<string | null>(null);
  const [premium, setPremium] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function search(term: string) {
    setLoading(true);
    setFailed(false);
    try {
      const r = await fetch(`/api/stock?q=${encodeURIComponent(term)}`);
      const j = (await r.json()) as { photos: Stock[]; provider?: string; premium?: boolean };
      setStock(j.photos ?? []);
      setProvider(j.provider ?? null);
      setPremium(!!j.premium);
      setFailed(!j.photos?.length);
    } catch {
      setStock([]);
      setFailed(true);
    }
    setLoading(false);
  }
  useEffect(() => {
    void search("wedding flowers");
  }, []);

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={async (e) => {
          await api.onUpload(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700"
      >
        ⬆ Upload your photo
      </button>

      {api.uploads.length > 0 && (
        <>
          <H>Your uploads</H>
          <div className="grid grid-cols-3 gap-2">
            {api.uploads.map((src, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full cursor-pointer object-cover" onClick={() => api.addImage(src)} />
                <button
                  onClick={() => api.setBackground(`url("${src}") center / cover no-repeat`)}
                  className="absolute inset-x-0 bottom-0 hidden bg-black/60 py-0.5 text-[10px] text-white group-hover:block"
                >
                  Use as background
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <H>Free stock photos</H>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void search(q);
        }}
        className="flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search photos…"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
        />
        <button className="rounded-lg bg-slate-900 px-3 text-sm font-medium text-white">Go</button>
      </form>
      {loading && <p className="mt-3 text-sm text-slate-400">Searching…</p>}
      {provider && !premium && (
        <p className="mt-2 text-[11px] leading-snug text-slate-500">
          Free stock photos{provider === "picsum" ? "" : ` · ${provider}`} · no API key needed. Add a{" "}
          <code>PEXELS_API_KEY</code> for even better results.
        </p>
      )}
      {provider && premium && (
        <p className="mt-2 text-[11px] text-slate-500">Premium photos via {provider} ✓</p>
      )}
      {failed && (
        <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          <b>Photos load nahi ho paayi.</b> Internet check karke dobara search karein, ya apni photo upload karein.
        </div>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {stock.map((p) => (
          <div key={p.id} className="group relative overflow-hidden rounded-lg ring-1 ring-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.thumb} alt="" className="h-28 w-full cursor-pointer object-cover" onClick={() => api.addImage(p.full)} />
            <button
              onClick={() => api.setBackground(`url("${p.full}") center / cover no-repeat`)}
              className="absolute inset-x-0 bottom-0 hidden bg-black/60 py-0.5 text-[10px] text-white group-hover:block"
            >
              Use as background
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Background ───────────────────────── */
const SOLIDS = [
  "#ffffff", "#fbf3ee", "#fff7e6", "#fff4cf", "#ffeef3", "#ffe3ee", "#d8efff", "#e4f6ee",
  "#f6efe0", "#d6b98f", "#000000", "#111111", "#0b1d3a", "#0f3d2e", "#5a0f1d", "#8c1c2e",
];
const GRADIENTS = [
  "linear-gradient(160deg,#5a0f1d,#8c1c2e)",
  "linear-gradient(135deg,#ffd6a5,#ff9aa2)",
  "linear-gradient(180deg,#fff0ea,#ffd9d0)",
  "linear-gradient(180deg,#d8efff,#a9d8ff)",
  "linear-gradient(180deg,#ffe3ee,#ffc1d8)",
  "linear-gradient(180deg,#0d1b4c,#27408b)",
  "linear-gradient(160deg,#1a0b3b,#3d0f5c 55%,#10163f)",
  "linear-gradient(170deg,#2b0a3d,#6a1b4d 55%,#c2410c)",
  "linear-gradient(180deg,#8fe3ff,#1aa7d8)",
  "linear-gradient(135deg,#f6d365,#fda085)",
  "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
  "linear-gradient(135deg,#d4fc79,#96e6a1)",
];
const PATTERNS = [
  "radial-gradient(#e0c9a6 1.5px, transparent 1.6px) 0 0 / 22px 22px, #fff8ee",
  "radial-gradient(#ffc2d6 2px, transparent 2.1px) 0 0 / 26px 26px, #fff0f5",
  "repeating-linear-gradient(45deg,#fff 0 14px,#f3f4f6 14px 28px)",
  "repeating-linear-gradient(90deg,#fff7e6 0 20px,#ffeccc 20px 40px)",
  "linear-gradient(#e5e7eb 1px, transparent 1px) 0 0 / 28px 28px, linear-gradient(90deg,#e5e7eb 1px, transparent 1px) 0 0 / 28px 28px, #ffffff",
  "radial-gradient(circle at 20% 20%,#ffd1e0 0 18%,transparent 19%), radial-gradient(circle at 80% 70%,#cdeedd 0 22%,transparent 23%), #fffaf5",
];

export function BackgroundPanel({ api }: { api: PanelApi }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cur = api.doc.background;
  const Swatch = ({ css }: { css: string }) => (
    <button
      onClick={() => api.setBackground(css)}
      className={`aspect-square rounded-lg ring-2 transition hover:scale-105 ${cur === css ? "ring-violet-500" : "ring-slate-200"}`}
      style={{ background: css }}
    />
  );
  return (
    <div>
      <H>Custom colour</H>
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
        <ColorPicker value={/^#/.test(cur) ? cur : "#ffffff"} onChange={api.setBackground} title="Background colour" />
        <span className="text-sm text-slate-600">Pick any colour</span>
      </div>
      <H>Solid colours</H>
      <div className="grid grid-cols-6 gap-2">
        {SOLIDS.map((c) => (
          <Swatch key={c} css={c} />
        ))}
      </div>
      <H>Gradients</H>
      <div className="grid grid-cols-4 gap-2">
        {GRADIENTS.map((c) => (
          <Swatch key={c} css={c} />
        ))}
      </div>
      <H>Patterns</H>
      <div className="grid grid-cols-3 gap-2">
        {PATTERNS.map((c) => (
          <Swatch key={c} css={c} />
        ))}
      </div>
      <H>Photo background</H>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) {
            const src = await readImage(f);
            api.setBackground(`url("${src}") center / cover no-repeat`);
          }
          e.target.value = "";
        }}
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-xl border border-dashed border-violet-300 bg-violet-50 py-3 text-sm font-medium text-violet-700 hover:bg-violet-100"
      >
        ⬆ Upload background image
      </button>
    </div>
  );
}

/** Downscale to max 1600px & return data URL (keeps DB payload small). */
export async function readImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const max = 1600;
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * s);
    c.height = Math.round(img.naturalHeight * s);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return file.type === "image/png" && c.width * c.height < 900_000
      ? c.toDataURL("image/png")
      : c.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ───────────────────────── Layers ───────────────────────── */
function labelOf(el: El): string {
  if (el.type === "text") return el.text.replace(/\s+/g, " ").slice(0, 28) || "Text";
  if (el.type === "image") return "Photo";
  return el.shape[0].toUpperCase() + el.shape.slice(1);
}
const iconOf = (el: El) => (el.type === "text" ? "T" : el.type === "image" ? "🖼" : "◆");

export function LayersPanel({ api }: { api: PanelApi }) {
  const list = [...api.doc.elements].reverse();
  if (!list.length) return <p className="text-sm text-slate-500">No layers yet. Add text, shapes or photos.</p>;
  return (
    <div className="space-y-1.5">
      {list.map((el) => (
        <div
          key={el.id}
          onClick={() => api.select(el.id)}
          className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm ring-1 transition ${
            api.selectedId === el.id ? "bg-violet-50 ring-violet-300" : "bg-white ring-slate-200 hover:bg-slate-50"
          }`}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">
            {iconOf(el)}
          </span>
          <span className="min-w-0 flex-1 truncate text-slate-800">{labelOf(el)}</span>
          <div className="flex shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
            <Btn title="Bring forward" onClick={() => api.reorder(el.id, "up")} className="!h-7 !min-w-7">↑</Btn>
            <Btn title="Send backward" onClick={() => api.reorder(el.id, "down")} className="!h-7 !min-w-7">↓</Btn>
            <Btn title={el.locked ? "Unlock" : "Lock"} active={el.locked} onClick={() => api.updateEl(el.id, { locked: !el.locked })} className="!h-7 !min-w-7">
              {el.locked ? "🔒" : "🔓"}
            </Btn>
            <Btn title="Delete" onClick={() => api.deleteEl(el.id)} className="!h-7 !min-w-7 hover:!bg-rose-50 hover:!text-rose-600">✕</Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Resize ───────────────────────── */
export function ResizePanel({ api }: { api: PanelApi }) {
  const [w, setW] = useState(api.doc.width);
  const [h, setH] = useState(api.doc.height);
  useEffect(() => {
    setW(api.doc.width);
    setH(api.doc.height);
  }, [api.doc.width, api.doc.height]);
  return (
    <div>
      <H>Presets</H>
      <div className="grid gap-2">
        {SIZE_PRESETS.map((s) => (
          <button
            key={s.name}
            onClick={() => api.resizeTo(s.w, s.h)}
            className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm ring-1 transition hover:bg-violet-50 ${
              api.doc.width === s.w && api.doc.height === s.h ? "bg-violet-50 ring-violet-300" : "bg-slate-50 ring-slate-200"
            }`}
          >
            <span className="font-medium text-slate-800">{s.name}</span>
            <span className="text-xs text-slate-400">
              {s.w}×{s.h}
            </span>
          </button>
        ))}
      </div>
      <H>Custom size (px)</H>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={w}
          min={200}
          max={4000}
          onChange={(e) => setW(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <span className="text-slate-400">×</span>
        <input
          type="number"
          value={h}
          min={200}
          max={4000}
          onChange={(e) => setH(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <button
        onClick={() => api.resizeTo(Math.min(4000, Math.max(200, w || 700)), Math.min(4000, Math.max(200, h || 1000)))}
        className="mt-3 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
      >
        Resize design
      </button>
      <p className="mt-3 text-xs text-slate-500">All elements are scaled to fit the new size.</p>
    </div>
  );
}
