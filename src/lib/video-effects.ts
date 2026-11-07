/**
 * Video effect definitions shared by the editor UI, the Story builder and the
 * renderer. Every page can carry its own `motion` (how it moves while shown)
 * and `transition` (how it enters). Presets bundle sensible combinations.
 */

export type Transition =
  | "fade"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "zoom-in"
  | "zoom-out"
  | "flip"
  | "wipe"
  | "circle"
  | "blur"
  | "none";

export type Motion =
  | "still"
  | "zoom-in"
  | "zoom-out"
  | "pan-left"
  | "pan-right"
  | "pan-up"
  | "pan-down"
  | "float"
  | "pulse";

export type Overlay = "none" | "sparkles" | "petals" | "confetti" | "bokeh" | "light-leak";

export type PageEffect = {
  transition: Transition;
  motion: Motion;
  /** seconds this page stays on screen */
  duration: number;
  /** transition length in seconds */
  transitionDuration: number;
  overlay: Overlay;
};

export type VideoSettings = {
  /** fallback for pages without their own effect */
  defaults: PageEffect;
  /** per-page overrides by page id */
  pages: Record<string, Partial<PageEffect>>;
  /** 720 (WhatsApp) or 1080 (Instagram) */
  width: 720 | 1080;
  /** background music id (optional, future) */
  music?: string | null;
  /** intro/outro black fade */
  fadeInOut: boolean;
};

export const TRANSITIONS: { id: Transition; name: string; icon: string }[] = [
  { id: "fade", name: "Fade", icon: "◐" },
  { id: "slide-left", name: "Slide left", icon: "←" },
  { id: "slide-right", name: "Slide right", icon: "→" },
  { id: "slide-up", name: "Slide up", icon: "↑" },
  { id: "slide-down", name: "Slide down", icon: "↓" },
  { id: "zoom-in", name: "Zoom in", icon: "⤢" },
  { id: "zoom-out", name: "Zoom out", icon: "⤡" },
  { id: "flip", name: "Flip", icon: "⟲" },
  { id: "wipe", name: "Wipe", icon: "▥" },
  { id: "circle", name: "Circle", icon: "◯" },
  { id: "blur", name: "Blur", icon: "≋" },
  { id: "none", name: "Cut", icon: "▮" },
];

export const MOTIONS: { id: Motion; name: string; icon: string }[] = [
  { id: "still", name: "Still", icon: "▣" },
  { id: "zoom-in", name: "Slow zoom in", icon: "🔍" },
  { id: "zoom-out", name: "Slow zoom out", icon: "🔎" },
  { id: "pan-left", name: "Pan left", icon: "⇠" },
  { id: "pan-right", name: "Pan right", icon: "⇢" },
  { id: "pan-up", name: "Pan up", icon: "⇡" },
  { id: "pan-down", name: "Pan down", icon: "⇣" },
  { id: "float", name: "Gentle float", icon: "〰" },
  { id: "pulse", name: "Heartbeat", icon: "💓" },
];

export const OVERLAYS: { id: Overlay; name: string; icon: string }[] = [
  { id: "none", name: "None", icon: "∅" },
  { id: "sparkles", name: "Sparkles", icon: "✨" },
  { id: "petals", name: "Falling petals", icon: "🌸" },
  { id: "confetti", name: "Confetti", icon: "🎊" },
  { id: "bokeh", name: "Bokeh lights", icon: "🔆" },
  { id: "light-leak", name: "Light leak", icon: "🌅" },
];

export const DEFAULT_EFFECT: PageEffect = {
  transition: "fade",
  motion: "zoom-in",
  duration: 3.2,
  transitionDuration: 0.7,
  overlay: "none",
};

export const DEFAULT_VIDEO: VideoSettings = {
  defaults: DEFAULT_EFFECT,
  pages: {},
  width: 720,
  fadeInOut: true,
};

export type Preset = { id: string; name: string; emoji: string; description: string; effect: PageEffect; alternate?: Partial<PageEffect>[] };

/** One-click styles. `alternate` cycles through pages for variety. */
export const PRESETS: Preset[] = [
  {
    id: "royal",
    name: "Royal",
    emoji: "👑",
    description: "Slow zoom, soft fades, golden sparkles",
    effect: { transition: "fade", motion: "zoom-in", duration: 3.6, transitionDuration: 0.9, overlay: "sparkles" },
  },
  {
    id: "festive",
    name: "Festive",
    emoji: "🎉",
    description: "Energetic slides, confetti",
    effect: { transition: "slide-left", motion: "pan-right", duration: 2.6, transitionDuration: 0.5, overlay: "confetti" },
    alternate: [{ transition: "slide-up" }, { transition: "zoom-in" }, { transition: "slide-right" }],
  },
  {
    id: "romantic",
    name: "Romantic",
    emoji: "💕",
    description: "Gentle float, falling petals, blur fades",
    effect: { transition: "blur", motion: "float", duration: 3.8, transitionDuration: 1.0, overlay: "petals" },
  },
  {
    id: "minimal",
    name: "Minimal",
    emoji: "◻",
    description: "Clean cuts, still frames",
    effect: { transition: "fade", motion: "still", duration: 3.0, transitionDuration: 0.4, overlay: "none" },
  },
  {
    id: "cinematic",
    name: "Cinematic",
    emoji: "🎬",
    description: "Wide pans, light leaks, slow",
    effect: { transition: "wipe", motion: "pan-left", duration: 4.0, transitionDuration: 0.8, overlay: "light-leak" },
    alternate: [{ motion: "pan-right" }, { motion: "zoom-out" }],
  },
  {
    id: "party",
    name: "Party",
    emoji: "🪩",
    description: "Fast flips & zooms, bokeh",
    effect: { transition: "flip", motion: "pulse", duration: 2.2, transitionDuration: 0.45, overlay: "bokeh" },
    alternate: [{ transition: "zoom-in" }, { transition: "circle" }],
  },
];

export function effectForPage(settings: VideoSettings, pageId: string): PageEffect {
  return { ...settings.defaults, ...(settings.pages[pageId] ?? {}) };
}

export function applyPreset(settings: VideoSettings, preset: Preset, pageIds: string[]): VideoSettings {
  const pages: Record<string, Partial<PageEffect>> = {};
  if (preset.alternate?.length) {
    pageIds.forEach((id, i) => {
      if (i === 0) return; // first page uses base effect
      pages[id] = preset.alternate![(i - 1) % preset.alternate!.length];
    });
  }
  return { ...settings, defaults: { ...preset.effect }, pages };
}

export function totalDuration(settings: VideoSettings, pageIds: string[]): number {
  return pageIds.reduce((s, id) => s + effectForPage(settings, id).duration, 0);
}
