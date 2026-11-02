import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/** Hosts we are willing to proxy images from (prevents SSRF). */
const ALLOWED = [
  "images.pexels.com",
  "images.unsplash.com",
  "upload.wikimedia.org",
  "thumb.wikimedia.org",
  "api.openverse.org",
  "commons.wikimedia.org",
  "picsum.photos",
  "fastly.picsum.photos",
];

/**
 * Same-origin image proxy. Photos are streamed through here so the editor canvas
 * stays untainted and high-quality PNG/JPG export always works.
 */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("u");
  if (!raw) return new Response("missing u", { status: 400 });
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (url.protocol !== "https:" || !ALLOWED.includes(url.hostname)) {
    return new Response("host not allowed", { status: 403 });
  }
  try {
    const upstream = await fetch(url.toString(), {
      headers: { "User-Agent": "ShubhInvite/1.0 (card designer; contact: hello@shubhinvite.com)" },
    });
    if (!upstream.ok || !upstream.body) return new Response("upstream error", { status: 502 });
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new Response("fetch failed", { status: 502 });
  }
}
