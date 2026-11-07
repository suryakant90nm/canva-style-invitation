"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_VIDEO,
  MOTIONS,
  OVERLAYS,
  PRESETS,
  TRANSITIONS,
  applyPreset,
  effectForPage,
  totalDuration,
  type PageEffect,
  type VideoSettings,
} from "@/lib/video-effects";
import { buildTimeline, drawFrame, newParticleCache } from "@/lib/video-render";
import { downloadBlob, imagesToVideo, shareFiles } from "@/components/editor/export";

type Props = {
  /** already-rendered page images, in order */
  images: HTMLImageElement[];
  pageIds: string[];
  pageNames: string[];
  fileName: string;
  shareText: string;
  initial?: VideoSettings;
  onChange?: (s: VideoSettings) => void;
  onClose: () => void;
};

const chip = (on: boolean) =>
  `flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium ring-1 transition ${
    on ? "bg-violet-600 text-white ring-violet-600" : "bg-white text-slate-700 ring-slate-200 hover:bg-violet-50 hover:ring-violet-300"
  }`;

export default function VideoStudio({ images, pageIds, pageNames, fileName, shareText, initial, onChange, onClose }: Props) {
  const [settings, setSettings] = useState<VideoSettings>(initial ?? DEFAULT_VIDEO);
  const [active, setActive] = useState<string | "all">("all");
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const [busy, setBusy] = useState<"video" | "share" | null>(null);
  const [pct, setPct] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef(newParticleCache());
  const raf = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const tl = useMemo(() => buildTimeline(settings, pageIds), [settings, pageIds]);
  const total = tl.total;

  // notify parent only when the USER changes settings (not on mount, and not
  // because the parent re-rendered and passed a new onChange identity)
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    onChangeRef.current?.(settings);
  }, [settings]);

  /* ── live preview loop ── */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !images.length) return;
    const first = images[0];
    const W = 360;
    const H = Math.round((W * first.naturalHeight) / first.naturalWidth);
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;
    startRef.current = performance.now() - t * 1000;

    const loop = (now: number) => {
      let tt = (now - startRef.current) / 1000;
      if (tt >= total) {
        startRef.current = now;
        tt = 0;
      }
      setT(tt);
      drawFrame(ctx, images, tl, settings, particles.current, tt);
      if (playing) raf.current = requestAnimationFrame(loop);
    };
    if (playing) raf.current = requestAnimationFrame(loop);
    else drawFrame(ctx, images, tl, settings, particles.current, t);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, tl, settings, playing]);

  function seek(sec: number) {
    setT(sec);
    startRef.current = performance.now() - sec * 1000;
    const c = canvasRef.current;
    if (c) drawFrame(c.getContext("2d")!, images, tl, settings, particles.current, sec);
  }

  /* ── editing helpers ── */
  const current: PageEffect = active === "all" ? settings.defaults : effectForPage(settings, active);

  function patch(p: Partial<PageEffect>) {
    setSettings((s) => {
      if (active === "all") {
        // editing "All pages" clears per-page overrides for the touched keys
        const pages: typeof s.pages = {};
        for (const [id, ov] of Object.entries(s.pages)) {
          const rest = { ...ov };
          for (const k of Object.keys(p) as (keyof PageEffect)[]) delete rest[k];
          if (Object.keys(rest).length) pages[id] = rest;
        }
        return { ...s, defaults: { ...s.defaults, ...p }, pages };
      }
      return { ...s, pages: { ...s.pages, [active]: { ...(s.pages[active] ?? {}), ...p } } };
    });
    // jump preview to the edited page so the change is visible immediately
    if (active !== "all") {
      const seg = tl.pages.find((x) => x.id === active);
      if (seg) seek(Math.max(0, seg.start - 0.1));
    }
  }

  async function render(share: boolean) {
    setBusy(share ? "share" : "video");
    setPct(0);
    setPlaying(false);
    try {
      if (typeof MediaRecorder === "undefined") throw new Error("Video needs Chrome, Edge or Safari 17+.");
      const { blob, ext } = await imagesToVideo(images, { settings, pageIds, onProgress: setPct });
      const file = new File([blob], `${fileName}.${ext}`, { type: blob.type });
      if (share) {
        const ok = await shareFiles([file], shareText);
        if (!ok) downloadBlob(blob, file.name);
      } else {
        downloadBlob(blob, file.name);
      }
    } catch (e) {
      alert("Video export failed: " + (e as Error).message);
    }
    setBusy(null);
    setPct(0);
    setPlaying(true);
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-slate-900/60 p-3 backdrop-blur-sm" onPointerDown={onClose}>
      <div
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* ── preview ── */}
        <div className="flex flex-col items-center bg-slate-950 p-4 md:w-[420px] md:shrink-0">
          <div className="relative w-full max-w-[300px]">
            <canvas ref={canvasRef} className="w-full rounded-xl shadow-2xl" />
            <button
              onClick={() => setPlaying((p) => !p)}
              className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-lg text-slate-900 shadow"
              title={playing ? "Pause" : "Play"}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <span className="absolute bottom-4 right-3 rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
              {fmt(t)} / {fmt(total)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(0.1, total)}
            step={0.05}
            value={Math.min(t, total)}
            onChange={(e) => {
              setPlaying(false);
              seek(parseFloat(e.target.value));
            }}
            className="mt-3 w-full max-w-[300px] accent-violet-500"
          />
          {/* page chips on the timeline */}
          <div className="mt-2 flex w-full max-w-[300px] gap-1">
            {tl.pages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  setActive(p.id);
                  seek(p.start + 0.05);
                }}
                style={{ flex: p.effect.duration }}
                className={`truncate rounded-md px-1 py-1 text-[10px] font-semibold ${
                  active === p.id ? "bg-violet-500 text-white" : "bg-white/15 text-white/80 hover:bg-white/25"
                }`}
                title={pageNames[i]}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* ── controls ── */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div>
              <h3 className="text-lg font-extrabold">🎬 Video Studio</h3>
              <p className="text-xs text-slate-500">
                {pageIds.length} pages · {fmt(total)} · {settings.width}p
              </p>
            </div>
            <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-slate-500 hover:bg-slate-100">✕</button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {/* presets */}
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Style presets</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSettings((s) => applyPreset(s, p, pageIds));
                    setActive("all");
                    seek(0);
                  }}
                  className="rounded-xl bg-slate-50 p-2 text-center ring-1 ring-slate-200 transition hover:bg-violet-50 hover:ring-violet-300"
                  title={p.description}
                >
                  <span className="block text-xl">{p.emoji}</span>
                  <span className="block text-xs font-semibold text-slate-800">{p.name}</span>
                </button>
              ))}
            </div>

            {/* scope */}
            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Apply to</p>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setActive("all")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${active === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>
                All pages
              </button>
              {pageIds.map((id, i) => (
                <button
                  key={id}
                  onClick={() => {
                    setActive(id);
                    const seg = tl.pages[i];
                    seek(seg.start + 0.05);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${active === id ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-700"} ${settings.pages[id] ? "ring-2 ring-violet-300" : ""}`}
                  title={settings.pages[id] ? "has custom effect" : ""}
                >
                  {i + 1}. {pageNames[i].length > 12 ? pageNames[i].slice(0, 12) + "…" : pageNames[i]}
                </button>
              ))}
            </div>

            {/* transition */}
            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Transition <span className="font-normal normal-case text-slate-400">— how the page enters</span>
            </p>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
              {TRANSITIONS.map((tr) => (
                <button key={tr.id} onClick={() => patch({ transition: tr.id })} className={chip(current.transition === tr.id)}>
                  <span className="text-base leading-none">{tr.icon}</span>
                  {tr.name}
                </button>
              ))}
            </div>

            {/* motion */}
            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Motion <span className="font-normal normal-case text-slate-400">— movement while on screen</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {MOTIONS.map((m) => (
                <button key={m.id} onClick={() => patch({ motion: m.id })} className={chip(current.motion === m.id)}>
                  <span className="text-base leading-none">{m.icon}</span>
                  {m.name}
                </button>
              ))}
            </div>

            {/* overlay */}
            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Effects overlay
            </p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {OVERLAYS.map((o) => (
                <button key={o.id} onClick={() => patch({ overlay: o.id })} className={chip(current.overlay === o.id)}>
                  <span className="text-base leading-none">{o.icon}</span>
                  {o.name}
                </button>
              ))}
            </div>

            {/* timing */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
                  Page duration <span className="tabular-nums text-slate-400">{current.duration.toFixed(1)}s</span>
                </span>
                <input type="range" min={1} max={8} step={0.1} value={current.duration} onChange={(e) => patch({ duration: parseFloat(e.target.value) })} className="w-full accent-violet-600" />
              </label>
              <label className="block">
                <span className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
                  Transition speed <span className="tabular-nums text-slate-400">{current.transitionDuration.toFixed(1)}s</span>
                </span>
                <input type="range" min={0.2} max={2} step={0.1} value={current.transitionDuration} onChange={(e) => patch({ transitionDuration: parseFloat(e.target.value) })} className="w-full accent-violet-600" />
              </label>
            </div>

            {/* output */}
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Output</span>
              {([720, 1080] as const).map((w) => (
                <button key={w} onClick={() => setSettings((s) => ({ ...s, width: w }))} className={`rounded-full px-3 py-1 text-xs font-semibold ${settings.width === w ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>
                  {w}p {w === 720 ? "· WhatsApp" : "· Instagram/HD"}
                </button>
              ))}
              <label className="ml-auto flex items-center gap-2 text-xs font-medium text-slate-700">
                <input type="checkbox" checked={settings.fadeInOut} onChange={(e) => setSettings((s) => ({ ...s, fadeInOut: e.target.checked }))} className="accent-violet-600" />
                Fade in/out
              </label>
            </div>
          </div>

          {/* actions */}
          <div className="grid gap-2 border-t border-slate-100 p-4 sm:grid-cols-[1fr_auto_auto]">
            <button
              onClick={() => void render(false)}
              disabled={busy !== null}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition hover:brightness-110 disabled:opacity-70"
            >
              {busy ? (
                <>
                  <span className="absolute inset-y-0 left-0 bg-white/20 transition-all" style={{ width: `${pct}%` }} />
                  <span className="relative">Rendering… {pct}%</span>
                </>
              ) : (
                <>⬇ Download video ({fmt(total)})</>
              )}
            </button>
            <button onClick={() => void render(true)} disabled={busy !== null} className="rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:brightness-95 disabled:opacity-60">
              WhatsApp
            </button>
            <button onClick={() => { setSettings(DEFAULT_VIDEO); setActive("all"); seek(0); }} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
