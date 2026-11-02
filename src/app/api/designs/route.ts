import { NextRequest } from "next/server";
import { createDesign, listDesigns } from "@/lib/data";

export const dynamic = "force-dynamic";

/** List designs of an owner: GET /api/designs?owner=<id> */
export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get("owner");
  if (!owner) return Response.json({ designs: [] });
  const rows = await listDesigns(owner);
  return Response.json({ designs: rows });
}

/** Create a design: from a template (templateSlug), or blank (category,width,height). */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    ownerId?: string;
    templateSlug?: string;
    category?: string;
    width?: number;
    height?: number;
    title?: string;
  } | null;
  if (!body?.ownerId) return Response.json({ error: "ownerId required" }, { status: 400 });
  try {
    const row = await createDesign({
      ownerId: body.ownerId,
      templateSlug: body.templateSlug,
      category: body.category,
      width: body.width,
      height: body.height,
      title: body.title,
    });
    return Response.json({ design: row }, { status: 201 });
  } catch (e) {
    const msg = (e as Error).message === "template not found" ? "template not found" : "Could not create design";
    return Response.json({ error: msg }, { status: msg === "template not found" ? 404 : 500 });
  }
}
