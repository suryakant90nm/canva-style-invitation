import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/Header";
import { RevealObserver } from "@/components/Motion";
import { TemplateCard } from "@/components/TemplateCard";
import { DesignView } from "@/components/DesignView";
import { UseTemplateButton } from "@/components/StartButtons";
import { getCategory } from "@/lib/categories";
import { getTemplate, listTemplates } from "@/lib/data";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTemplate(slug);
  if (!t) return { title: "Template not found" };
  const cat = getCategory(t.category);
  const title = `${t.title} — Free Editable ${cat?.name ?? "Card"} Design`;
  const description = `Customize this free ${cat?.name.toLowerCase() ?? "card"} template online. Change names, dates, colours and photos, then download in HD for WhatsApp or print. No watermark.`;
  return {
    title,
    description,
    keywords: [t.title.toLowerCase(), `${cat?.name.toLowerCase()} template`, "free card design", ...SITE.keywords],
    alternates: { canonical: `/templates/${t.slug}` },
    openGraph: { title: `${title} | ${SITE.name}`, description, url: `${SITE.url}/templates/${t.slug}`, type: "article" },
  };
}

export default async function TemplateDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTemplate(slug);
  if (!t) notFound();
  const cat = getCategory(t.category);
  const related = (await listTemplates({ category: t.category, limit: 9 })).filter((r) => r.slug !== t.slug).slice(0, 4);
  const portrait = t.width < t.height;

  return (
    <>
      <Header />
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: t.title,
            description: `Free editable ${cat?.name.toLowerCase() ?? "card"} template: ${t.title}.`,
            category: cat?.name,
            brand: { "@type": "Brand", name: SITE.name },
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/InStock" },
            keywords: t.tags.join(", "),
          }),
        }}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <nav className="mb-6 text-sm text-ink-muted">
          <Link href="/templates" className="hover:text-maroon-700">
            Templates
          </Link>{" "}
          /{" "}
          <Link href={`/templates?category=${t.category}`} className="hover:text-maroon-700">
            {cat?.plural ?? t.category}
          </Link>{" "}
          / <span className="text-ink">{t.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid place-items-center rounded-3xl bg-gradient-to-br from-blush to-ivory-dark p-4 ring-1 ring-gold-200 sm:p-8">
            <div className="w-full shadow-2xl" style={{ maxWidth: portrait ? 440 : 640 }}>
              <DesignView doc={t.data} />
            </div>
          </div>

          <div className="self-center">
            <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-maroon-800">
              {cat?.emoji} {cat?.name ?? t.category}
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-4xl">{t.title}</h1>
            <p className="mt-3 text-ink-soft">
              Fully editable – change the names, date, venue, fonts, colours and background. Add your own photos and
              decorations, then download in HD.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-white p-3 ring-1 ring-gold-200/70">
                <dt className="text-ink-muted">Size</dt>
                <dd className="font-semibold">
                  {t.width} × {t.height}
                </dd>
              </div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-gold-200/70">
                <dt className="text-ink-muted">Used</dt>
                <dd className="font-semibold">{t.uses} times</dd>
              </div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-gold-200/70">
                <dt className="text-ink-muted">By</dt>
                <dd className="font-semibold">{t.source === "community" ? "Community" : "CardCanvas"}</dd>
              </div>
            </dl>
            {t.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/templates?category=${t.category}&tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink-soft ring-1 ring-gold-200/70 hover:bg-blush"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            <UseTemplateButton
              slug={t.slug}
              className="btn-shine mt-8 w-full rounded-full bg-gradient-to-r from-maroon-700 to-maroon-600 px-8 py-4 text-base font-bold text-white shadow-[var(--shadow-maroon)] ring-1 ring-gold-400/50 transition hover:from-maroon-600 hover:to-maroon-500 disabled:opacity-60 sm:w-auto"
            >
              ✎ Customize this template
            </UseTemplateButton>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 font-display text-2xl font-bold tracking-tight text-ink">More {cat?.plural ?? "templates"}</h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.map((r) => (
                <TemplateCard key={r.slug} t={r} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
