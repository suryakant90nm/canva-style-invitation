"use client";

import { useEffect, useMemo, useState } from "react";
import { PagesStack, PageView } from "@/components/DesignView";
import { LANGUAGES, getLanguage, type LangCode } from "@/lib/languages";
import { pack } from "@/lib/i18n-copy";
import { buildStoryInvite, defaultStoryEvents, type StoryEvent } from "@/lib/story";
import { downloadBlob, imagesToVideo, renderToImage, renderToImageElement, shareFiles } from "@/components/editor/export";
import { FONTS } from "@/lib/fonts";
import { createDesign } from "@/lib/owner";
import { getStoredLang, setStoredLang } from "@/components/LanguageSwitcher";
import { patchLocalDesign } from "@/lib/local-designs";

const EVENT_ORDER = ["haldi", "mehendi", "sangeet", "shaadi", "reception"];

export default function StoryBuilder() {
  const [lang, setLang] = useState<LangCode>("hi");
  const [couple, setCouple] = useState("Aarav & Ananya");
  const [events, setEvents] = useState<StoryEvent[]>(() => defaultStoryEvents("hi"));

  // follow the language picked in the header (default Hindi if none chosen yet)
  useEffect(() => {
    const stored = getStoredLang();
    if (stored && stored !== "en") {
      setLang(stored);
      setEvents(defaultStoryEvents(stored));
    }
  }, []);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const pk = pack(lang);
  const L = getLanguage(lang);

  const doc = useMemo(
    () => buildStoryInvite({ lang, couple: couple.trim() || "Aarav & Ananya", events }),
    [lang, couple, events],
  );
  const pages = doc.pages ?? [];

  function patch(i: number, key: keyof StoryEvent, value: string) {
    setEvents((prev) => prev.map((e, k) => (k === i ? { ...e, [key]: value } : e)));
  }
  function toggle(key: string) {
    setEvents((prev) => {
      if (prev.some((e) => e.key === key)) return prev.filter((e) => e.key !== key);
      const def = pk.events.find((x) => x.key === key)!;
      return [...prev, { key, date: "", time: "7:00 PM", venue: "" }].sort(
        (a, b) => EVENT_ORDER.indexOf(a.key) - EVENT_ORDER.indexOf(b.key),
      );
    });
  }
  function changeLang(code: LangCode) {
    setLang(code);
    setStoredLang(code);
    const existing = new Map(events.map((e) => [e.key, e]));
    const next = defaultStoryEvents(code).map((e) => existing.get(e.key) ?? e);
    setEvents(next);
  }

  const pageUrl = typeof window !== "undefined" ? window.location.origin : "";

  const [progress, setProgress] = useState(0);
  const allFamilies = FONTS.map((f) => f.name);
  const safeName = (couple || "story").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "story";

  function pageNodes(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>("#story-render [data-export-page]"));
  }

  /** Every page as its own JPG (WhatsApp shows them as an album). */
  async function downloadImages() {
    setBusy("image");
    try {
      const nodes = pageNodes();
      if (!nodes.length) throw new Error("render node missing");
      for (let i = 0; i < nodes.length; i++) {
        setProgress(Math.round(((i + 1) / nodes.length) * 100));
        const url = await renderToImage(nodes[i], "jpg", allFamilies, 2);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeName}-${i + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        await new Promise((r) => setTimeout(r, 350));
      }
    } catch (e) {
      alert("Could not export images: " + (e as Error).message);
    }
    setBusy(null);
    setProgress(0);
  }

  /** Real video file (MP4/WebM) — slideshow of all pages with fades + zoom. */
  async function downloadVideo(share = false) {
    setBusy(share ? "share" : "video");
    setProgress(0);
    try {
      if (typeof MediaRecorder === "undefined") {
        throw new Error("Is browser me video banana supported nahi hai. Chrome / Edge / Safari 17+ use karein.");
      }
      const nodes = pageNodes();
      if (!nodes.length) throw new Error("render node missing");
      const imgs: HTMLImageElement[] = [];
      for (let i = 0; i < nodes.length; i++) {
        setProgress(Math.round(((i + 1) / nodes.length) * 30));
        imgs.push(await renderToImageElement(nodes[i], allFamilies, 1.6));
      }
      const { blob, ext } = await imagesToVideo(imgs, {
        secondsPerPage: 3.2,
        fade: 0.7,
        width: 720,
        onProgress: (pct) => setProgress(30 + Math.round(pct * 0.7)),
      });
      const file = new File([blob], `${safeName}-invite.${ext}`, { type: blob.type });
      if (share) {
        const ok = await shareFiles([file], `${couple} — ${pk.events[0].title}`);
        if (!ok) downloadBlob(blob, file.name);
      } else {
        downloadBlob(blob, file.name);
      }
    } catch (e) {
      alert("Video export failed: " + (e as Error).message);
    }
    setBusy(null);
    setProgress(0);
  }

  async function openEditor() {
    setBusy("editor");
    try {
      const id = await createDesign({
        category: "wedding",
        width: doc.width,
        height: doc.height,
        title: `${couple} — Story Invite`,
      });
      // hand the whole multi-page doc to the editor; also mirror it locally so it
      // opens even if the server instance that created it is gone (serverless)
      sessionStorage.setItem(`story-${id}`, JSON.stringify(doc));
      try {
        patchLocalDesign(id, { title: `${couple} — Story Invite`, data: doc, category: "wedding" });
      } catch {
        /* ignore */
      }
      window.location.href = `/editor/${id}?story=1`;
    } catch {
      alert("Could not open the editor.");
    }
    setBusy(null);
  }

  async function shareWhatsApp() {
    // On phones: native share sheet with the actual video file (WhatsApp/Instagram/FB).
    // On desktop: falls back to a WhatsApp text link.
    const canNative = typeof navigator !== "undefined" && "share" in navigator && "canShare" in navigator;
    if (canNative) {
      await downloadVideo(true);
      return;
    }
    const text = `${couple} — ${pk.events[0].title}\n\n${pages.map((p, i) => `${i + 1}. ${p.name}`).join("\n")}\n\n${pageUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }
  function shareFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank");
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
          Story Invite — हल्दी से रिसेप्शन तक, एक ही कार्ड में
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Wedding me bahut saare functions hote hain. Ek ek alag card banane ki zaroorat nahi — yahan ek hi baar
          me sabhi events ke pages ban jaate hain, aapki bhasha me. Download karke WhatsApp par share karein,
          ya editor me aur customise karein.
        </p>
      </div>

      {/* language picker */}
      <div className="mb-6 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">भाषा / Language</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                lang === l.code ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {l.flag} {l.native}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* LEFT: form */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <label className="block text-sm font-semibold text-slate-800">
              Couple / दंपती के नाम
              <input value={couple} onChange={(e) => setCouple(e.target.value)} className={`mt-1.5 ${inputCls}`} placeholder="Aarav & Ananya" />
            </label>
          </div>

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <p className="mb-1 text-sm font-semibold text-slate-800">Events चुनें</p>
            <p className="mb-3 text-xs text-slate-500">जो functions चाहिए उन्हें tick करें — उनके pages बनेंगे।</p>
            <div className="flex flex-wrap gap-2">
              {pk.events
                .filter((e) => e.key !== "main")
                .map((e) => {
                  const on = events.some((x) => x.key === e.key);
                  return (
                    <button
                      key={e.key}
                      onClick={() => toggle(e.key)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        on ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {e.emoji} {e.title}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* per-event details */}
          <div className="space-y-4">
            {events.map((ev, i) => {
              const def = pk.events.find((x) => x.key === ev.key);
              return (
                <div key={ev.key} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                      {i + 1}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {def?.emoji} {def?.title}
                    </h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="text-xs font-medium text-slate-600">
                      {pk.labels.date}
                      <input value={ev.date} onChange={(e) => patch(i, "date", e.target.value)} className={`mt-1 ${inputCls}`} placeholder="14 December 2026" />
                    </label>
                    <label className="text-xs font-medium text-slate-600">
                      {pk.labels.time}
                      <input value={ev.time} onChange={(e) => patch(i, "time", e.target.value)} className={`mt-1 ${inputCls}`} placeholder="7:00 PM" />
                    </label>
                    <label className="text-xs font-medium text-slate-600">
                      {pk.labels.venue}
                      <input value={ev.venue} onChange={(e) => patch(i, "venue", e.target.value)} className={`mt-1 ${inputCls}`} placeholder="Taj Palace, Jaipur" />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: preview + actions (shown first on mobile) */}
        <div className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">
                Live preview · {pages.length} {pages.length === 1 ? "page" : "pages"}
              </p>
              <button onClick={() => setPreview((p) => !p)} className="text-xs font-semibold text-violet-600 hover:underline">
                {preview ? "Collapse" : "Expand all"}
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto rounded-xl bg-slate-50 p-3 sm:max-h-[520px]">
              {preview ? (
                <PagesStack doc={doc} />
              ) : (
                <>
                  <PageView doc={doc} page={pages[0]} className="shadow-md" />
                  {pages.length > 1 && (
                    <p className="mt-2 text-center text-xs text-slate-500">+ {pages.length - 1} more pages</p>
                  )}
                </>
              )}
            </div>

            {/* hidden high-res render target */}
            <div id="story-render" style={{ position: "fixed", left: -30000, top: 0, pointerEvents: "none" }}>
              {pages.map((pg) => (
                <div key={pg.id} data-export-page style={{ width: doc.width, marginBottom: 20 }}>
                  <PageView doc={doc} page={pg} mode="px" />
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              <button
                onClick={() => void downloadVideo(false)}
                disabled={busy !== null}
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition hover:brightness-110 disabled:opacity-70"
              >
                {busy === "video" || busy === "share" ? (
                  <>
                    <span className="absolute inset-y-0 left-0 bg-white/20 transition-all" style={{ width: `${progress}%` }} />
                    <span className="relative">🎬 Video ban raha hai… {progress}%</span>
                  </>
                ) : (
                  <>🎬 Download Video ({pages.length} pages · {Math.round(pages.length * 3.2)}s)</>
                )}
              </button>
              <button
                onClick={() => void downloadImages()}
                disabled={busy !== null}
                className="rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-60"
              >
                {busy === "image" ? `Rendering… ${progress}%` : `⬇ Download ${pages.length} images (JPG)`}
              </button>
              <button
                onClick={() => void openEditor()}
                disabled={busy !== null}
                className="rounded-xl border-2 border-violet-200 bg-white py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50 disabled:opacity-60"
              >
                {busy === "editor" ? "Opening…" : "✎ Open in editor & customise"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => void shareWhatsApp()} disabled={busy !== null} className="rounded-xl bg-[#25D366] py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60">
                  WhatsApp
                </button>
                <button onClick={shareFacebook} className="rounded-xl bg-[#1877F2] py-2.5 text-sm font-bold text-white transition hover:brightness-95">
                  Facebook
                </button>
              </div>
            </div>

            <p className="mt-3 text-[11px] leading-snug text-slate-500">
              Video sidha phone me ban jaata hai (koi upload nahi, 100% private). Mobile par WhatsApp button
              video file ko share sheet me kholta hai. PDF chahiye to editor me kholein → Download → PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
