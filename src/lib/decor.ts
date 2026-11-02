import { makeImage, makeShape, makeText, uid, type Doc, type El, type ImageEl, type ShapeEl, type ShapeKind, type TextEl } from "./design";

export type B = { w: number; h: number };

export const T = (text: string, x: number, y: number, w: number, o: Partial<TextEl> = {}) =>
  makeText(text, { x, y, w, ...o });

/** full-width centred text */
export const C = (w: number, text: string, y: number, o: Partial<TextEl> = {}, pad = 60) =>
  T(text, pad, y, w - pad * 2, { align: "center", ...o });

export const S = (shape: ShapeKind, x: number, y: number, w: number, h: number, o: Partial<ShapeEl> = {}) =>
  makeShape(shape, { x, y, w, h, ...o });

/** empty photo frame */
export const PH = (x: number, y: number, w: number, h: number, o: Partial<ImageEl> = {}) =>
  makeImage("", { x, y, w, h, ...o });

export const D = (width: number, height: number, background: string, elements: El[]): Doc => ({
  width,
  height,
  background,
  elements,
});

/* ────────────────────────── decorative builders ────────────────────────── */

/** soft radial glow blob */
export function glow(x: number, y: number, size: number, color: string, opacity = 0.55): El[] {
  return [
    S("circle", x, y, size, size, {
      fill: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 72%)`,
      opacity,
    }),
  ];
}

/** layered corner ornament (arcs + dots), used on premium cards */
export function corner(style: "arc" | "leaf" | "dots" | "petal", x: number, y: number, size: number, color: string, rotate = 0): El[] {
  const g = (cx: number, cy: number, r: number, sw: number, op = 1) =>
    S("ring", x + cx - r, y + cy - r, r * 2, r * 2, { fill: color, strokeWidth: sw, rotation: rotate, opacity: op });
  switch (style) {
    case "arc":
      return [g(size * 0.5, size * 0.5, size * 0.5, 2), g(size * 0.5, size * 0.5, size * 0.34, 1.4), S("circle", x + size * 0.44, y + size * 0.44, size * 0.12, size * 0.12, { fill: color })];
    case "leaf":
      return [
        S("leaf", x, y + size * 0.3, size * 0.75, size * 0.4, { fill: color, rotation: -35 + rotate }),
        S("leaf", x + size * 0.28, y, size * 0.75, size * 0.4, { fill: color, rotation: 55 + rotate }),
        S("circle", x + size * 0.4, y + size * 0.4, size * 0.1, size * 0.1, { fill: color }),
      ];
    case "petal":
      return [
        S("flower", x - size * 0.1, y - size * 0.1, size * 0.8, size * 0.8, { fill: color, stroke: "rgba(255,255,255,0.85)", rotation: rotate }),
      ];
    default:
      return [
        S("circle", x, y, size * 0.16, size * 0.16, { fill: color }),
        S("circle", x + size * 0.28, y + size * 0.1, size * 0.11, size * 0.11, { fill: color, opacity: 0.85 }),
        S("circle", x + size * 0.5, y + size * 0.24, size * 0.08, size * 0.08, { fill: color, opacity: 0.7 }),
        S("circle", x + size * 0.1, y + size * 0.28, size * 0.11, size * 0.11, { fill: color, opacity: 0.85 }),
        S("circle", x + size * 0.32, y + size * 0.44, size * 0.08, size * 0.08, { fill: color, opacity: 0.7 }),
      ];
  }
}

/** scatter small decorations inside given bands */
export function scatter(
  W: number,
  bands: [number, number][],
  count: number,
  colors: string[],
  seed: number,
  kinds: ShapeKind[] = ["circle", "star", "diamond", "flower", "leaf"],
  maxSize = 26,
): El[] {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const out: El[] = [];
  for (let k = 0; k < count; k++) {
    const [y0, y1] = bands[Math.floor(rnd() * bands.length)];
    const size = 8 + rnd() * maxSize;
    out.push(
      S(kinds[Math.floor(rnd() * kinds.length)], rnd() * (W - 40), y0 + rnd() * (y1 - y0), size, size, {
        fill: colors[Math.floor(rnd() * colors.length)],
        rotation: Math.round(rnd() * 360),
        opacity: 0.55 + rnd() * 0.4,
      }),
    );
  }
  return out;
}

/** double/triple premium border */
export function border(
  W: number,
  H: number,
  color: string,
  o: { inset?: number; gap?: number; radius?: number; weight?: number; layers?: number } = {},
): El[] {
  const inset = o.inset ?? 26;
  const gap = o.gap ?? 14;
  const layers = o.layers ?? 2;
  const weight = o.weight ?? 2;
  const out: El[] = [];
  for (let k = 0; k < layers; k++) {
    const p = inset + k * gap;
    out.push(
      S("rect", p, p, W - p * 2, H - p * 2, {
        fill: "transparent",
        stroke: color,
        strokeWidth: k === 0 ? weight : Math.max(0.8, weight - 0.8),
        radius: (o.radius ?? 0) + k * gap * 0.35,
      }),
    );
  }
  return out;
}

/** ornamental divider; when given a string it renders a text ornament */
export function divider(
  W: number,
  y: number,
  color: string,
  style: "diamond" | "floral" | "dots" | "wave" | "heart" = "diamond",
  width = 220,
): El[] {
  const cx = W / 2;
  const half = width / 2;
  switch (style) {
    case "floral":
      return [
        S("line", cx - half, y, half - 22, 2, { stroke: color, strokeWidth: 1.6 }),
        S("line", cx + 22, y, half - 22, 2, { stroke: color, strokeWidth: 1.6 }),
        S("flower", cx - 21, y - 21, 42, 42, { fill: color, stroke: "#ffffff" }),
      ];
    case "dots":
      return [
        S("circle", cx - 54, y - 5, 10, 10, { fill: color }),
        S("circle", cx - 30, y - 4, 8, 8, { fill: color, opacity: 0.8 }),
        S("circle", cx + 22, y - 4, 8, 8, { fill: color, opacity: 0.8 }),
        S("circle", cx + 44, y - 5, 10, 10, { fill: color }),
        S("diamond", cx - 10, y - 10, 20, 20, { fill: color }),
      ];
    case "wave":
      return [S("wave", cx - half, y - 16, width, 32, { fill: color, strokeWidth: 3 })];
    case "heart":
      return [
        S("line", cx - half, y, half - 26, 2, { stroke: color, strokeWidth: 1.6 }),
        S("line", cx + 26, y, half - 26, 2, { stroke: color, strokeWidth: 1.6 }),
        S("heart", cx - 13, y - 14, 26, 24, { fill: color }),
      ];
    default:
      return [
        S("line", cx - half, y, half - 20, 2, { stroke: color, strokeWidth: 1.5 }),
        S("line", cx + 20, y, half - 20, 2, { stroke: color, strokeWidth: 1.5 }),
        S("diamond", cx - 11, y - 11, 22, 22, { fill: color }),
      ];
  }
}

/** rounded pill label */
export function pill(W: number, y: number, text: string, bg: string, fg: string, o: Partial<TextEl> = {}, h = 56, wp = 0.62): El[] {
  const pw = W * wp;
  return [
    S("rect", (W - pw) / 2, y, pw, h, { fill: bg, radius: h / 2 }),
    C(W, text, y + h * 0.22, { fontSize: h * 0.36, color: fg, fontWeight: 600, letterSpacing: 2, ...o }),
  ];
}

/** ribbon banner across the card */
export function ribbon(W: number, y: number, text: string, bg: string, fg: string, o: Partial<TextEl> = {}, h = 74): El[] {
  return [
    S("rect", W * 0.08, y, W * 0.84, h, { fill: bg, radius: 8 }),
    S("rect", W * 0.08 - 14, y + h * 0.14, 26, h * 0.72, { fill: bg, opacity: 0.75, radius: 4 }),
    S("rect", W * 0.92 - 12, y + h * 0.14, 26, h * 0.72, { fill: bg, opacity: 0.75, radius: 4 }),
    C(W, text, y + h * 0.26, { fontSize: h * 0.36, color: fg, fontWeight: 700, letterSpacing: 3, ...o }),
  ];
}

/** arch photo frame with a decorative outline */
export function archPhoto(W: number, y: number, pw: number, ph: number, accent: string, label = "Add photo", o: Partial<ImageEl> = {}): El[] {
  const x = (W - pw) / 2;
  return [
    PH(x, y, pw, ph, { frame: "arch", label, ...o }),
    S("ring", x - 10, y - 10, pw + 20, ph + 20, { fill: accent, strokeWidth: 2 }),
  ];
}

/** floating badge / seal */
export function seal(cx: number, cy: number, size: number, bg: string, icon: string, fontSize = 0.5): El[] {
  return [
    S("circle", cx - size / 2, cy - size / 2, size, size, { fill: bg }),
    S("ring", cx - size / 2 - 6, cy - size / 2 - 6, size + 12, size + 12, { fill: bg, strokeWidth: 1.5, opacity: 0.6 }),
    T(icon, cx - size / 2, cy - size * fontSize * 0.85, size, { fontSize: size * fontSize, align: "center", lineHeight: 1.2 }),
  ];
}

/** bunting / hanging flags */
export function bunting(W: number, y: number, colors: string[]): El[] {
  const n = 8;
  const fw = W / n;
  const out: El[] = [S("line", 0, y, W, 2, { stroke: colors[0], strokeWidth: 2 })];
  for (let k = 0; k < n; k++) {
    out.push(
      S("triangle", k * fw + 2, y + 2, fw - 4, fw * 0.85, { fill: colors[k % colors.length], rotation: 180 }),
    );
  }
  return out;
}

/** subtle polka-dot texture overlay */
export function dots(W: number, H: number, color: string, opacity = 0.5, step = 26): El[] {
  return [
    S("rect", 0, 0, W, H, {
      fill: `radial-gradient(${color} 1.6px, rgba(255,255,255,0) 1.7px) 0 0 / ${step}px ${step}px`,
      opacity,
    }),
  ];
}

/** unique-ish id helper for generators */
export const nid = () => uid();

/** text-based ornament row (emoji / glyphs) */
export function ornament(W: number, y: number, text: string, size = 30, o: Partial<TextEl> = {}): El[] {
  return [C(W, text, y, { fontSize: size, align: "center", lineHeight: 1.2, ...o })];
}

/** symmetric side leaves around the centre line */
export function sideFlorals(W: number, y: number, color: string, spread = 130): El[] {
  return [
    S("leaf", W * 0.5 - spread - 70, y, 140, 52, { fill: color, rotation: -18 }),
    S("leaf", W * 0.5 + spread - 70, y, 140, 52, { fill: color, rotation: 18 }),
    S("circle", W * 0.5 - spread - 4, y + 12, 16, 16, { fill: color }),
    S("circle", W * 0.5 + spread - 12, y + 12, 16, 16, { fill: color }),
  ];
}
