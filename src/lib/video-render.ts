import { effectForPage, type Motion, type Overlay, type PageEffect, type Transition, type VideoSettings } from "./video-effects";

/* ───────────────────────── easing ───────────────────────── */
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/* ───────────────────────── motion (how a page moves while on screen) ───────────────────────── */
type Cam = { scale: number; dx: number; dy: number };

function motionCam(m: Motion, t01: number): Cam {
  const z = 0.08; // max zoom amount
  const p = 0.05; // max pan as fraction of width
  switch (m) {
    case "zoom-in":
      return { scale: 1 + z * t01, dx: 0, dy: 0 };
    case "zoom-out":
      return { scale: 1 + z * (1 - t01), dx: 0, dy: 0 };
    case "pan-left":
      return { scale: 1 + z, dx: p * (0.5 - t01), dy: 0 };
    case "pan-right":
      return { scale: 1 + z, dx: -p * (0.5 - t01), dy: 0 };
    case "pan-up":
      return { scale: 1 + z, dx: 0, dy: p * (0.5 - t01) };
    case "pan-down":
      return { scale: 1 + z, dx: 0, dy: -p * (0.5 - t01) };
    case "float":
      return { scale: 1 + z * 0.5, dx: Math.sin(t01 * Math.PI * 2) * 0.012, dy: Math.cos(t01 * Math.PI * 2) * 0.012 };
    case "pulse": {
      const beat = Math.abs(Math.sin(t01 * Math.PI * 3));
      return { scale: 1 + 0.03 * beat, dx: 0, dy: 0 };
    }
    default:
      return { scale: 1, dx: 0, dy: 0 };
  }
}

function drawPage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number, cam: Cam, alpha = 1) {
  const dw = W * cam.scale;
  const dh = H * cam.scale;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, (W - dw) / 2 + cam.dx * W, (H - dh) / 2 + cam.dy * H, dw, dh);
  ctx.globalAlpha = 1;
}

/* ───────────────────────── transitions (how the NEXT page enters over the current) ───────────────────────── */
function drawTransition(
  ctx: CanvasRenderingContext2D,
  kind: Transition,
  from: HTMLImageElement,
  to: HTMLImageElement,
  W: number,
  H: number,
  p: number, // 0 → 1
  camFrom: Cam,
  camTo: Cam,
) {
  const e = easeInOut(p);
  switch (kind) {
    case "none":
      drawPage(ctx, p < 0.5 ? from : to, W, H, p < 0.5 ? camFrom : camTo);
      return;
    case "fade":
      drawPage(ctx, from, W, H, camFrom);
      drawPage(ctx, to, W, H, camTo, e);
      return;
    case "slide-left":
    case "slide-right":
    case "slide-up":
    case "slide-down": {
      drawPage(ctx, from, W, H, camFrom);
      const sx = kind === "slide-left" ? (1 - e) * W : kind === "slide-right" ? -(1 - e) * W : 0;
      const sy = kind === "slide-up" ? (1 - e) * H : kind === "slide-down" ? -(1 - e) * H : 0;
      ctx.save();
      ctx.translate(sx, sy);
      drawPage(ctx, to, W, H, camTo);
      ctx.restore();
      // soft shadow edge
      ctx.save();
      ctx.globalAlpha = 0.35 * (1 - e);
      ctx.fillStyle = "#000";
      if (kind === "slide-left") ctx.fillRect(sx - 40, 0, 40, H);
      if (kind === "slide-right") ctx.fillRect(sx + W, 0, 40, H);
      if (kind === "slide-up") ctx.fillRect(0, sy - 40, W, 40);
      if (kind === "slide-down") ctx.fillRect(0, sy + H, W, 40);
      ctx.restore();
      return;
    }
    case "zoom-in": {
      drawPage(ctx, from, W, H, camFrom);
      const s = 0.6 + 0.4 * easeOut(p);
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.scale(s, s);
      ctx.translate(-W / 2, -H / 2);
      drawPage(ctx, to, W, H, camTo, easeOut(p));
      ctx.restore();
      return;
    }
    case "zoom-out": {
      drawPage(ctx, to, W, H, camTo);
      const s = 1 + 0.5 * e;
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.scale(s, s);
      ctx.translate(-W / 2, -H / 2);
      drawPage(ctx, from, W, H, camFrom, 1 - e);
      ctx.restore();
      return;
    }
    case "flip": {
      // horizontal 3D-ish flip: squash width through 0
      const half = p < 0.5;
      const img = half ? from : to;
      const cam = half ? camFrom : camTo;
      const sx = Math.abs(Math.cos(p * Math.PI));
      ctx.save();
      ctx.translate(W / 2, 0);
      ctx.scale(Math.max(0.02, sx), 1);
      ctx.translate(-W / 2, 0);
      drawPage(ctx, img, W, H, cam);
      // shading on the edge-on moment
      ctx.globalAlpha = (1 - sx) * 0.5;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      return;
    }
    case "wipe": {
      drawPage(ctx, from, W, H, camFrom);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W * e, H);
      ctx.clip();
      drawPage(ctx, to, W, H, camTo);
      ctx.restore();
      // soft wipe edge
      const g = ctx.createLinearGradient(W * e - 30, 0, W * e + 30, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, "rgba(255,255,255,0.45)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(W * e - 30, 0, 60, H);
      return;
    }
    case "circle": {
      drawPage(ctx, from, W, H, camFrom);
      const r = Math.hypot(W, H) * 0.5 * easeOut(p);
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
      ctx.clip();
      drawPage(ctx, to, W, H, camTo);
      ctx.restore();
      return;
    }
    case "blur": {
      const b = Math.sin(p * Math.PI) * 14;
      ctx.save();
      ctx.filter = `blur(${b}px)`;
      drawPage(ctx, from, W, H, camFrom, 1 - e);
      drawPage(ctx, to, W, H, camTo, e);
      ctx.restore();
      ctx.filter = "none";
      return;
    }
  }
}

/* ───────────────────────── overlays (particles drawn on top) ───────────────────────── */
type Particle = { x: number; y: number; s: number; v: number; r: number; hue: number; phase: number };

function makeParticles(kind: Overlay, n: number, seed: number): Particle[] {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: n }, () => ({
    x: rnd(),
    y: rnd(),
    s: 0.4 + rnd() * 0.9,
    v: 0.25 + rnd() * 0.9,
    r: rnd() * Math.PI * 2,
    hue: kind === "confetti" ? rnd() * 360 : kind === "petals" ? 330 + rnd() * 30 : 45,
    phase: rnd() * Math.PI * 2,
  }));
}

function drawOverlay(ctx: CanvasRenderingContext2D, kind: Overlay, parts: Particle[], W: number, H: number, t: number) {
  if (kind === "none") return;
  ctx.save();
  if (kind === "light-leak") {
    const x = W * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.35)));
    const g = ctx.createRadialGradient(x, H * 0.15, 0, x, H * 0.15, W * 0.9);
    g.addColorStop(0, "rgba(255,180,90,0.38)");
    g.addColorStop(0.5, "rgba(255,120,150,0.14)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    return;
  }
  for (const p of parts) {
    const yy = ((p.y + t * p.v * 0.12) % 1.1) - 0.05;
    const xx = p.x + Math.sin(t * 0.8 + p.phase) * 0.02;
    const X = xx * W;
    const Y = kind === "sparkles" || kind === "bokeh" ? ((p.y + Math.sin(t * 0.5 + p.phase) * 0.02) % 1) * H : yy * H;
    switch (kind) {
      case "sparkles": {
        const a = 0.35 + 0.65 * Math.abs(Math.sin(t * 2.2 + p.phase));
        const r = 2.5 * p.s * (0.6 + a);
        ctx.globalAlpha = a;
        ctx.fillStyle = "#ffe9a8";
        ctx.beginPath();
        ctx.moveTo(X, Y - r * 2);
        ctx.lineTo(X + r * 0.6, Y - r * 0.6);
        ctx.lineTo(X + r * 2, Y);
        ctx.lineTo(X + r * 0.6, Y + r * 0.6);
        ctx.lineTo(X, Y + r * 2);
        ctx.lineTo(X - r * 0.6, Y + r * 0.6);
        ctx.lineTo(X - r * 2, Y);
        ctx.lineTo(X - r * 0.6, Y - r * 0.6);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "petals": {
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = `hsl(${p.hue} 80% 78%)`;
        ctx.save();
        ctx.translate(X, Y);
        ctx.rotate(p.r + t * 1.5 * p.v);
        ctx.beginPath();
        ctx.ellipse(0, 0, 7 * p.s, 4 * p.s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "confetti": {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = `hsl(${p.hue} 85% 60%)`;
        ctx.save();
        ctx.translate(X, Y);
        ctx.rotate(p.r + t * 4 * p.v);
        ctx.fillRect(-4 * p.s, -2.5 * p.s, 8 * p.s, 5 * p.s);
        ctx.restore();
        break;
      }
      case "bokeh": {
        const a = 0.12 + 0.25 * Math.abs(Math.sin(t * 0.9 + p.phase));
        const r = 14 * p.s + 6;
        const g = ctx.createRadialGradient(X, Y, 0, X, Y, r);
        g.addColorStop(0, `rgba(255,230,160,${a})`);
        g.addColorStop(1, "rgba(255,230,160,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(X, Y, r, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  }
  ctx.restore();
}

/* ───────────────────────── timeline ───────────────────────── */
export type Timeline = {
  pages: { id: string; start: number; end: number; effect: PageEffect }[];
  total: number;
};

export function buildTimeline(settings: VideoSettings, pageIds: string[]): Timeline {
  let t = 0;
  const pages = pageIds.map((id) => {
    const effect = effectForPage(settings, id);
    const seg = { id, start: t, end: t + effect.duration, effect };
    t += effect.duration;
    return seg;
  });
  return { pages, total: t };
}

/**
 * Draw the frame at absolute time `t` (seconds). Pure function of time → can be
 * used for the live preview (requestAnimationFrame) and the recorder alike.
 */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  tl: Timeline,
  settings: VideoSettings,
  particles: Map<string, Particle[]>,
  t: number,
) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  let idx = tl.pages.findIndex((p) => t < p.end);
  if (idx < 0) idx = tl.pages.length - 1;
  const cur = tl.pages[idx];
  const local = t - cur.start;
  const t01 = clamp01(local / cur.effect.duration);
  const camCur = motionCam(cur.effect.motion, t01);

  // transition INTO this page occupies the first `transitionDuration` seconds
  const next = tl.pages[idx + 1];
  const prev = tl.pages[idx - 1];
  const td = cur.effect.transitionDuration;

  if (prev && local < td && cur.effect.transition !== "none") {
    const p = clamp01(local / td);
    const camPrev = motionCam(prev.effect.motion, 1);
    drawTransition(ctx, cur.effect.transition, images[idx - 1], images[idx], W, H, p, camPrev, camCur);
  } else {
    drawPage(ctx, images[idx], W, H, camCur);
  }
  void next;

  // overlay particles of the current page
  const ov = cur.effect.overlay;
  if (ov !== "none") {
    let parts = particles.get(ov);
    if (!parts) {
      parts = makeParticles(ov, ov === "bokeh" ? 18 : ov === "sparkles" ? 40 : 60, 7);
      particles.set(ov, parts);
    }
    drawOverlay(ctx, ov, parts, W, H, t);
  }

  // global fade in / out
  if (settings.fadeInOut) {
    const fi = clamp01(t / 0.6);
    const fo = clamp01((tl.total - t) / 0.8);
    const a = 1 - Math.min(fi, fo);
    if (a > 0) {
      ctx.globalAlpha = a;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
  }
}

export const newParticleCache = () => new Map<string, Particle[]>();
