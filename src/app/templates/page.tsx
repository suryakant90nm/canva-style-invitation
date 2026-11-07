import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Header";
import { RevealObserver } from "@/components/Motion";
import { TemplateCard } from "@/components/TemplateCard";
import { BlankDesignButton } from "@/components/StartButtons";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { listTemplates } from "@/lib/data";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const cat = sp.category ? getCategory(sp.category) : undefined;
  const tag = sp.tag;
  const title = cat
    ? tag
      ? `${cat.name} Designs — ${tag} Style`
      : `${cat.name} Maker Online Free — ${cat.plural} with Name & Photo`
    : "Free Templates — Invitation, Marriage, Baby Shower & Birthday Cards";
  const description = cat
    ? `Browse ${cat.plural.toLowerCase()} templates and customize them free online. Add your name, date, venue and photos, then download in HD for WhatsApp or print.`
    : "Browse free invitation, marriage, baby shower and birthday card templates. Customize any design with our easy online editor and download in HD.";
  return {
    title,
    description,
    keywords: cat ? [`${cat.name.toLowerCase()} maker`, `${cat.name.toLowerCase()} design`, "free online card maker", ...SITE.keywords] : [...SITE.keywords],
    alternates: { canonical: `/templates${cat ? `?category=${cat.slug}` : ""}` },
    openGraph: { title: `${title} | ${SITE.name}`, description, url: SITE.url },
  };
}

type SP = { category?: string; tag?: string; q?: string; sort?: string };

function href(sp: SP, patch: Partial<SP>) {
  const m = { ...sp, ...patch };
  const p = new URLSearchParams();
  (Object.keys(m) as (keyof SP)[]).forEach((k) => {
    if (m[k]) p.set(k, m[k] as string);
  });
  const s = p.toString();
  return s ? `/templates?${s}` : "/templates";
}

const chip = (active: boolean) =>
  `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
    active ? "bg-maroon-700 text-white shadow-[var(--shadow-maroon)]" : "bg-white text-ink-soft ring-1 ring-gold-200/70 hover:bg-blush"
  }`;

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const cat = sp.category ? getCategory(sp.category) : undefined;
  const items = await listTemplates({
    category: cat?.slug,
    tag: sp.tag,
    q: sp.q?.trim(),
    sort: sp.sort,
  });
  const tags = cat ? cat.tags : Array.from(new Set(CATEGORIES.flatMap((c) => c.tags)));

  return (
    <>
      <Header />
      <RevealObserver />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-4xl">
              {cat ? `${cat.emoji} ${cat.plural}` : "All templates"}
            </h1>
            <p className="mt-1 text-ink-soft">
              {cat ? cat.description : "Invitation, marriage and baby shower cards – pick one and make it yours."}
            </p>
          </div>
          <form action="/templates" className="flex w-full max-w-md overflow-hidden rounded-full bg-white p-1 shadow-sm ring-1 ring-gold-200">
            {cat && <input type="hidden" name="category" value={cat.slug} />}
            <input
              name="q"
              defaultValue={sp.q}
              placeholder="Search templates…"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
            />
            <button className="btn-shine rounded-full bg-maroon-700 px-5 py-2 text-sm font-semibold text-white hover:bg-maroon-600">
              Search
            </button>
          </form>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          <Link href={href(sp, { category: undefined, tag: undefined })} className={chip(!cat)}>
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={href(sp, { category: c.slug, tag: undefined })} className={chip(cat?.slug === c.slug)}>
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Style</span>
          {tags.map((t) => (
            <Link
              key={t}
              href={href(sp, { tag: sp.tag === t ? undefined : t })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                sp.tag === t ? "bg-gold-500 text-maroon-900" : "bg-gold-50 text-maroon-700 ring-1 ring-gold-200 hover:bg-gold-100"
              }`}
            >
              {t}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink-muted">Sort</span>
            {[
              ["", "Recommended"],
              ["popular", "Popular"],
              ["new", "Newest"],
            ].map(([v, l]) => (
              <Link
                key={v}
                href={href(sp, { sort: v || undefined })}
                className={`rounded-full px-3 py-1 font-medium ${
                  (sp.sort ?? "") === v ? "bg-maroon-700 text-white" : "bg-white text-ink-soft ring-1 ring-gold-200/70"
                }`}
              >
                {l}
              </Link>
            ))}
          </span>
        </div>

        <div className="reveal-stagger mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          <BlankDesignButton
            category={cat?.slug}
            className="flex aspect-[4/5] flex-col items-center justify-center gap-2 self-start rounded-2xl border-2 border-dashed border-gold-400 bg-gold-50 text-maroon-700 transition hover:bg-gold-100"
          >
            <span className="text-5xl leading-none">+</span>
            <span className="text-sm font-semibold">Start from blank</span>
          </BlankDesignButton>
          {items.map((t) => (
            <TemplateCard key={t.slug} t={t} />
          ))}
        </div>
        {items.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center ring-1 ring-gold-200">
            <p className="text-lg font-semibold">No templates found</p>
            <p className="mt-1 text-ink-soft">Try another search or clear the filters.</p>
            <Link href="/templates" className="mt-4 inline-block font-semibold text-maroon-700 hover:underline">
              Clear filters
            </Link>
          </div>
        )}

        {cat && (
          <section className="mt-14 max-w-3xl text-sm leading-relaxed text-ink-soft">
            <h2 className="font-display text-xl font-bold text-ink">
              {cat.name} maker online free — {cat.plural}{" "}
              <span className="font-semibold text-ink-soft">with name &amp; photo</span>
            </h2>
            <p className="mt-2">
              Create a beautiful {cat.name.toLowerCase()} in two minutes. Pick any design below, edit the names, date,
              venue and colours, add your own photos, then download it in HD. Perfect for WhatsApp e-invites, Instagram
              posts and print.
            </p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
