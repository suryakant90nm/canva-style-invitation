"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { T } from "./T";

type Props = { templateThumbs: Record<string, { slug: string; title: string }[]> };

/**
 * Full-width mega menu. Hover (desktop) / tap (mobile) on "Templates" opens a
 * panel with every category, its style tags and quick links. Everything stays
 * on one line, so the header never wraps.
 */
export default function MegaMenu({ templateThumbs }: Props) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    const h = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMobile(false);
      }
    };
    document.addEventListener("pointerdown", h, true);
    return () => document.removeEventListener("pointerdown", h, true);
  }, []);

  const navLink =
    "whitespace-nowrap rounded-lg px-2.5 py-2 text-[14px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 xl:px-3 xl:text-[15px]";

  return (
    <div ref={wrapRef} className="contents">
      {/* ── desktop nav ── */}
      <nav className="hidden h-full items-center gap-0.5 lg:flex">
        <div className="h-full" onPointerEnter={show} onPointerLeave={hide}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`flex h-full items-center gap-1.5 whitespace-nowrap border-b-2 px-3 text-[15px] font-semibold transition ${
              open ? "border-violet-600 text-violet-700" : "border-transparent text-slate-800 hover:text-violet-700"
            }`}
            aria-expanded={open}
          >
            <T k="allTemplates" />
            <svg className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <Link
          href="/story"
          className="ml-1 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-200 to-amber-100 px-3.5 py-1.5 text-[14px] font-bold text-amber-900 shadow-sm ring-1 ring-amber-300/60 transition hover:from-amber-300 hover:to-amber-200"
        >
          <span>🎬</span>
          <T k="storyInvite" />
          <span className="rounded bg-rose-500 px-1.5 py-px text-[10px] font-extrabold uppercase tracking-wide text-white">New</span>
        </Link>

        <div className="hidden items-center gap-0.5 2xl:flex">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/templates?category=${c.slug}`} className={navLink} title={c.plural}>
              {c.emoji} {c.name.replace(/ Card$/, "")}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── mobile hamburger ── */}
      <button
        type="button"
        onClick={() => setMobile((m) => !m)}
        className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
        aria-label="Menu"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {/* ── mega panel (desktop) ── */}
      {open && (
        <div
          onPointerEnter={show}
          onPointerLeave={hide}
          className="absolute inset-x-0 top-full z-50 hidden border-t border-slate-200 bg-white shadow-[0_24px_60px_rgba(16,24,40,0.14)] lg:block"
        >
          <div className="mx-auto grid max-w-[1400px] grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-8 px-8 py-8">
            {/* featured */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">Most popular</p>
              <h3 className="mt-2 text-2xl font-extrabold leading-tight">
                Story Invite
                <br />
                <span className="text-amber-300">Haldi → Reception</span>
              </h3>
              <p className="mt-2 text-sm text-white/85">
                Sabhi wedding events ek hi invite me, 13 bhashaon me. WhatsApp par share karein.
              </p>
              <Link
                href="/story"
                onClick={() => setOpen(false)}
                className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-violet-700 transition hover:bg-amber-200"
              >
                Create now →
              </Link>
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <Link href="/templates" onClick={() => setOpen(false)} className="rounded-lg bg-white/15 px-3 py-2 font-semibold hover:bg-white/25">
                  🗂 All 67 templates
                </Link>
                <Link href="/my-designs" onClick={() => setOpen(false)} className="rounded-lg bg-white/15 px-3 py-2 font-semibold hover:bg-white/25">
                  💾 My designs
                </Link>
              </div>
            </div>

            {/* one column per category */}
            {CATEGORIES.map((c) => (
              <div key={c.slug}>
                <Link
                  href={`/templates?category=${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-2"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl text-lg" style={{ background: c.gradient }}>
                    {c.emoji}
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-slate-900 group-hover:text-violet-700">{c.plural}</span>
                    <span className="block text-[11px] text-slate-500">{templateThumbs[c.slug]?.length ?? 0} designs</span>
                  </span>
                </Link>
                <ul className="mt-3 space-y-1.5">
                  {c.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/templates?category=${c.slug}&tag=${encodeURIComponent(tag)}`}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-2 py-1 text-sm text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                      >
                        {tag}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={`/templates?category=${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="mt-1 block px-2 py-1 text-sm font-semibold text-violet-600 hover:underline"
                    >
                      <T k="seeAll" />
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── mobile drawer ── */}
      {mobile && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-slate-200 bg-white p-4 shadow-2xl lg:hidden">
          <Link href="/story" onClick={() => setMobile(false)} className="mb-3 flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-3 font-bold text-amber-900">
            🎬 <T k="storyInvite" />
          </Link>
          <Link href="/templates" onClick={() => setMobile(false)} className="block rounded-lg px-3 py-2.5 font-semibold text-slate-800 hover:bg-slate-100">
            <T k="allTemplates" />
          </Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/templates?category=${c.slug}`} onClick={() => setMobile(false)} className="block rounded-lg px-3 py-2.5 text-slate-700 hover:bg-slate-100">
              {c.emoji} {c.plural}
            </Link>
          ))}
          <Link href="/my-designs" onClick={() => setMobile(false)} className="block rounded-lg px-3 py-2.5 text-slate-700 hover:bg-slate-100">
            <T k="myDesigns" />
          </Link>
        </div>
      )}
    </div>
  );
}
