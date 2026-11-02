import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { CreateMenu } from "./StartButtons";
import LanguageSwitcher from "./LanguageSwitcher";
import MegaMenu from "./MegaMenu";
import { listTemplates } from "@/lib/data";
import { T } from "./T";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg text-white shadow-md">
        ✉
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
        Shubh<span className="text-fuchsia-500">Invite</span>
      </span>
    </Link>
  );
}

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
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex h-[68px] w-full max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-6">
        <Logo />
        <MegaMenu templateThumbs={thumbs} />
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher compact />
          <Link
            href="/my-designs"
            className="hidden whitespace-nowrap text-[15px] font-medium text-slate-700 hover:text-violet-600 2xl:block"
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
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            Design beautiful invitation, marriage, baby shower and birthday cards in minutes. Pick a template, add
            your name &amp; photos, download in HD or share on WhatsApp.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Popular searches: shubh vivah card · shadi card design · baby shower invitation · godh bharai card ·
            birthday invitation card maker with name and photo
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Categories</p>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/templates?category=${c.slug}`} className="hover:text-white">
                  {c.plural}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Languages</p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            {["Hindi", "Marathi", "Rajasthani", "Punjabi", "Gujarati", "Bengali", "Tamil", "Telugu", "Malayalam", "Kannada", "Odia", "Urdu"].map((l) => (
              <li key={l} className="text-slate-400">{l}</li>
            ))}
          </ul>
          <Link href="/story" className="mt-4 inline-block font-semibold text-amber-300 hover:underline">
            🎬 Make a Story Invite →
          </Link>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Developers</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/api/templates" className="hover:text-white">
                Templates API (JSON)
              </a>
            </li>
            <li>
              <Link href="/my-designs" className="hover:text-white">
                My designs
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {SITE.name} · Made with ♥ for every celebration
      </div>
    </footer>
  );
}
