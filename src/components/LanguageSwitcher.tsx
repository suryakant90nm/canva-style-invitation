"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES, type LangCode } from "@/lib/languages";

const KEY = "shubh-lang";

export function getStoredLang(): LangCode {
  if (typeof window === "undefined") return "en";
  return (window.localStorage.getItem(KEY) as LangCode) || "en";
}

export function setStoredLang(code: LangCode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, code);
  // let other components (e.g. editor text panel) react to the change
  window.dispatchEvent(new CustomEvent("shubh-lang-change", { detail: code }));
}

/** Subscribe to the current UI language. */
export function useLang(): LangCode {
  const [lang, setLang] = useState<LangCode>("en");
  useEffect(() => {
    setLang(getStoredLang());
    const h = (e: Event) => setLang((e as CustomEvent<LangCode>).detail);
    window.addEventListener("shubh-lang-change", h);
    return () => window.removeEventListener("shubh-lang-change", h);
  }, []);
  return lang;
}

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const current = useLang(); // shared with LanguageStrip → always in sync
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", h, true);
    return () => document.removeEventListener("pointerdown", h, true);
  }, [open]);

  const active = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language / भाषा बदलें"
        className={`flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 font-semibold text-maroon-800 transition hover:border-gold-500 hover:bg-gold-100 ${
          compact ? "px-2.5 py-1.5 text-xs sm:px-3" : "px-3.5 py-2 text-sm"
        }`}
        title="Change language"
      >
        <span className="text-base leading-none">🌐</span>
        <span className={compact ? "hidden sm:inline" : ""}>{active.native}</span>
        <span className="hidden text-xs text-gold-600 sm:inline">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-gold-200 bg-gradient-to-r from-maroon-700 to-maroon-900 px-4 py-3 text-white">
            <p className="text-xs font-bold uppercase tracking-wider opacity-90">भाषा चुनें · Choose language</p>
            <p className="text-[11px] opacity-80">13 Indian languages supported</p>
          </div>
          <div className="max-h-[380px] overflow-y-auto p-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setStoredLang(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-blush ${
                  l.code === current ? "bg-gold-100 text-maroon-800" : "text-ink-soft"
                }`}
              >
                <span className="text-base font-semibold">{l.native}</span>
                <span className="flex items-center gap-2 text-xs text-slate-400">
                  {l.english}
                  {l.code === current && <span className="text-gold-600">✓</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Horizontal row of language pills shown under the header. */
export function LanguageStrip() {
  const current = useLang();
  return (
    <div className="flex items-center gap-1.5">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setStoredLang(l.code)}
          className={`shrink-0 rounded-full px-2.5 py-1 font-semibold transition ${
            l.code === current
              ? "bg-violet-600 text-white shadow-sm"
              : "bg-white/80 text-slate-700 ring-1 ring-slate-200 hover:bg-violet-100 hover:text-violet-800"
          }`}
          title={l.english}
        >
          {l.native}
        </button>
      ))}
    </div>
  );
}
