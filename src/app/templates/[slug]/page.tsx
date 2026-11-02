import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/Header";
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
      <main className="mx-auto max-w-7xl px-6 py-10">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/templates" className="hover:text-violet-600">
            Templates
          </Link>{" "}
          /{" "}
          <Link href={`/templates?category=${t.category}`} className="hover:text-violet-600">
            {cat?.plural ?? t.category}
          </Link>{" "}
          / <span className="text-slate-800">{t.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid place-items-center rounded-3xl bg-gradient-to-br from-slate-200 to-slate-100 p-8 ring-1 ring-slate-200">
            <div className="w-full shadow-2xl" style={{ maxWidth: portrait ? 440 : 640 }}>
              <DesignView doc={t.data} />
            </div>
          </div>

          <div className="self-center">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
              {cat?.emoji} {cat?.name ?? t.category}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{t.title}</h1>
            <p className="mt-3 text-slate-600">
              Fully editable – change the names, date, venue, fonts, colours and background. Add your own photos and
              decorations, then download in HD.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                <dt className="text-slate-400">Size</dt>
                <dd className="font-semibold">
                  {t.width} × {t.height}
                </dd>
              </div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                <dt className="text-slate-400">Used</dt>
                <dd className="font-semibold">{t.uses} times</dd>
              </div>
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                <dt className="text-slate-400">By</dt>
                <dd className="font-semibold">{t.source === "community" ? "Community" : "CardCanvas"}</dd>
              </div>
            </dl>
            {t.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/templates?category=${t.category}&tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            <UseTemplateButton
              slug={t.slug}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
            >
              ✎ Customize this template
            </UseTemplateButton>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 text-2xl font-extrabold tracking-tight">More {cat?.plural ?? "templates"}</h2>
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
