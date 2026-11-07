"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createDesign } from "@/lib/owner";
import { CATEGORIES } from "@/lib/categories";
import { SIZE_PRESETS } from "@/lib/design";

export function UseTemplateButton({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className={className}
      onClick={async () => {
        setBusy(true);
        try {
          const id = await createDesign({ templateSlug: slug });
          router.push(`/editor/${id}`);
        } catch {
          setBusy(false);
          alert("Something went wrong. Please try again.");
        }
      }}
    >
      {busy ? "Opening editor…" : (children ?? "Customize this template")}
    </button>
  );
}

export function BlankDesignButton({
  category,
  width,
  height,
  className,
  children,
}: {
  category?: string;
  width?: number;
  height?: number;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className={className}
      onClick={async () => {
        setBusy(true);
        try {
          const id = await createDesign({ category, width, height, title: "Untitled design" });
          router.push(`/editor/${id}`);
        } catch {
          setBusy(false);
          alert("Something went wrong. Please try again.");
        }
      }}
    >
      {busy ? "Creating…" : children}
    </button>
  );
}

export function CreateMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  async function go(opts: Parameters<typeof createDesign>[0]) {
    setBusy(true);
    try {
      const id = await createDesign({ ...opts, title: "Untitled design" });
      router.push(`/editor/${id}`);
    } catch {
      setBusy(false);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-shine whitespace-nowrap rounded-full bg-gradient-to-r from-maroon-700 to-maroon-600 px-3.5 py-2 text-sm font-semibold text-white shadow-[var(--shadow-maroon)] ring-1 ring-gold-400/50 transition hover:from-maroon-600 hover:to-maroon-500 sm:px-5 sm:py-2.5"
      >
        {busy ? "Creating…" : <><span className="xl:hidden">+ Create</span><span className="hidden xl:inline">+ Create a design</span></>}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-gold-200 bg-ivory p-2 shadow-2xl">
          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Blank canvas</p>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => go({ category: c.slug })}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-blush"
            >
              <span className="text-xl">{c.emoji}</span>
              <span className="font-medium text-slate-800">{c.name}</span>
            </button>
          ))}
          <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Custom size</p>
          {SIZE_PRESETS.slice(1, 5).map((s) => (
            <button
              key={s.name}
              onClick={() => go({ width: s.w, height: s.h })}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-blush"
            >
              <span className="text-slate-700">{s.name}</span>
              <span className="text-xs text-slate-400">
                {s.w}×{s.h}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
