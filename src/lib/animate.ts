/**
 * "Animate this card" — Canva-style element entrance animations rendered to a
 * short clip (6–20 s) without leaving the editor.
 *
 * Each element of the page is rendered as its own transparent layer; the
 * background is rendered once. Frames composite background + layers with a
 * per-element entrance (fade / rise / pop / slide / typewriter-ish reveal),
 * staggered in layer order, optional ambient motion + overlay, then hold.
 */
import type { Overlay, Motion } from "./video-effects";

export type Entrance =
  | "fade"
  | "rise"
  | "drop"
  | "pop"
  | "slide-left"
  | "slide-right"
  | "wipe"
  | "blur"
  | "none";

export type AnimateSettings = {
  entrance: Entrance;
  /** seconds between each element's entrance */
  stagger: number;
  /** seconds a single entrance takes */
  speed: number;
  /** total clip length in seconds (entrances + hold) */
  duration: number;
  /** ambient camera motion for the whole card */
  motion: Motion;
  overlay: Overlay;
  /** repeat the entrance at the end (loop-friendly for WhatsApp status) */
  loop: boolean;
  width: 720 | 1080;
};

export const ENTRANCES: { id: Entrance; name: string; icon: string }[] = [
  { id: "fade", name: "Fade in", icon: "◐" },
  { id: "rise", name: "Rise", icon: "↑" },
  { id: "drop", name: "Drop", icon: "↓" },
  { id: "pop", name: "Pop", icon: "✦" },
  { id: "slide-left", name: "Slide in", icon: "→" },
  { id: "slide-right", name: "Slide in ←", icon: "←" },
  { id: "wipe", name: "Wipe", icon: "▥" },
  { id: "blur", name: "Blur in", icon: "≋" },
  { id: "none", name: "Instant", icon: "▮" },
];

export const ANIMATE_PRESETS: { id: string; name: string; emoji: string; s: Partial<AnimateSettings> }[] = [
  { id: "elegant", name: "Elegant", emoji: "✨", s: { entrance: "fade", stagger: 0.35, speed: 1.0, motion: "zoom-in", overlay: "sparkles", duration: 12 } },
  { id: "rise", name: "Rise up", emoji: "🪔", s: { entrance: "rise", stagger: 0.25, speed: 0.8, motion: "still", overlay: "none", duration: 10 } },
  { id: "pop", name: "Playful", emoji: "🎈", s: { entrance: "pop", stagger: 0.18, speed: 0.55, motion: "pulse", overlay: "confetti", duration: 10 } },
  { id: "romantic", name: "Romantic", emoji: "💕", s: { entrance: "blur", stagger: 0.4, speed: 1.2, motion: "float", overlay: "petals", duration: 14 } },
  { id: "cinematic", name: "Cinematic", emoji: "🎬", s: { entrance: "wipe", stagger: 0.3, speed: 0.9, motion: "pan-left", overlay: "light-leak", duration: 15 } },
  { id: "quick", name: "Quick", emoji: "⚡", s: { entrance: "slide-left", stagger: 0.12, speed: 0.4, motion: "still", overlay: "none", duration: 6 } },
];

export const DEFAULT_ANIMATE: AnimateSettings = {
  entrance: "rise",
  stagger: 0.3,
  speed: 0.8,
  duration: 12,
  motion: "zoom-in",
  overlay: "sparkles",
  loop: false,
  width: 720,
};

/* ─────────────── maths ─────────────── */
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export type LayerImg = { img: HTMLImageElement; x: number; y: number; w: number; h: number; rot?: number; op?: number };

/** Entrance transform for one layer at local progress p (0 → 1). */
function entranceState(kind: Entrance, p: number) {
  const e = easeOutExpo(p);
  switch (kind) {
    case "fade":
      return { alpha: e, dx: 0, dy: 0, scale: 1, clip: 1, blur: 0 };
    case "rise":
      return { alpha: e, dx: 0, dy: (1 - e) * 60, scale: 1, clip: 1, blur: 0 };
    case "drop":
      return { alpha: e, dx: 0, dy: -(1 - e) * 60, scale: 1, clip: 1, blur: 0 };
    case "pop":
      return { alpha: clamp01(p * 2), dx: 0, dy: 0, scale: 0.5 + 0.5 * easeOutBack(p), clip: 1, blur: 0 };
    case "slide-left":
      return { alpha: e, dx: (1 - e) * 120, dy: 0, scale: 1, clip: 1, blur: 0 };
    case "slide-right":
      return { alpha: e, dx: -(1 - e) * 120, dy: 0, scale: 1, clip: 1, blur: 0 };
    case "wipe":
      return { alpha: 1, dx: 0, dy: 0, scale: 1, clip: e, blur: 0 };
    case "blur":
      return { alpha: e, dx: 0, dy: 0, scale: 1 + (1 - e) * 0.06, clip: 1, blur: (1 - e) * 14 };
    default:
      return { alpha: 1, dx: 0, dy: 0, scale: 1, clip: 1, blur: 0 };
  }
}

function camera(m: Motion, t01: number) {
  const z = 0.06;
  const pn = 0.04;
  switch (m) {
    case "zoom-in": return { s: 1 + z * t01, dx: 0, dy: 0 };
    case "zoom-out": return { s: 1 + z * (1 - t01), dx: 0, dy: 0 };
    case "pan-left": return { s: 1 + z, dx: pn * (0.5 - t01), dy: 0 };
    case "pan-right": return { s: 1 + z, dx: -pn * (0.5 - t01), dy: 0 };
    case "pan-up": return { s: 1 + z, dx: 0, dy: pn * (0.5 - t01) };
    case "pan-down": return { s: 1 + z, dx: 0, dy: -pn * (0.5 - t01) };
    case "float": return { s: 1 + z * 0.5, dx: Math.sin(t01 * Math.PI * 2) * 0.01, dy: Math.cos(t01 * Math.PI * 2) * 0.01 };
    case "pulse": return { s: 1 + 0.025 * Math.abs(Math.sin(t01 * Math.PI * 3)), dx: 0, dy: 0 };
    default: return { s: 1, dx: 0, dy: 0 };
  }
}

/* ─────────────── overlays (shared look with video-render) ─────────────── */
type P = { x: number; y: number; s: number; v: number; r: number; hue: number; ph: number };
function particles(kind: Overlay, n: number, seed = 11): P[] {
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  return Array.from({ length: n }, () => ({ x: rnd(), y: rnd(), s: 0.4 + rnd() * 0.9, v: 0.25 + rnd() * 0.9, r: rnd() * 6.28, hue: kind === "confetti" ? rnd() * 360 : 335 + rnd() * 25, ph: rnd() * 6.28 }));
}
function drawOverlay(ctx: CanvasRenderingContext2D, kind: Overlay, ps: P[], W: number, H: number, t: number) {
  if (kind === "none") return;
  ctx.save();
  if (kind === "light-leak") {
    const x = W * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.35)));
    const g = ctx.createRadialGradient(x, H * 0.15, 0, x, H * 0.15, W * 0.9);
    g.addColorStop(0, "rgba(255,180,90,0.34)");
    g.addColorStop(0.5, "rgba(255,120,150,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    return;
  }
  for (const p of ps) {
    const yy = ((p.y + t * p.v * 0.12) % 1.1) - 0.05;
    const X = (p.x + Math.sin(t * 0.8 + p.ph) * 0.02) * W;
    const Y = kind === "sparkles" || kind === "bokeh" ? ((p.y + Math.sin(t * 0.5 + p.ph) * 0.02) % 1) * H : yy * H;
    if (kind === "sparkles") {
      const a = 0.35 + 0.65 * Math.abs(Math.sin(t * 2.2 + p.ph));
      const r = 2.5 * p.s * (0.6 + a);
      ctx.globalAlpha = a; ctx.fillStyle = "#ffe9a8"; ctx.beginPath();
      ctx.moveTo(X, Y - r * 2); ctx.lineTo(X + r * 0.6, Y - r * 0.6); ctx.lineTo(X + r * 2, Y); ctx.lineTo(X + r * 0.6, Y + r * 0.6);
      ctx.lineTo(X, Y + r * 2); ctx.lineTo(X - r * 0.6, Y + r * 0.6); ctx.lineTo(X - r * 2, Y); ctx.lineTo(X - r * 0.6, Y - r * 0.6); ctx.closePath(); ctx.fill();
    } else if (kind === "petals") {
      ctx.globalAlpha = 0.85; ctx.fillStyle = `hsl(${p.hue} 80% 78%)`; ctx.save(); ctx.translate(X, Y); ctx.rotate(p.r + t * 1.5 * p.v);
      ctx.beginPath(); ctx.ellipse(0, 0, 7 * p.s, 4 * p.s, 0, 0, 6.28); ctx.fill(); ctx.restore();
    } else if (kind === "confetti") {
      ctx.globalAlpha = 0.9; ctx.fillStyle = `hsl(${p.hue} 85% 60%)`; ctx.save(); ctx.translate(X, Y); ctx.rotate(p.r + t * 4 * p.v);
      ctx.fillRect(-4 * p.s, -2.5 * p.s, 8 * p.s, 5 * p.s); ctx.restore();
    } else if (kind === "bokeh") {
      const a = 0.12 + 0.25 * Math.abs(Math.sin(t * 0.9 + p.ph)); const r = 14 * p.s + 6;
      const g = ctx.createRadialGradient(X, Y, 0, X, Y, r); g.addColorStop(0, `rgba(255,230,160,${a})`); g.addColorStop(1, "rgba(255,230,160,0)");
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y, r, 0, 6.28); ctx.fill();
    }
  }
  ctx.restore();
}

/* ─────────────── frame renderer ─────────────── */
export type AnimScene = {
  bg: HTMLImageElement; // full-size background render (no elements)
  layers: LayerImg[]; // element layers in z-order, positioned in canvas px
  W: number;
  H: number;
  settings: AnimateSettings;
  ps: P[];
};

export function buildScene(bg: HTMLImageElement, layers: LayerImg[], W: number, H: number, settings: AnimateSettings): AnimScene {
  return { bg, layers, W, H, settings, ps: particles(settings.overlay, settings.overlay === "bokeh" ? 18 : settings.overlay === "sparkles" ? 40 : 60) };
}

/** Time at which the last element has fully entered. */
export function entranceEnd(s: AnimateSettings, n: number) {
  return 0.3 + Math.max(0, n - 1) * s.stagger + s.speed;
}

export function drawAnimFrame(ctx: CanvasRenderingContext2D, sc: AnimScene, t: number) {
  const { W, H, settings: s } = sc;
  const total = s.duration;
  // loop: play entrance again in the last part if requested
  const cycle = s.loop ? Math.max(entranceEnd(s, sc.layers.length) + 1.5, total / 2) : total;
  const tt = s.loop ? t % cycle : t;
  const t01 = clamp01(t / total);

  ctx.clearRect(0, 0, W, H);
  const cam = camera(s.motion, t01);
  ctx.save();
  ctx.translate(W / 2 + cam.dx * W, H / 2 + cam.dy * H);
  ctx.scale(cam.s, cam.s);
  ctx.translate(-W / 2, -H / 2);

  ctx.drawImage(sc.bg, 0, 0, W, H);

  sc.layers.forEach((L, i) => {
    const start = 0.3 + i * s.stagger;
    const p = clamp01((tt - start) / Math.max(0.05, s.speed));
    if (p <= 0) return;
    const st = entranceState(s.entrance, p);
    ctx.save();
    ctx.globalAlpha = st.alpha * (L.op ?? 1);
    if (st.blur > 0) ctx.filter = `blur(${st.blur}px)`;
    if (st.clip < 1) {
      ctx.beginPath();
      ctx.rect(L.x, L.y, L.w * st.clip, L.h);
      ctx.clip();
    }
    const cx = L.x + L.w / 2;
    const cy = L.y + L.h / 2;
    ctx.translate(cx + st.dx, cy + st.dy);
    if (L.rot) ctx.rotate((L.rot * Math.PI) / 180);
    ctx.scale(st.scale, st.scale);
    ctx.drawImage(L.img, -L.w / 2, -L.h / 2, L.w, L.h);
    ctx.restore();
  });
  ctx.restore();

  drawOverlay(ctx, s.overlay, sc.ps, W, H, t);

  // fade in/out
  const fi = clamp01(t / 0.5);
  const fo = clamp01((total - t) / 0.7);
  const a = 1 - Math.min(fi, fo);
  if (a > 0) {
    ctx.globalAlpha = a;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}
