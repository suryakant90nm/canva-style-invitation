"use client";

import { useLang } from "./LanguageSwitcher";
import { t, type UIKey } from "@/lib/ui-strings";
import { getLanguage } from "@/lib/languages";

/**
 * Translated text. Renders the English string on the server (for SEO),
 * then swaps to the user's chosen language on the client.
 */
export function T({ k }: { k: UIKey }) {
  const lang = useLang();
  return <>{t(lang, k)}</>;
}

/** Applies lang / dir attributes + native font to a wrapper for RTL support. */
export function LangBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const lang = useLang();
  const L = getLanguage(lang);
  return (
    <div lang={lang} dir={L.rtl ? "rtl" : "ltr"} className={className}>
      {children}
    </div>
  );
}
