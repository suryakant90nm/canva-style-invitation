import Link from "next/link";
import { Footer, Header } from "@/components/Header";
import { TemplateCard } from "@/components/TemplateCard";
import { DesignView } from "@/components/DesignView";
import { BlankDesignButton } from "@/components/StartButtons";
import { CATEGORIES } from "@/lib/categories";
import { listTemplates } from "@/lib/data";
import { SITE } from "@/lib/site";
import { T } from "@/components/T";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: "🖱️", title: "Drag & drop editor", text: "Move, resize, rotate, layer and align everything – just like Canva." },
  { icon: "🔤", title: "27 beautiful fonts", text: "Script, serif and Hindi (Devanagari) fonts made for wedding & party cards." },
  { icon: "📸", title: "Your photos & stock", text: "Upload couple photos, or search free stock photos right inside the editor." },
  { icon: "⬇️", title: "Download anywhere", text: "Export HD PNG / JPG or PDF – ready for WhatsApp, Instagram and print." },
  { icon: "💾", title: "Auto-save", text: "Every change is saved automatically. Come back to My designs any time." },
  { icon: "🧩", title: "Create your own templates", text: "Design from scratch and publish it as a template for others to use." },
];

export default async function HomePage() {
  const [featured, ...perCategory] = await Promise.all([
    listTemplates({ featured: true, limit: 4 }),
    ...CATEGORIES.map((c) => listTemplates({ category: c.slug, limit: 4 })),
  ]);

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                name: SITE.name,
                url: SITE.url,
                applicationCategory: "DesignApplication",
                operatingSystem: "Web",
                description: SITE.description,
                offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
                featureList: [
                  "Free invitation card templates",
                  "Marriage & shubh vivah card designs",
                  "Baby shower and godh bharai cards",
                  "Birthday photo collage maker",
                  "Hindi font support",
                  "HD PNG, JPG and PDF download",
                ],
                aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1284" },
              },
              {
                "@type": "Organization",
                name: SITE.name,
                url: SITE.url,
                areaServed: "IN",
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  ["Is this invitation card maker really free?", "Yes. Every template and every editing tool is free, and downloads have no watermark."],
                  ["Can I add my own photo to the card?", "Yes. Use a photo collage template, click an empty frame and upload your photo, or use the Photos tab."],
                  ["Can I write in Hindi?", "Yes. Hindi fonts like Yatra One, Rozha One and Tiro Devanagari are available for shubh vivah and godh bharai cards."],
                  ["What size should I use for WhatsApp?", "Card Portrait (700×1000) or WhatsApp/Story (720×1280) works best. Download as JPG for a smaller file."],
                  ["Do I need to create an account?", "No. Your designs are saved automatically on your device under My designs."],
                ].map(([q, a]) => ({
                  "@type": "Question",
                  name: q,
                  acceptedAnswer: { "@type": "Answer", text: a },
                })),
              },
            ],
          }),
        }}
      />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-fuchsia-600 to-rose-500">
          <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <div className="text-white">
              <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">
                <T k="heroBadge" />
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                <T k="heroTitle" /> <span className="text-amber-300"><T k="heroHighlight" /></span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/85">
                <T k="heroSub" />
              </p>
              <form action="/templates" className="mt-8 flex max-w-xl overflow-hidden rounded-full bg-white p-1.5 shadow-2xl">
                <input
                  name="q"
                  placeholder='Search templates – "mehendi", "gold", "boy"…'
                  className="min-w-0 flex-1 bg-transparent px-5 text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                  <T k="search" />
                </button>
              </form>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/story"
                  className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-amber-200"
                >
                  <T k="storyCta" />
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/templates?category=${c.slug}`}
                    className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white hover:text-violet-700"
                  >
                    {c.emoji} {c.name}
                  </Link>
                ))}
              </div>
              <p className="mt-5 text-sm text-white/70">
                <T k="languagesLine" />: हिंदी · मराठी · राजस्थानी · ਪੰਜਾਬੀ · ગુજરાતી · বাংলা · தமிழ் · తెలుగు · മലയാളം · ಕನ್ನಡ · ଓଡ଼ିଆ · اردو · English
              </p>
            </div>

            <div className="relative mx-auto hidden h-[480px] w-full max-w-lg lg:block">
              {featured.slice(0, 3).map((t, i) => {
                const pos = [
                  "left-0 top-14 w-52 -rotate-6",
                  "left-1/2 top-0 z-10 w-60 -translate-x-1/2 rotate-2",
                  "right-0 top-24 w-52 rotate-6",
                ][i];
                return (
                  <Link
                    key={t.slug}
                    href={`/templates/${t.slug}`}
                    className={`absolute overflow-hidden rounded-xl shadow-2xl ring-4 ring-white/70 transition hover:scale-105 ${pos}`}
                  >
                    <DesignView doc={t.data} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight"><T k="browse" /></h2>
              <p className="mt-1 text-slate-500"><T k="browseSub" /></p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.slug}
                href={`/templates?category=${c.slug}`}
                className="group relative overflow-hidden rounded-3xl p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: c.gradient }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl">{c.emoji}</div>
                    <h3 className="mt-3 text-2xl font-bold">{c.plural}</h3>
                    <p className="mt-1 max-w-[16rem] text-sm text-white/85">{c.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-slate-900 transition group-hover:bg-white">
                    <T k="explore" />
                  </span>
                  <div className="flex -space-x-8">
                    {perCategory[i].slice(0, 2).map((t, k) => (
                      <div
                        key={t.slug}
                        className="w-24 overflow-hidden rounded-lg shadow-xl ring-2 ring-white/80"
                        style={{ transform: `rotate(${k === 0 ? -8 : 7}deg) translateY(${k * 8}px)` }}
                      >
                        <DesignView doc={t.data} />
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PER CATEGORY ROWS */}
        {CATEGORIES.map((c, i) => (
          <section key={c.slug} className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight">
                {c.emoji} {c.plural}
              </h2>
              <Link href={`/templates?category=${c.slug}`} className="text-sm font-semibold text-violet-600 hover:underline">
                <T k="seeAll" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {perCategory[i].map((t) => (
                <TemplateCard key={t.slug} t={t} />
              ))}
            </div>
          </section>
        ))}

        {/* SEO COPY */}
        <section className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            India&apos;s easiest invitation card maker — marriage, baby shower &amp; birthday cards
          </h2>
          <div className="mt-4 grid gap-6 text-sm leading-relaxed text-slate-600 md:grid-cols-2">
            <p>
              <b className="text-slate-800">Marriage card design in minutes.</b> Choose a royal maroon shubh vivah
              card, a mehendi &amp; haldi invite or a modern minimal wedding card. Add the couple&apos;s names in
              beautiful script or Hindi fonts, set the muhurat, venue and RSVP details, and download a print-ready
              e-invite for WhatsApp.
            </p>
            <p>
              <b className="text-slate-800">Baby shower &amp; godh bharai invitations.</b> From “It&apos;s a girl”
              reveals and little prince themes to traditional godh bharai ceremony cards with Hindi text — everything
              is editable, including photo collages.
            </p>
            <p>
              <b className="text-slate-800">Birthday invitation card with photo.</b> Use our Canva-style photo collage
              templates, film strips and polaroid frames. Click any empty frame to add your photo — it takes less
              than two minutes.
            </p>
            <p>
              <b className="text-slate-800">Download anywhere.</b> Export HD PNG or JPG for WhatsApp status,
              Instagram and Facebook, or save a PDF for the print shop. No watermark, no signup required.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
            {[
              [
                "Is this invitation card maker really free?",
                "Yes. Every template and every editing tool is free, and downloads have no watermark.",
              ],
              [
                "Can I add my own photo to the card?",
                "Yes. Use a photo collage template, click an empty frame and upload your photo, or use the Photos tab.",
              ],
              [
                "Can I write in Hindi?",
                "Yes. The Text tab has Hindi fonts like Yatra One, Rozha One and Tiro Devanagari for shubh vivah and godh bharai cards.",
              ],
              [
                "What size should I use for WhatsApp?",
                "Card Portrait (700×1000) or WhatsApp/Story (720×1280) works best. Download as JPG for a smaller file.",
              ],
              [
                "Do I need to create an account?",
                "No. Your designs are saved automatically on your device under My designs.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="group p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 marker:hidden">
                  <span className="mr-2 text-violet-600 transition group-open:rotate-90 inline-block">▸</span>
                  {q}
                </summary>
                <p className="mt-2 pl-6 text-sm text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto mt-10 max-w-7xl px-6 py-14">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">Everything you need to make it yours</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-2xl">{f.icon}</div>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-slate-900 px-8 py-14 text-center text-white">
            <h2 className="text-3xl font-extrabold">Want to design from scratch?</h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-300">
              Open a blank canvas, add your own text, shapes and photos – then publish it as a template.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((c) => (
                <BlankDesignButton
                  key={c.slug}
                  category={c.slug}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
                >
                  {c.emoji} Blank {c.name}
                </BlankDesignButton>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
