"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ElementBody, makeU } from "@/components/DesignView";
import { MOTIONS, OVERLAYS } from "@/lib/video-effects";
import {
  ANIMATE_PRESETS,
  DEFAULT_ANIMATE,
  ENTRANCES,
  buildScene,
  drawAnimFrame,
  entranceEnd,
  type AnimScene,
  type AnimateSettings,
  type LayerImg,
} from "@/lib/animate";
import type { Doc, El, Page } from "@/lib/design";
import { FONTS } from "@/lib/fonts";
import { buildFontCss, downloadBlob, shareFiles } from "./export";

type Props = {
  doc: Doc;
  page: Page;
  fileName: string;
  initial?: AnimateSettings;
  onChange?: (s: AnimateSettings) => void;
  onClose: () => void;
};

const chip = (on: boolean) =>
  `flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium ring-1 transition ${
    on ? "bg-maroon-700 text-white ring-maroon-700" : "bg-white text-slate-700 ring-slate-200 hover:bg-gold-50 hover:ring-gold-400"
  }`;

function pickMime() {
  const c = [
    { mime: "video/mp4;codecs=avc1.42E01E", ext: "mp4" as const },
    { mime: "video/mp4", ext: "mp4" as const },
    { mime: "video/webm;codecs=vp9", ext: "webm" as const },
    { mime: "video/webm", ext: "webm" as const },
  ];
  return c.find((x) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(x.mime)) ?? c[3];
}

async function loadImg(url: string) {
  const img = new Image();
  img.src = url;
  await img.decode();
  return img;
}

/**
 * Render the page as separate transparent layers (one per element) plus the
 * background, so each element can animate independently.
 */
async function renderLayers(doc: Doc, page: Page, root: HTMLElement, scale: number, onProgress?: (p: number) => void) {
  const families = FONTS.map((f) => f.name);
  const fontEmbedCSS = await buildFontCss(families).catch(() => "");
  await document.fonts?.ready;
  const opts = { pixelRatio: scale, fontEmbedCSS, cacheBust: false, backgroundColor: undefined as string | undefined };

  const bgNode = root.querySelector<HTMLElement>("[data-anim-bg]")!;
  await toPng(bgNode, { ...opts, pixelRatio: 0.2 }).catch(() => undefined); // warm-up
  const bg = await loadImg(await toPng(bgNode, opts));

  const layerNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-anim-layer]"));
  const rootR = root.getBoundingClientRect();
  if (layerNodes[0]) await toPng(layerNodes[0], { ...opts, pixelRatio: 0.2, backgroundColor: "transparent", fontEmbedCSS }).catch(() => undefined);
  /** true when the PNG has at least a few visible pixels */
  const hasInk = (img: HTMLImageElement) => {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.min(64, img.naturalWidth));
    c.height = Math.max(1, Math.min(64, img.naturalHeight));
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    for (let k = 3; k < d.length; k += 4) if (d[k] > 30) return true;
    return false;
  };

  // html-to-image occasionally returns a blank PNG right after another render
  // (SVG <img> decode race). Render each layer with a warm-up pass and retry
  // until it actually contains pixels.
  const layers: LayerImg[] = [];
  for (let i = 0; i < layerNodes.length; i++) {
    const n = layerNodes[i];
    const r = n.getBoundingClientRect();
    const o = { ...opts, backgroundColor: "transparent", fontEmbedCSS };
    // Render the INNER element body, not the positioned wrapper: html-to-image
    // bakes the wrapper's `opacity`/`transform` into the clone and returns a
    // blank PNG. Rotation + opacity are applied on the canvas instead.
    const inner = (n.firstElementChild as HTMLElement) ?? n;
    const o2 = { ...o, width: Math.max(1, Math.round(r.width)), height: Math.max(1, Math.round(r.height)) };
    let img: HTMLImageElement | null = null;
    for (let attempt = 0; attempt < 3 && !img; attempt++) {
      await toPng(inner, { ...o2, pixelRatio: 0.2 }).catch(() => undefined);
      const candidate = await loadImg(await toPng(inner, o2));
      if (hasInk(candidate) || attempt === 2) img = candidate;
      else await new Promise((res) => setTimeout(res, 60));
    }
    const rot = parseFloat(n.dataset.rot || "0") || 0;
    const op = parseFloat(n.dataset.op || "1");
    layers.push({ img: img!, x: (r.left - rootR.left) * scale, y: (r.top - rootR.top) * scale, w: r.width * scale, h: r.height * scale, rot, op: Number.isFinite(op) ? op : 1 });
    onProgress?.(Math.round(((i + 1) / layerNodes.length) * 100));
  }
  return { bg, layers };
}

/** Decide which elements deserve their own entrance. Small decorations
 *  (confetti dots, sparkles, thin lines) are baked into the background so the
 *  story is told by text, photos and big shapes — and the clip stays short. */
function isHeroElement(el: El, W: number, H: number): boolean {
  if (el.type === "text") return el.text.trim().length > 0;
  if (el.type === "image") {
    // blended artwork (multiply/screen) and tiled patterns need the card
    // underneath them — keep them in the background render
    if (el.blend && el.blend !== "normal") return false;
    if (el.tile) return false;
    return true;
  }
  if (el.shape === "line") return false;
  const area = (el.w * el.h) / (W * H);
  // borders / panels / label pills behind text → background (text animates over them)
  if (area > 0.6) return false;
  if (el.shape === "rect" && el.fill !== "transparent" && (el.w / Math.max(1, el.h) > 3 || area > 0.12)) return false;
  if (el.fill === "transparent" && el.strokeWidth > 0) return false; // outline frames
  return area > 0.012;
}

export default function AnimatePanel({ doc, page, fileName, initial, onChange, onClose }: Props) {
  const [s, setS] = useState<AnimateSettings>(initial ?? DEFAULT_ANIMATE);
  const [scene, setScene] = useState<AnimScene | null>(null);
  const [prep, setPrep] = useState<"idle" | "rendering" | "ready" | "error">("idle");
  const [prepPct, setPrepPct] = useState(0);
  const [busy, setBusy] = useState<"video" | "share" | null>(null);
  const [pct, setPct] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderRoot = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const startRef = useRef(0);
  const mounted = useRef(false);

  const u = makeU("px", 1);
  const W = doc.width;
  const H = doc.height;
  const { heroEls, decorEls } = useMemo(() => {
    const heroEls: El[] = [];
    const decorEls: El[] = [];
    for (const el of page.elements) (isHeroElement(el, W, H) ? heroEls : decorEls).push(el);
    return { heroEls, decorEls };
  }, [page.elements, W, H]);
  // layers are rendered once at ~1× (700 px wide) and reused for export → fast
  const previewScale = useMemo(() => Math.min(1.1, 760 / W), [W]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    onChange?.(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s]);

  /* render layers once (and whenever the page changes) */
  useEffect(() => {
    let alive = true;
    (async () => {
      setPrep("rendering");
      try {
        await new Promise((r) => setTimeout(r, 120));
        const root = renderRoot.current;
        if (!root) throw new Error("no root");
        const { bg, layers } = await renderLayers(doc, page, root, previewScale, setPrepPct);
        if (!alive) return;
        setScene(buildScene(bg, layers, W * previewScale, H * previewScale, s));
        setPrep("ready");
      } catch (e) {
        console.error(e);
        if (alive) setPrep("error");
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id, heroEls.length, decorEls.length]);

  /* keep scene settings in sync without re-rendering layers */
  useEffect(() => {
    setScene((sc) => (sc ? buildScene(sc.bg, sc.layers, sc.W, sc.H, s) : sc));
  }, [s]);

  /* live preview loop */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !scene) return;
    c.width = scene.W;
    c.height = scene.H;
    const ctx = c.getContext("2d")!;
    startRef.current = performance.now() - t * 1000;
    const loop = (now: number) => {
      let tt = (now - startRef.current) / 1000;
      if (tt >= s.duration) {
        startRef.current = now;
        tt = 0;
      }
      setT(tt);
      drawAnimFrame(ctx, scene, tt);
      if (playing) raf.current = requestAnimationFrame(loop);
    };
    if (playing) raf.current = requestAnimationFrame(loop);
    else drawAnimFrame(ctx, scene, t);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, playing, s.duration]);

  function seek(sec: number) {
    setT(sec);
    startRef.current = performance.now() - sec * 1000;
    const c = canvasRef.current;
    if (c && scene) drawAnimFrame(c.getContext("2d")!, scene, sec);
  }
  const replay = () => {
    seek(0);
    setPlaying(true);
  };

  async function render(share: boolean) {
    if (!scene) return;
    setBusy(share ? "share" : "video");
    setPct(0);
    setPlaying(false);
    try {
      if (typeof MediaRecorder === "undefined") throw new Error("Video needs Chrome, Edge or Safari 17+.");
      // reuse the already-rendered layers; for 1080p re-render once at higher scale
      let sc: AnimScene;
      if (s.width >= 1080) {
        const root = renderRoot.current!;
        const scale = s.width / W;
        const { bg, layers } = await renderLayers(doc, page, root, scale, (p) => setPct(Math.round(p * 0.3)));
        sc = buildScene(bg, layers, Math.round(W * scale), Math.round(H * scale), s);
      } else {
        const k = s.width / scene.W;
        sc = buildScene(scene.bg, scene.layers.map((L) => ({ ...L, x: L.x * k, y: L.y * k, w: L.w * k, h: L.h * k })), Math.round(scene.W * k), Math.round(scene.H * k), s);
      }
      const canvas = document.createElement("canvas");
      canvas.width = sc.W;
      canvas.height = sc.H;
      const ctx = canvas.getContext("2d")!;
      const fps = 30;
      const stream = canvas.captureStream(fps);
      const { mime, ext } = pickMime();
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: s.width >= 1080 ? 9_000_000 : 6_000_000 });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const done = new Promise<Blob>((res) => (rec.onstop = () => res(new Blob(chunks, { type: mime }))));
      const frames = Math.round(s.duration * fps);
      rec.start(250);
      const t0 = performance.now();
      for (let f = 0; f < frames; f++) {
        drawAnimFrame(ctx, sc, f / fps);
        setPct(30 + Math.round((f / frames) * 70));
        const target = t0 + (f + 1) * (1000 / fps);
        const wait = target - performance.now();
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      }
      await new Promise((r) => setTimeout(r, 300));
      rec.stop();
      const blob = await done;
      const file = new File([blob], `${fileName}.${ext}`, { type: blob.type });
      if (share) {
        const ok = await shareFiles([file], fileName);
        if (!ok) downloadBlob(blob, file.name);
      } else downloadBlob(blob, file.name);
    } catch (e) {
      alert("Could not create the clip: " + (e as Error).message);
    }
    setBusy(null);
    setPct(0);
    setPlaying(true);
  }

  const fmt = (x: number) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, "0")}`;
  const minDur = Math.ceil(entranceEnd(s, heroEls.length) + 1);

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-slate-900/60 p-3 backdrop-blur-sm" onPointerDown={onClose}>
      {/* hidden render root: background + one node per element */}
      <div
        ref={renderRoot}
        aria-hidden
        // on-screen (html-to-image misrenders far-offscreen nodes) but fully
        // covered: behind the backdrop with z-index. NOT opacity/visibility —
        // those get baked into the cloned layers and make them blank.
        // Hidden with clip-path on this OUTER wrapper only: html-to-image clones
        // the inner layer nodes, so a clip on the ancestor is never baked in,
        // unlike opacity/visibility which produced blank layers.
        style={{ position: "fixed", left: 0, top: 0, width: W, height: H, pointerEvents: "none", zIndex: -1, overflow: "hidden", clipPath: "inset(0 100% 100% 0)" }}
      >
        <div data-anim-bg style={{ position: "absolute", inset: 0, width: W, height: H, background: page.background, overflow: "hidden" }}>
          {decorEls.map((el: El) => (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: el.x,
                top: el.y,
                width: el.w,
                height: el.type === "text" ? "auto" : el.h,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                transformOrigin: "center center",
                opacity: el.opacity,
              }}
            >
              <ElementBody el={el} u={u} />
            </div>
          ))}
        </div>
        {heroEls.map((el: El) => (
          <div
            key={el.id}
            data-anim-layer
            data-rot={el.rotation || 0}
            data-op={el.opacity}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              width: el.w,
              height: el.type === "text" ? "auto" : el.h,
            }}
          >
            <ElementBody el={el} u={u} />
          </div>
        ))}
      </div>

      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row" onPointerDown={(e) => e.stopPropagation()}>
        {/* preview */}
        <div className="flex flex-col items-center bg-maroon-950 bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,0.18),transparent_60%)] p-4 md:w-[420px] md:shrink-0" style={{ backgroundColor: "#2b0a10" }}>
          <div className="relative w-full max-w-[300px]">
            {prep !== "ready" ? (
              <div className="grid aspect-[7/10] w-full place-items-center rounded-xl bg-black/30 text-sm text-gold-100">
                {prep === "error" ? "Could not render this page" : `Preparing layers… ${prepPct}%`}
              </div>
            ) : (
              <canvas ref={canvasRef} className="w-full rounded-xl shadow-2xl" />
            )}
            <button onClick={() => setPlaying((p) => !p)} className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-lg text-slate-900 shadow" title={playing ? "Pause" : "Play"}>
              {playing ? "❚❚" : "▶"}
            </button>
            <button onClick={replay} className="absolute bottom-3 left-16 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-lg text-slate-900 shadow" title="Replay">
              ↺
            </button>
            <span className="absolute bottom-4 right-3 rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
              {fmt(t)} / {fmt(s.duration)}
            </span>
          </div>
          <input type="range" min={0} max={s.duration} step={0.05} value={Math.min(t, s.duration)} onChange={(e) => { setPlaying(false); seek(parseFloat(e.target.value)); }} className="mt-3 w-full max-w-[300px] accent-gold-500" />
          <p className="mt-2 text-center text-[11px] text-gold-200/70">{heroEls.length} elements animate one by one{decorEls.length ? ` · ${decorEls.length} decorations stay` : ""}</p>
        </div>

        {/* controls */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div>
              <h3 className="text-lg font-extrabold">✨ Animate this card</h3>
              <p className="text-xs text-slate-500">Elements enter one by one · {fmt(s.duration)} clip · {s.width}p</p>
            </div>
            <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-slate-500 hover:bg-slate-100">✕</button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Presets</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {ANIMATE_PRESETS.map((p) => (
                <button key={p.id} onClick={() => { setS((x) => ({ ...x, ...p.s })); replay(); }} className="rounded-xl bg-slate-50 p-2 text-center ring-1 ring-slate-200 transition hover:bg-gold-50 hover:ring-gold-400">
                  <span className="block text-xl">{p.emoji}</span>
                  <span className="block text-xs font-semibold text-slate-800">{p.name}</span>
                </button>
              ))}
            </div>

            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Entrance <span className="font-normal normal-case">— how each element appears</span></p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {ENTRANCES.map((e) => (
                <button key={e.id} onClick={() => { setS((x) => ({ ...x, entrance: e.id })); replay(); }} className={chip(s.entrance === e.id)}>
                  <span className="text-base leading-none">{e.icon}</span>{e.name}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Card motion</p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {MOTIONS.map((m) => (
                <button key={m.id} onClick={() => setS((x) => ({ ...x, motion: m.id }))} className={chip(s.motion === m.id)}>
                  <span className="text-base leading-none">{m.icon}</span>{m.name}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Effects overlay</p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {OVERLAYS.map((o) => (
                <button key={o.id} onClick={() => setS((x) => ({ ...x, overlay: o.id }))} className={chip(s.overlay === o.id)}>
                  <span className="text-base leading-none">{o.icon}</span>{o.name}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1 flex justify-between text-xs font-semibold text-slate-600">Clip length <span className="tabular-nums text-slate-400">{s.duration}s</span></span>
                <input type="range" min={minDur} max={30} step={1} value={Math.max(minDur, s.duration)} onChange={(e) => setS((x) => ({ ...x, duration: parseInt(e.target.value) }))} className="w-full accent-maroon-700" />
              </label>
              <label className="block">
                <span className="mb-1 flex justify-between text-xs font-semibold text-slate-600">Entrance speed <span className="tabular-nums text-slate-400">{s.speed.toFixed(1)}s</span></span>
                <input type="range" min={0.2} max={2} step={0.1} value={s.speed} onChange={(e) => { setS((x) => ({ ...x, speed: parseFloat(e.target.value) })); replay(); }} className="w-full accent-maroon-700" />
              </label>
              <label className="block">
                <span className="mb-1 flex justify-between text-xs font-semibold text-slate-600">Gap between elements <span className="tabular-nums text-slate-400">{s.stagger.toFixed(2)}s</span></span>
                <input type="range" min={0.05} max={1} step={0.05} value={s.stagger} onChange={(e) => { setS((x) => ({ ...x, stagger: parseFloat(e.target.value) })); replay(); }} className="w-full accent-maroon-700" />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Output</span>
              {([720, 1080] as const).map((w) => (
                <button key={w} onClick={() => setS((x) => ({ ...x, width: w }))} className={`rounded-full px-3 py-1 text-xs font-semibold ${s.width === w ? "bg-maroon-700 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>
                  {w}p {w === 720 ? "· WhatsApp" : "· Instagram/HD"}
                </button>
              ))}
              <label className="ml-auto flex items-center gap-2 text-xs font-medium text-slate-700">
                <input type="checkbox" checked={s.loop} onChange={(e) => setS((x) => ({ ...x, loop: e.target.checked }))} className="accent-maroon-700" />
                Repeat entrance (loop)
              </label>
            </div>
          </div>

          <div className="grid gap-2 border-t border-slate-100 p-4 sm:grid-cols-[1fr_auto]">
            <button onClick={() => void render(false)} disabled={busy !== null || prep !== "ready"} className="relative overflow-hidden rounded-xl bg-gradient-to-r from-maroon-700 to-maroon-600 py-3 text-sm font-bold text-white shadow-[var(--shadow-maroon)] ring-1 ring-gold-400/50 transition hover:from-maroon-600 hover:to-maroon-500 disabled:opacity-60">
              {busy ? (<><span className="absolute inset-y-0 left-0 bg-white/20 transition-all" style={{ width: `${pct}%` }} /><span className="relative">Rendering… {pct}%</span></>) : (<>⬇ Download clip ({fmt(s.duration)})</>)}
            </button>
            <button onClick={() => void render(true)} disabled={busy !== null || prep !== "ready"} className="rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:brightness-95 disabled:opacity-60">
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
