import { NextRequest } from "next/server";
import { createTemplate, listTemplates } from "@/lib/data";
import { getCategory } from "@/lib/categories";
import type { Doc } from "@/lib/design";

export const dynamic = "force-dynamic";

/** Public template API: GET /api/templates?category=wedding&tag=Hindu&q=gold&sort=popular */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const rows = await listTemplates({
    category: sp.get("category") || undefined,
    tag: sp.get("tag") || undefined,
    q: sp.get("q")?.trim() || undefined,
    sort: sp.get("sort") || undefined,
    source: sp.get("source") || undefined,
    featured: sp.get("featured") === "1",
    limit: Number(sp.get("limit")) || 100,
  });
  return Response.json({ templates: rows });
}

/** Publish a user-made design as a reusable template. */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    title?: string;
    category?: string;
    tags?: string[];
    data?: Doc;
  } | null;
  if (!body?.data || !Array.isArray(body.data.elements) || !body.title?.trim()) {
    return Response.json({ error: "title and data are required" }, { status: 400 });
  }
  if (JSON.stringify(body.data).length > 4_000_000) {
    return Response.json({ error: "Design too large to publish" }, { status: 413 });
  }
  const category = getCategory(body.category ?? "") ? body.category! : "invitation";
  try {
    const row = await createTemplate({
      title: body.title.trim().slice(0, 80),
      category,
      tags: (body.tags ?? []).map((t) => String(t).trim()).filter(Boolean).slice(0, 6),
      data: body.data,
    });
    return Response.json({ template: row }, { status: 201 });
  } catch {
    return Response.json({ error: "Could not publish right now" }, { status: 500 });
  }
}
