"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DesignView } from "@/components/DesignView";
import { CATEGORIES } from "@/lib/categories";
import type { Doc } from "@/lib/design";
import { createDesign } from "@/lib/owner";
import { patchLocalDesign } from "@/lib/local-designs";

type Row = {
  builtin?: boolean;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  source: string;
  featured: boolean;
  hidden: boolean;
  uses: number;
  width: number;
  height: number;
  data: Doc;
};
type Stats = {
  templates: number;
  hidden: number;
  community: number;
  featured: number;
  byCategory: Record<string, number>;
  totalUses: number;
  designs: number;
  db: boolean;
  top: { slug: string; title: string; uses: number }[];
};
type Site = { announcement?: string; maintenance?: boolean };
type Tab = "dashboard" | "templates" | "site";

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [site, setSite] = useState<Site>({});
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [onlyHidden, setOnlyHidden] = useState(false);
  const [toast, setToast] = useState("");

  const load = async () => {
    const [a, b] = await Promise.all([fetch("/api/admin/stats"), fetch("/api/admin/templates")]);
    if (a.status === 401 || b.status === 401) {
      window.location.reload();
      return;
    }
    const sj = (await a.json()) as { stats: Stats; site: Site };
    const tj = (await b.json()) as { templates: Row[] };
    setStats(sj.stats);
    setSite(sj.site ?? {});
    setRows(tj.templates);
  };
  useEffect(() => {
    void load();
  }, []);

  const say = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 1800);
  };

  async function patch(slug: string, p: Partial<Row>) {
    setRows((r) => r?.map((x) => (x.slug === slug ? { ...x, ...p } : x)) ?? r);
    const res = await fetch("/api/admin/templates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...p }),
    });
    say(res.ok ? "Saved" : "Failed");
    if (res.ok) void load();
  }

  async function remove(slug: string, isBuiltinEdit: boolean) {
    const msg = isBuiltinEdit
      ? "Discard your edits and restore the ORIGINAL built-in design?"
      : "Delete this template from the library permanently?";
    if (!confirm(msg)) return;
    const res = await fetch(`/api/admin/templates?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    const j = (await res.json().catch(() => ({}))) as { error?: string; reverted?: boolean };
    say(res.ok ? (j.reverted ? "Restored original" : "Deleted") : j.error ?? "Failed");
    void load();
  }

  async function saveSite(p: Site) {
    const res = await fetch("/api/admin/stats", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    const j = (await res.json()) as { site: Site };
    setSite(j.site);
    say("Site settings saved");
  }

  /** Open the editor to create a brand-new official template. */
  async function newTemplate(category = "wedding") {
    say("Opening editor…");
    const id = await createDesign({ category, title: "New template" });
    sessionStorage.removeItem(`admin-tpl-${id}`);
    window.location.href = `/editor/${id}`;
  }

  /** Open an existing template in the editor; saving overwrites it in the library. */
  async function editTemplate(r: Row) {
    say("Opening editor…");
    const id = await createDesign({ templateSlug: r.slug, title: r.title });
    try {
      patchLocalDesign(id, { title: r.title, data: r.data, category: r.category });
    } catch {
      /* ignore */
    }
    sessionStorage.setItem(
      `admin-tpl-${id}`,
      JSON.stringify({ slug: r.slug, title: r.title, category: r.category, tags: r.tags, featured: r.featured }),
    );
    window.location.href = `/editor/${id}`;
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/";
  }

  const builtinSlugs = useMemo(() => new Set((rows ?? []).filter((r) => r.builtin).map((r) => r.slug)), [rows]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter(
      (r) =>
        (!cat || r.category === cat) &&
        (!onlyHidden || r.hidden) &&
        (!q || r.title.toLowerCase().includes(q.toLowerCase()) || r.slug.includes(q.toLowerCase()) || r.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))),
    );
  }, [rows, q, cat, onlyHidden]);

  const navBtn = (t: Tab, label: string, icon: string) => (
    <button
      onClick={() => setTab(t)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
        tab === t ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-slate-950 p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500">🔐</span>
          <div>
            <p className="text-sm font-extrabold leading-tight">ShubhInvite</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Super Admin</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navBtn("dashboard", "Dashboard", "📊")}
          {navBtn("templates", "Templates", "🗂️")}
          {navBtn("site", "Site settings", "⚙️")}
        </nav>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <Link href="/" className="block rounded-xl px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
            ↗ View site
          </Link>
          <button onClick={logout} className="block w-full rounded-xl px-4 py-2 text-left text-sm text-rose-300 hover:bg-white/10">
            Sign out
          </button>
        </div>
      </aside>

      {/* content */}
      <main className="min-w-0 flex-1">
        {/* mobile top bar */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 md:hidden">
          {(["dashboard", "templates", "site"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${tab === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>
              {t}
            </button>
          ))}
          <button onClick={logout} className="ml-auto text-xs font-semibold text-rose-600">Sign out</button>
        </div>

        <div className="mx-auto max-w-6xl p-4 sm:p-6">
          {toast && <div className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl">{toast}</div>}

          {/* ───────── DASHBOARD ───────── */}
          {tab === "dashboard" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-extrabold">Dashboard</h1>
                <button onClick={() => void newTemplate("wedding")} className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-violet-500/30 hover:brightness-110">
                  + New template
                </button>
              </div>
              <p className="text-sm text-slate-500">
                Storage: {stats?.db ? "PostgreSQL ✓" : "memory (no DATABASE_URL) — overrides reset on redeploy"}
              </p>
              {!stats ? (
                <p className="mt-6 text-slate-400">Loading…</p>
              ) : (
                <>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {[
                      ["Templates", stats.templates, "🗂️"],
                      ["Featured", stats.featured, "⭐"],
                      ["Hidden", stats.hidden, "🙈"],
                      ["Community", stats.community, "👥"],
                      ["Designs made", stats.designs, "✏️"],
                      ["Template uses", stats.totalUses, "📈"],
                    ].map(([l, v, i]) => (
                      <div key={String(l)} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                        <p className="text-2xl">{i}</p>
                        <p className="mt-1 text-2xl font-extrabold">{v}</p>
                        <p className="text-xs text-slate-500">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                      <h2 className="font-bold">By category</h2>
                      <ul className="mt-3 space-y-2">
                        {CATEGORIES.map((c) => {
                          const n = stats.byCategory[c.slug] ?? 0;
                          const pct = stats.templates ? Math.round((n / stats.templates) * 100) : 0;
                          return (
                            <li key={c.slug}>
                              <div className="flex justify-between text-sm">
                                <span>{c.emoji} {c.plural}</span>
                                <span className="font-semibold">{n}</span>
                              </div>
                              <div className="mt-1 h-2 rounded-full bg-slate-100">
                                <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: c.gradient }} />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                      <h2 className="font-bold">Most used templates</h2>
                      <ol className="mt-3 space-y-2 text-sm">
                        {stats.top.map((t, i) => (
                          <li key={t.slug} className="flex items-center justify-between">
                            <span className="truncate">
                              <span className="mr-2 text-slate-400">{i + 1}.</span>
                              {t.title}
                            </span>
                            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">{t.uses}</span>
                          </li>
                        ))}
                        {stats.top.every((t) => t.uses === 0) && <li className="text-slate-400">No usage yet.</li>}
                      </ol>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ───────── TEMPLATES ───────── */}
          {tab === "templates" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-extrabold">Templates</h1>
                  <p className="text-sm text-slate-500">Hide, feature, rename or re-categorise. Built-in designs live in code; community ones can be deleted.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/templates" className="text-sm font-semibold text-violet-600 hover:underline">
                    View public library →
                  </Link>
                  <div className="relative">
                    <select
                      onChange={(e) => e.target.value && void newTemplate(e.target.value)}
                      defaultValue=""
                      className="appearance-none rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2 pl-4 pr-9 text-sm font-bold text-white shadow-md shadow-violet-500/30 outline-none hover:brightness-110"
                    >
                      <option value="" disabled>
                        + New template
                      </option>
                      {CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug} className="text-slate-900">
                          {c.emoji} {c.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white">▾</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-900 ring-1 ring-violet-100">
                <b>How to add a template:</b> click <b>+ New template</b> → design it in the editor → press <b>★ Save as official
                template</b> (top-right, admin only). To change an existing one, click <b>Edit</b> on its card — saving
                overwrites it in the library. Everything is stored in the database; nothing to upload to GitHub.
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, slug, tag…" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 sm:w-64" />
                <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                  <option value="">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={onlyHidden} onChange={(e) => setOnlyHidden(e.target.checked)} className="accent-violet-600" /> Hidden only
                </label>
                <span className="ml-auto text-xs text-slate-500">{filtered.length} shown</span>
              </div>

              {!rows ? (
                <p className="mt-6 text-slate-400">Loading…</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((r) => (
                    <div key={r.slug} className={`flex gap-3 rounded-2xl bg-white p-3 ring-1 ${r.hidden ? "opacity-60 ring-rose-200" : "ring-slate-200"}`}>
                      <div className="w-20 shrink-0 overflow-hidden rounded-lg shadow">
                        <DesignView doc={r.data} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <input
                          defaultValue={r.title}
                          onBlur={(e) => e.target.value.trim() && e.target.value !== r.title && patch(r.slug, { title: e.target.value.trim() })}
                          className="w-full truncate rounded-md border border-transparent px-1 text-sm font-bold hover:border-slate-200 focus:border-violet-400 focus:outline-none"
                        />
                        <p className="truncate px-1 text-[11px] text-slate-400">{r.slug}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1 px-1">
                          <select value={r.category} onChange={(e) => patch(r.slug, { category: e.target.value })} className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px]">
                            {CATEGORIES.map((c) => (
                              <option key={c.slug} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${r.source === "community" ? "bg-fuchsia-100 text-fuchsia-700" : r.source === "admin" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{r.source === "system" ? "built-in" : r.source}</span>
                          <span className="text-[11px] text-slate-400">· {r.uses} uses</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5 px-1">
                          <button onClick={() => patch(r.slug, { featured: !r.featured })} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.featured ? "bg-amber-400 text-amber-950" : "bg-slate-100 text-slate-600 hover:bg-amber-100"}`}>
                            ⭐ {r.featured ? "Featured" : "Feature"}
                          </button>
                          <button onClick={() => patch(r.slug, { hidden: !r.hidden })} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.hidden ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-rose-100"}`}>
                            {r.hidden ? "🙈 Hidden" : "Hide"}
                          </button>
                          <button onClick={() => void editTemplate(r)} className="rounded-full bg-violet-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-violet-700">
                            ✎ Edit
                          </button>
                          <Link href={`/templates/${r.slug}`} target="_blank" className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-violet-100">
                            Open ↗
                          </Link>
                          {r.source !== "system" && (
                            <button
                              onClick={() => remove(r.slug, r.source === "admin" && builtinSlugs.has(r.slug))}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-100"
                            >
                              {r.source === "admin" && builtinSlugs.has(r.slug) ? "↺ Restore original" : "Delete"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ───────── SITE ───────── */}
          {tab === "site" && (
            <>
              <h1 className="text-2xl font-extrabold">Site settings</h1>
              <div className="mt-5 max-w-xl space-y-5">
                <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                  <h2 className="font-bold">Announcement banner</h2>
                  <p className="text-xs text-slate-500">Shown at the top of the home page. Leave empty to hide.</p>
                  <textarea
                    defaultValue={site.announcement ?? ""}
                    onBlur={(e) => saveSite({ announcement: e.target.value })}
                    rows={2}
                    placeholder="e.g. 🎉 Diwali offer — new festival templates added!"
                    className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                </div>
                <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                  <label className="flex items-start gap-3">
                    <input type="checkbox" checked={!!site.maintenance} onChange={(e) => saveSite({ maintenance: e.target.checked })} className="mt-1 accent-violet-600" />
                    <span>
                      <span className="block font-bold">Maintenance notice</span>
                      <span className="block text-xs text-slate-500">Shows a "we'll be back soon" strip on public pages (site stays usable).</span>
                    </span>
                  </label>
                </div>
                <div className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-900 ring-1 ring-amber-200">
                  <b>Adding new templates:</b> Templates tab → <b>+ New template</b> → design → <b>★ Save as official template</b>.
                  Saved in the database — no code or GitHub needed. (Developers can still add code templates in
                  <code> src/lib/templates/my-templates.ts</code>.)
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
