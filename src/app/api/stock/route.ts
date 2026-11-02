import { NextRequest } from "next/server";
import { searchCurated } from "@/lib/curated-photos";

export const dynamic = "force-dynamic";

type Photo = { id: string; thumb: string; full: string; credit: string; source: string };

const proxy = (u: string) => `/api/img?u=${encodeURIComponent(u)}`;

const port = (n: number, w: number, h: number) => `https://picsum.photos/seed/${n}/${w}/${h}`;

/** Curated celebration library – keyword matched, always available, no API key. */
function fromCurated(q: string): Photo[] {
  return searchCurated(q, 30).map((p) => ({
    id: `cu-${p.id}`,
    thumb: proxy(p.thumb),
    full: proxy(p.full),
    credit: p.credit,
    source: "curated",
  }));
}

const isImage = (u: string) => /\.(jpe?g|png)(\?|#|$)/i.test(u);
const clean = (u: string) => u.split(/[?#]/)[0];

/** Words that usually mean old artwork rather than a usable photo. */
const ART_NOISE = ["-painting", "-drawing", "-sketch", "-engraving", "-lithograph", "-poster", "-logo", "-map", "-statue"];

/** Wikimedia Commons – free, no API key, huge library, safe for commercial use. */
async function fromCommons(q: string): Promise<Photo[]> {
  const search = `${q} filetype:bitmap ${ART_NOISE.join(" ")}`;
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
    `&gsrsearch=${encodeURIComponent(search)}&gsrlimit=40&gsrnamespace=6` +
    "&prop=imageinfo&iiprop=url%7Cuser%7Csize&iiurlwidth=1200";
  const r = await fetch(url, {
    headers: { "User-Agent": "ShubhInvite/1.0 (card designer)" },
    next: { revalidate: 3600 },
  });
  if (!r.ok) throw new Error(`Commons ${r.status}`);
  const j = (await r.json()) as {
    query?: {
      pages?: Record<
        string,
        {
          title: string;
          imageinfo?: { thumburl?: string; url?: string; user?: string; width?: number; height?: number }[];
        }
      >;
    };
  };
  const pages = Object.values(j.query?.pages ?? {});
  const out: Photo[] = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    const full = info?.thumburl ?? info?.url;
    // drop tiny images, icons and extreme aspect ratios
    const aspect = info?.width && info?.height ? info.width / info.height : 1;
    if (!full || !isImage(full)) continue;
    if ((info?.width ?? 0) < 600 || aspect < 0.35 || aspect > 3) continue;
    out.push({
      id: `wc-${p.title}`,
      thumb: proxy(clean(full)),
      full: proxy(clean(full)),
      credit: `${(info?.user ?? "Wikimedia").replace(/ /g, "")} / Wikimedia Commons`,
      source: "commons",
    });
  }
  return out.slice(0, 24);
}

/** Openverse – free, no API key (anonymous, rate limited). */
async function fromOpenverse(q: string): Promise<Photo[]> {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=24&license_type=commercial&mature=false`;
  const r = await fetch(url, { headers: { "User-Agent": "ShubhInvite/1.0" }, next: { revalidate: 3600 } });
  if (!r.ok) throw new Error(`Openverse ${r.status}`);
  const j = (await r.json()) as {
    results?: { id: string; url: string; thumbnail?: string; creator?: string; source?: string }[];
  };
  return (j.results ?? [])
    .filter((p) => p.url && /\.(jpe?g|png)(\?|$)/i.test(p.url))
    .slice(0, 24)
    .map((p) => ({
      id: `ov-${p.id}`,
      thumb: proxy(p.thumbnail && /\.(jpe?g|png)(\?|$)/i.test(p.thumbnail) ? p.thumbnail : p.url),
      full: proxy(p.url),
      credit: `${p.creator ?? "Openverse"} / ${p.source ?? "Openverse"}`,
      source: "openverse",
    }));
}

async function fromPexels(q: string, key: string): Promise<Photo[]> {
  const r = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=24&orientation=portrait`,
    { headers: { Authorization: key }, next: { revalidate: 3600 } },
  );
  if (!r.ok) throw new Error(`Pexels ${r.status}`);
  const j = (await r.json()) as { photos?: { id: number; photographer: string; src: { medium: string; large: string } }[] };
  return (j.photos ?? []).map((p) => ({
    id: `px-${p.id}`,
    thumb: proxy(p.src.medium),
    full: proxy(p.src.large),
    credit: `${p.photographer} / Pexels`,
    source: "pexels",
  }));
}

async function fromUnsplash(q: string, key: string): Promise<Photo[]> {
  const r = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=24&client_id=${key}`,
    { next: { revalidate: 3600 } },
  );
  if (!r.ok) throw new Error(`Unsplash ${r.status}`);
  const j = (await r.json()) as { results?: { id: string; user: { name: string }; urls: { small: string; regular: string } }[] };
  return (j.results ?? []).map((p) => ({
    id: `us-${p.id}`,
    thumb: proxy(p.urls.small),
    full: proxy(p.urls.regular),
    credit: `${p.user.name} / Unsplash`,
    source: "unsplash",
  }));
}

/**
 * GET /api/stock?q=wedding+flowers
 * Tries premium providers (if an API key is configured), then falls back to
 * key-free open libraries so the editor always has photos available.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "wedding flowers";
  const pexels = process.env.PEXELS_API_KEY;
  const unsplash = process.env.UNSPLASH_ACCESS_KEY;
  const errors: string[] = [];

  const attempts: { name: string; run: () => Promise<Photo[]> }[] = [];
  if (pexels) attempts.push({ name: "pexels", run: () => fromPexels(q, pexels) });
  if (unsplash) attempts.push({ name: "unsplash", run: () => fromUnsplash(q, unsplash) });
  attempts.push({ name: "curated", run: async () => fromCurated(q) });
  attempts.push({ name: "commons", run: () => fromCommons(q) });
  attempts.push({ name: "openverse", run: () => fromOpenverse(q) });

  for (const a of attempts) {
    try {
      const photos = await a.run();
      if (photos.length) {
        return Response.json({
          photos,
          provider: a.name,
          premium: a.name === "pexels" || a.name === "unsplash",
        });
      }
      errors.push(`${a.name}: empty`);
    } catch (e) {
      errors.push(`${a.name}: ${(e as Error).message}`);
    }
  }

  // final fallback – generic celebration photos so the panel is never empty
  const photos: Photo[] = searchCurated("", 24).map((p) => ({
    id: `cu-${p.id}`,
    thumb: proxy(p.thumb),
    full: proxy(p.full),
    credit: p.credit,
    source: "curated",
  }));
  return Response.json({ photos, provider: "curated", premium: false, errors });
}
