import { toJpeg, toPng } from "html-to-image";
import { buildTimeline, drawFrame, newParticleCache } from "@/lib/video-render";
import { DEFAULT_VIDEO, type VideoSettings } from "@/lib/video-effects";
import { FONTS } from "@/lib/fonts";

const cache = new Map<string, string>();

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = () => rej(fr.error);
    fr.readAsDataURL(blob);
  });
}

/**
 * Build @font-face CSS for the fonts actually used, with the font files
 * inlined as data URLs so the offscreen renderer never hits CORS.
 * Every script subset is kept (latin, devanagari, gurmukhi, gujarati, bengali,
 * tamil, telugu, malayalam, kannada, oriya, arabic …) so all 13 languages export
 * correctly.
 */
export async function buildFontCss(families: string[]): Promise<string> {
  const defs = FONTS.filter((f) => families.includes(f.name));
  if (!defs.length) return "";
  const href =
    "https://fonts.googleapis.com/css2?" +
    defs
      .map((f) => {
        const fam = f.name.replace(/ /g, "+");
        return f.weights.length > 1 ? `family=${fam}:wght@${f.weights.join(";")}` : `family=${fam}`;
      })
      .join("&") +
    "&display=swap";
  const hit = cache.get(href);
  if (hit !== undefined) return hit;

  let css = "";
  try {
    css = await (
      await fetch(href, {
        // ask for woff2 so files are small
        headers: { "User-Agent": navigator.userAgent },
      })
    ).text();
  } catch {
    return "";
  }

  const blocks = Array.from(css.matchAll(/@font-face\s*\{[^}]*\}/g)).map((m) => m[0]);
  const out = await Promise.all(
    blocks.map(async (b) => {
      let res = b;
      const urls = Array.from(b.matchAll(/url\((https:[^)]+)\)/g));
      for (const u of urls) {
        try {
          const blob = await (await fetch(u[1])).blob();
          res = res.replace(u[1], await blobToDataUrl(blob));
        } catch {
          /* leave remote url – worst case that one glyph range falls back */
        }
      }
      return res;
    }),
  );
  const result = out.join("\n");
  cache.set(href, result);
  return result;
}

const baseOpts = (fontEmbedCSS: string, pixelRatio: number) => ({
  pixelRatio,
  fontEmbedCSS,
  cacheBust: false,
  skipFonts: false,
  // images proxied through /api/img are same-origin; local /art too
  imagePlaceholder: undefined,
});

/** Wait for every <img> inside the node to be decoded. */
async function waitForImages(node: HTMLElement) {
  const imgs = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? img.decode().catch(() => undefined)
        : new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
          }),
    ),
  );
}

export async function renderToImage(
  node: HTMLElement,
  fmt: "png" | "jpg",
  families: string[],
  pixelRatio: number,
): Promise<string> {
  let fontEmbedCSS = "";
  try {
    fontEmbedCSS = await buildFontCss(families);
  } catch {
    fontEmbedCSS = "";
  }
  await document.fonts?.ready;
  await waitForImages(node);
  const opts = baseOpts(fontEmbedCSS, pixelRatio);
  // warm-up pass makes the real pass deterministic (fonts/images settled)
  await toPng(node, { ...opts, pixelRatio: 0.2 }).catch(() => undefined);
  return fmt === "png" ? toPng(node, opts) : toJpeg(node, { ...opts, quality: 0.94 });
}

/** Render to a canvas-friendly <img> element. */
export async function renderToImageElement(node: HTMLElement, families: string[], pixelRatio: number): Promise<HTMLImageElement> {
  const url = await renderToImage(node, "png", families, pixelRatio);
  const img = new Image();
  img.src = url;
  await img.decode();
  return img;
}

/* ───────────────────────── VIDEO (no server, no paid API) ───────────────────────── */


export type VideoOpts = {
  settings?: VideoSettings;
  /** page ids in order (must match images order) */
  pageIds?: string[];
  onProgress?: (pct: number) => void;
};

function pickMime(): { mime: string; ext: "mp4" | "webm" } {
  const candidates: { mime: string; ext: "mp4" | "webm" }[] = [
    { mime: "video/mp4;codecs=avc1.42E01E", ext: "mp4" },
    { mime: "video/mp4", ext: "mp4" },
    { mime: "video/webm;codecs=vp9", ext: "webm" },
    { mime: "video/webm;codecs=vp8", ext: "webm" },
    { mime: "video/webm", ext: "webm" },
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c.mime)) return c;
  }
  return { mime: "video/webm", ext: "webm" };
}

/**
 * Render page images into a video using the user's effect settings
 * (per-page transition, motion, duration, overlay). Recorded from a <canvas>
 * with MediaRecorder → MP4 (Chrome/Edge/Safari 17+) or WebM.
 */
export async function imagesToVideo(images: HTMLImageElement[], opts: VideoOpts = {}): Promise<{ blob: Blob; ext: "mp4" | "webm" }> {
  const settings = opts.settings ?? DEFAULT_VIDEO;
  const pageIds = opts.pageIds ?? images.map((_, i) => `p${i}`);
  const tl = buildTimeline(settings, pageIds);
  const fps = 30;

  const first = images[0];
  const W = settings.width ?? 720;
  const H = Math.round((W * first.naturalHeight) / first.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const stream = canvas.captureStream(fps);
  const { mime, ext } = pickMime();
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: W >= 1080 ? 9_000_000 : 6_000_000 });
  const chunks: BlobPart[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise<Blob>((res) => (rec.onstop = () => res(new Blob(chunks, { type: mime }))));

  const particles = newParticleCache();
  const totalFrames = Math.round(tl.total * fps);

  rec.start(250);
  const t0 = performance.now();
  for (let f = 0; f < totalFrames; f++) {
    drawFrame(ctx, images, tl, settings, particles, f / fps);
    opts.onProgress?.(Math.round((f / totalFrames) * 100));
    const target = t0 + (f + 1) * (1000 / fps);
    const wait = target - performance.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  }
  await new Promise((r) => setTimeout(r, 300));
  rec.stop();
  const blob = await done;
  opts.onProgress?.(100);
  return { blob, ext };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Share via the native share sheet (WhatsApp/FB/Instagram on mobile) if available. */
export async function shareFiles(files: File[], text: string): Promise<boolean> {
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files })) {
    try {
      await nav.share({ files, text });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
