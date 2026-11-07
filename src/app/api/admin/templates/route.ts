import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { createTemplate, deleteTemplate, listTemplates, updateTemplate } from "@/lib/data";
import { builtinBySlug } from "@/lib/memory-store";
import { getCategory } from "@/lib/categories";
import type { Doc } from "@/lib/design";
import { setOverride, type TemplateOverride } from "@/lib/admin-store";

export const dynamic = "force-dynamic";

const deny = () => Response.json({ error: "unauthorized" }, { status: 401 });

/** GET → every template incl. hidden, with override flags */
export async function GET() {
  if (!(await isAdmin())) return deny();
  const rows = await listTemplates({ limit: 1000, includeHidden: true });
  return Response.json({
    templates: rows.map((t) => ({
      builtin: builtinBySlug.has(t.slug),
      slug: t.slug,
      title: t.title,
      category: t.category,
      tags: t.tags,
      source: t.source,
      featured: t.featured,
      hidden: !!(t as { hidden?: boolean }).hidden,
      uses: t.uses,
      width: t.width,
      height: t.height,
      data: t.data,
    })),
  });
}

/**
 * POST — create an official template (source "admin") or save over an existing one.
 * { slug?, title, category, tags[], data: Doc, featured? }
 * If `slug` exists → update that template (works for built-ins too: a DB row shadows the code).
 */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return deny();
  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    title?: string;
    category?: string;
    tags?: string[];
    data?: Doc;
    featured?: boolean;
  } | null;
  if (!body?.data || !Array.isArray(body.data.elements)) return Response.json({ error: "data required" }, { status: 400 });
  if (!body.title?.trim()) return Response.json({ error: "title required" }, { status: 400 });
  const category = getCategory(body.category ?? "") ? body.category! : "invitation";
  const tags = (body.tags ?? []).map((t) => String(t).trim()).filter(Boolean).slice(0, 8);
  const title = body.title.trim().slice(0, 80);

  if (body.slug) {
    const row = await updateTemplate(body.slug, { title, category, tags, data: body.data, featured: body.featured });
    if (row) return Response.json({ template: row, updated: true });
  }
  const row = await createTemplate({
    title,
    category,
    tags,
    data: body.data,
    source: "admin",
    featured: !!body.featured,
    slug: body.slug,
  });
  return Response.json({ template: row, created: true }, { status: 201 });
}

/** PATCH { slug, hidden?, featured?, title?, category?, tags? } */
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return deny();
  const body = (await req.json().catch(() => null)) as ({ slug?: string } & TemplateOverride) | null;
  if (!body?.slug) return Response.json({ error: "slug required" }, { status: 400 });
  const { slug, ...patch } = body;
  const clean: TemplateOverride = {};
  if (typeof patch.hidden === "boolean") clean.hidden = patch.hidden;
  if (typeof patch.featured === "boolean") clean.featured = patch.featured;
  if (typeof patch.title === "string" && patch.title.trim()) clean.title = patch.title.trim().slice(0, 80);
  if (typeof patch.category === "string") clean.category = patch.category;
  if (Array.isArray(patch.tags)) clean.tags = patch.tags.map(String).slice(0, 8);
  await setOverride(slug, clean);
  return Response.json({ ok: true });
}

/** DELETE ?slug= → community template only (built-ins: hide instead) */
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return deny();
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return Response.json({ error: "slug required" }, { status: 400 });
  const deleted = await deleteTemplate(slug);
  await setOverride(slug, null);
  // deleted=false → it was a built-in: your edits were discarded and the original design is back
  return Response.json({ ok: true, reverted: !deleted });
}
