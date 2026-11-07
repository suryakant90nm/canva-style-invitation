import Link from "next/link";
import { Footer, Header } from "@/components/Header";
import { TemplateCard } from "@/components/TemplateCard";
import { DesignView } from "@/components/DesignView";
import { BlankDesignButton } from "@/components/StartButtons";
import { CATEGORIES } from "@/lib/categories";
import { listTemplates } from "@/lib/data";
import { SITE } from "@/lib/site";
import { getSiteConfig, type SiteConfig } from "@/lib/admin-store";
import { T } from "@/components/T";
import { CountUp, Petals, RevealObserver } from "@/components/Motion";
import { LogoMark } from "@/components/Logo";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: "✦", title: "Canva-style editor", text: "Drag, resize, rotate, layer and align — with snap guides, undo and autosave." },
  { icon: "🎬", title: "Video Studio", text: "Turn your pages into an MP4 with transitions, motion and sparkles. Rendered on your phone." },
  { icon: "🪔", title: "13 Indian languages", text: "हिंदी · मराठी · ਪੰਜਾਬੀ · ગુજરાતી · বাংলা · தமிழ் · తెలుగు and more, with native fonts." },
  { icon: "📸", title: "Your photos", text: "Tap any frame to add a picture, or pick from the free stock library." },
  { icon: "⬇", title: "Download anywhere", text: "HD PNG / JPG, print-ready PDF or video — ready for WhatsApp & Instagram." },
  { icon: "♥", title: "100% free, no watermark", text: "No signup. Everything saves automatically to My designs." },
];

const STEPS = [
  { n: "01", title: "Pick a template", text: "70+ designer cards for weddings, birthdays, baby showers & festivals." },
  { n: "02", title: "Make it yours", text: "Names, dates, colours, photos — in your language. Add pages for every event." },
  { n: "03", title: "Share the joy", text: "Download HD images, a PDF, or a video — and send on WhatsApp in one tap." },
];

export default async function HomePage() {
  const [site, featured, ...perCategory] = await Promise.all([
    getSiteConfig().catch((): SiteConfig => ({})),
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
      <RevealObserver />
      <main className="overflow-x-clip">
        {site.maintenance && (
          <div className="bg-gold-300 px-4 py-2 text-center text-sm font-semibold text-maroon-900">
            🛠 We're doing some maintenance — a few things may be slow. Thanks for your patience!
          </div>
        )}
        {site.announcement && (
          <div className="bg-maroon-800 px-4 py-2 text-center text-sm font-medium text-gold-100">{site.announcement}</div>
        )}

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 text-white">
          {/* ambient glows */}
          <div className="glow-pulse pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-gold-500/15 blur-3xl" />
          <div className="glow-pulse pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-maroon-400/25 blur-3xl [animation-delay:2s]" />
          {/* mandala rings */}
          <svg className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] opacity-[0.07]" viewBox="0 0 200 200" fill="none" stroke="#F2D98B" strokeWidth="0.6" aria-hidden>
            {[90, 76, 62, 48, 34, 20].map((r) => <circle key={r} cx="100" cy="100" r={r} />)}
            {Array.from({ length: 24 }, (_, i) => <line key={i} x1="100" y1="10" x2="100" y2="190" transform={`rotate(${i * 15} 100 100)`} />)}
          </svg>
          <Petals count={16} />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-28">
            <div className="min-w-0">
              <span className="anim-rise inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-200 backdrop-blur sm:px-4 sm:text-xs sm:tracking-widest">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-300" />
                <T k="heroBadge" />
              </span>
              <h1 className="anim-rise-1 mt-5 break-words font-display text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.6rem]">
                <T k="heroTitle" /> <span className="text-gold-shimmer"><T k="heroHighlight" /></span>
              </h1>
              <p className="anim-rise-2 mt-5 max-w-xl text-base text-maroon-100/90 sm:text-lg">
                <T k="heroSub" />
              </p>
              <form action="/templates" className="anim-rise-3 mt-7 flex max-w-xl overflow-hidden rounded-full bg-white p-1.5 shadow-[var(--shadow-gold)] ring-1 ring-gold-300/60">
                <input
                  name="q"
                  placeholder="Search templates…"
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink-muted sm:px-5 sm:text-base"
                />
                <button className="btn-shine shrink-0 rounded-full bg-maroon-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-600 sm:px-6 sm:py-3">
                  <T k="search" />
                </button>
              </form>
              <div className="anim-rise-4 mt-5 flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href="/story"
                  className="btn-shine w-full rounded-full bg-gradient-to-r from-gold-300 to-gold-400 px-5 py-2.5 text-center text-sm font-bold text-maroon-900 shadow-[var(--shadow-gold)] transition hover:from-gold-200 hover:to-gold-300 sm:w-auto"
                >
                  <T k="storyCta" />
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/templates?category=${c.slug}`}
                    className="rounded-full border border-gold-400/40 bg-white/5 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:border-gold-300 hover:bg-gold-400 hover:text-maroon-900 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {c.emoji} {c.name}
                  </Link>
                ))}
              </div>
              <div className="anim-rise-5 mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-maroon-100/80 sm:text-sm">
                <span><b className="font-display text-lg text-gold-200"><CountUp to={70} suffix="+" /></b> templates</span>
                <span><b className="font-display text-lg text-gold-200"><CountUp to={13} /></b> languages</span>
                <span><b className="font-display text-lg text-gold-200">MP4</b> video export</span>
                <span className="inline-flex items-center gap-1"><span className="text-gold-300">★★★★★</span> loved by families</span>
              </div>
            </div>

            {/* floating cards */}
            <div className="relative mx-auto hidden h-[520px] w-full max-w-lg lg:block">
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gold-400/10 blur-3xl" />
              {featured.slice(0, 3).map((t, i) => {
                const pos = ["left-0 top-16 w-52 float-a", "left-1/2 top-0 z-10 w-60 -translate-x-1/2 float-b", "right-0 top-28 w-52 float-c"][i];
                return (
                  <Link
                    key={t.slug}
                    href={`/templates/${t.slug}`}
                    className={`anim-rise-${i + 2} absolute overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-2 ring-gold-300/70 transition hover:!scale-105 hover:ring-gold-200 ${pos}`}
                  >
                    <DesignView doc={t.data} />
                  </Link>
                );
              })}
              <div className="anim-rise-5 absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-gold-100 ring-1 ring-gold-400/40 backdrop-blur">
                <LogoMark size={18} /> Made for Indian celebrations
              </div>
            </div>
          </div>

          {/* curved bottom edge */}
          <svg className="block w-full text-ivory" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
            <path d="M0 60V20C240 60 480 60 720 30S1200 0 1440 20V60z" fill="currentColor" />
          </svg>
        </section>

        {/* ═══════════════ LANGUAGE RIBBON ═══════════════ */}
        <div className="reveal border-y border-gold-200/60 bg-ivory-dark/60 py-3">
          <div className="flex overflow-hidden">
            <div className="marquee flex shrink-0 items-center gap-10 whitespace-nowrap px-5 text-sm font-semibold text-maroon-700">
              {[...Array(2)].map((_, k) =>
                ["हिंदी", "मराठी", "राजस्थानी", "ਪੰਜਾਬੀ", "ગુજરાતી", "বাংলা", "தமிழ்", "తెలుగు", "മലയാളം", "ಕನ್ನಡ", "ଓଡ଼ିଆ", "اردو", "English"].map((l) => (
                  <span key={k + l} className="inline-flex items-center gap-3">
                    {l} <span className="text-gold-500">✦</span>
                  </span>
                )),
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════ CATEGORIES ═══════════════ */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="reveal mb-8 text-center sm:mb-12">
            <p className="font-script text-3xl text-gold-600">Celebrate every moment</p>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"><T k="browse" /></h2>
            <div className="orn-line mx-auto mt-5 w-48" />
            <p className="mt-4 text-ink-soft"><T k="browseSub" /></p>
          </div>
          <div className="reveal-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.slug}
                href={`/templates?category=${c.slug}`}
                className="lift group relative overflow-hidden rounded-3xl p-6 text-white shadow-[var(--shadow-soft)] ring-1 ring-white/20"
                style={{ background: c.gradient }}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-xl transition-transform duration-700 group-hover:scale-150" />
                <div className="text-4xl drop-shadow">{c.emoji}</div>
                <h3 className="mt-3 font-display text-2xl font-bold">{c.plural}</h3>
                <p className="mt-1 max-w-[16rem] text-sm text-white/85">{c.description}</p>
                <div className="mt-6 flex items-end justify-between">
                  <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-ink transition group-hover:bg-gold-300">
                    <T k="explore" />
                  </span>
                  <div className="flex -space-x-8">
                    {perCategory[i].slice(0, 2).map((t, k) => (
                      <div
                        key={t.slug}
                        className="w-24 overflow-hidden rounded-lg shadow-xl ring-2 ring-white/80 transition-transform duration-500 group-hover:-translate-y-1"
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

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section className="relative overflow-hidden bg-blush/60 py-14 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="reveal text-center">
              <p className="font-script text-3xl text-gold-600">Simple as 1 · 2 · 3</p>
              <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">How it works</h2>
            </div>
            <div className="reveal-stagger mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((st, i) => (
                <div key={st.n} className="lift relative rounded-3xl bg-ivory p-7 ring-1 ring-gold-200/70">
                  <span className="font-display text-5xl font-bold text-gold-200">{st.n}</span>
                  <h3 className="mt-2 font-display text-xl font-bold text-ink">{st.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{st.text}</p>
                  {i < STEPS.length - 1 && <span className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-2xl text-gold-400 md:block">→</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ TEMPLATE ROWS ═══════════════ */}
        {CATEGORIES.map((c, i) => (
          <section key={c.slug} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="reveal mb-5 flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {c.emoji} {c.plural}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">{c.description}</p>
              </div>
              <Link href={`/templates?category=${c.slug}`} className="shrink-0 text-sm font-semibold text-maroon-700 hover:underline">
                <T k="seeAll" />
              </Link>
            </div>
            <div className="reveal-stagger grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {perCategory[i].map((t) => (
                <TemplateCard key={t.slug} t={t} />
              ))}
            </div>
          </section>
        ))}

        {/* ═══════════════ STORY INVITE SHOWCASE ═══════════════ */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="reveal-scale relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 px-6 py-12 text-white ring-1 ring-gold-500/40 sm:px-12 sm:py-16">
            <Petals count={10} />
            <div className="glow-pulse pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="font-script text-3xl text-gold-300">New</p>
                <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
                  Haldi → Mehendi → Sangeet → Shaadi → Reception.<br />
                  <span className="text-gold-shimmer">One invite. One video.</span>
                </h2>
                <p className="mt-4 max-w-lg text-maroon-100/90">
                  Fill the details once and get a page for every function — in your language. Choose a video style
                  (Royal, Festive, Romantic…), preview it live and share the MP4 on WhatsApp.
                </p>
                <Link href="/story" className="btn-shine mt-6 inline-block rounded-full bg-gold-400 px-7 py-3 font-bold text-maroon-900 shadow-[var(--shadow-gold)] transition hover:bg-gold-300">
                  🎬 Create a Story Invite
                </Link>
              </div>
              <div className="flex justify-center gap-3">
                {["💛 Haldi", "🌿 Mehendi", "🎶 Sangeet", "✨ Shaadi", "🥂 Reception"].map((ev, k) => (
                  <div
                    key={ev}
                    className="w-20 rounded-xl bg-white/10 px-2 py-6 text-center text-xs font-semibold text-gold-100 ring-1 ring-gold-400/40 backdrop-blur sm:w-24"
                    style={{ transform: `translateY(${Math.abs(k - 2) * 10}px) rotate(${(k - 2) * 4}deg)` }}
                  >
                    <span className="block text-2xl">{ev.split(" ")[0]}</span>
                    <span className="mt-2 block">{ev.split(" ")[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="reveal text-center">
            <p className="font-script text-3xl text-gold-600">Everything included</p>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Everything you need to make it yours</h2>
            <div className="orn-line mx-auto mt-5 w-48" />
          </div>
          <div className="reveal-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="lift group rounded-3xl bg-white p-6 ring-1 ring-gold-200/60">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-maroon-700 to-maroon-900 text-xl text-gold-200 shadow-[var(--shadow-maroon)] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ SEO COPY ═══════════════ */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <h2 className="reveal font-display text-xl font-bold tracking-tight text-ink sm:text-3xl">
            India&apos;s easiest invitation card maker — marriage, baby shower &amp; birthday cards
          </h2>
          <div className="reveal mt-4 grid gap-6 text-sm leading-relaxed text-ink-soft md:grid-cols-2">
            <p>
              <b className="text-ink">Marriage card design in minutes.</b> Choose a royal maroon shubh vivah
              card, a mehendi &amp; haldi invite or a modern minimal wedding card. Add the couple&apos;s names in
              beautiful script or Hindi fonts, set the muhurat, venue and RSVP details, and download a print-ready
              e-invite for WhatsApp.
            </p>
            <p>
              <b className="text-ink">Baby shower &amp; godh bharai invitations.</b> From “It&apos;s a girl”
              reveals and little prince themes to traditional godh bharai ceremony cards with Hindi text — everything
              is editable, including photo collages.
            </p>
            <p>
              <b className="text-ink">Birthday invitation card with photo.</b> Use our Canva-style photo collage
              templates, film strips and polaroid frames. Click any empty frame to add your photo — it takes less
              than two minutes.
            </p>
            <p>
              <b className="text-ink">Download anywhere.</b> Export HD PNG or JPG for WhatsApp status,
              Instagram and Facebook, or save a PDF for the print shop. No watermark, no signup required.
            </p>
          </div>
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 className="reveal font-display text-xl font-bold tracking-tight text-ink sm:text-3xl">Frequently asked questions</h2>
          <div className="reveal-stagger mt-5 divide-y divide-gold-100 overflow-hidden rounded-3xl bg-white ring-1 ring-gold-200/60">
            {[
              ["Is this invitation card maker really free?", "Yes. Every template and every editing tool is free, and downloads have no watermark."],
              ["Can I add my own photo to the card?", "Yes. Use a photo collage template, click an empty frame and upload your photo, or use the Photos tab."],
              ["Can I write in Hindi?", "Yes. The Text tab has Hindi fonts like Yatra One, Rozha One and Tiro Devanagari for shubh vivah and godh bharai cards."],
              ["What size should I use for WhatsApp?", "Card Portrait (700×1000) or WhatsApp/Story (720×1280) works best. Download as JPG for a smaller file."],
              ["Do I need to create an account?", "No. Your designs are saved automatically on your device under My designs."],
            ].map(([q, a]) => (
              <details key={q} className="group p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:hidden">
                  <span className="mr-2 inline-block text-gold-600 transition group-open:rotate-90">▸</span>
                  {q}
                </summary>
                <p className="mt-2 pl-6 text-sm text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
          <div className="reveal-scale relative overflow-hidden rounded-[2rem] bg-ivory-dark px-5 py-10 text-center ring-1 ring-gold-300/60 sm:px-8 sm:py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,0.25),transparent_60%)]" />
            <div className="relative">
              <p className="font-script text-3xl text-gold-600">Start from scratch</p>
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Want to design your own?</h2>
              <p className="mx-auto mt-2 max-w-xl text-ink-soft">
                Open a blank canvas, add text, art and photos — then publish it as a template.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((c) => (
                  <BlankDesignButton
                    key={c.slug}
                    category={c.slug}
                    className="btn-shine rounded-full bg-maroon-700 px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-maroon)] transition hover:bg-maroon-600"
                  >
                    {c.emoji} Blank {c.name}
                  </BlankDesignButton>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
