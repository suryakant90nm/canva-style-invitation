import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";
export { Logo };
import { CreateMenu } from "./StartButtons";
import LanguageSwitcher from "./LanguageSwitcher";
import MegaMenu from "./MegaMenu";
import AdminLink from "./AdminLink";
import { listTemplates } from "@/lib/data";
import { T } from "./T";

export async function Header() {
  // light-weight counts for the mega menu (no heavy data, just slugs/titles)
  let thumbs: Record<string, { slug: string; title: string }[]> = {};
  try {
    const rows = await listTemplates({ limit: 500 });
    thumbs = rows.reduce<Record<string, { slug: string; title: string }[]>>((acc, t) => {
      (acc[t.category] ??= []).push({ slug: t.slug, title: t.title });
      return acc;
    }, {});
  } catch {
    thumbs = {};
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gold-200/60 bg-ivory/90 shadow-[0_1px_0_rgba(201,168,76,0.15)] backdrop-blur-md">
      <div className="relative mx-auto flex h-14 w-full max-w-[1400px] items-center gap-2 px-3 sm:h-[68px] sm:gap-3 sm:px-6 lg:gap-4">
        <Logo />
        <MegaMenu templateThumbs={thumbs} />
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
          <AdminLink />
          <LanguageSwitcher compact />
          <Link
            href="/my-designs"
            className="hidden whitespace-nowrap text-[15px] font-medium text-ink-soft transition hover:text-maroon-700 2xl:block"
          >
            <T k="myDesigns" />
          </Link>
          <CreateMenu />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-maroon-900 text-maroon-100">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-maroon-500/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-3">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-maroon-200/80">
            Design beautiful invitation, marriage, baby shower and birthday cards in minutes. Pick a template, add
            your name &amp; photos, download in HD or share on WhatsApp.
          </p>
          <p className="mt-4 text-xs text-maroon-300/70">
            Popular searches: shubh vivah card · shadi card design · baby shower invitation · godh bharai card ·
            birthday invitation card maker with name and photo
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-gold-300">Categories</p>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/templates?category=${c.slug}`} className="transition hover:text-gold-200">
                  {c.plural}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-gold-500/20 py-5 text-center text-xs text-maroon-300/70">
        © {new Date().getFullYear()} {SITE.name} · Made with ♥ for every celebration
      </div>
    </footer>
  );
}
