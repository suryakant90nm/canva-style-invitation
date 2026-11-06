import { NextRequest } from "next/server";
import { deleteDesign, getDesign, restoreDesign, updateDesign } from "@/lib/data";
import type { Doc } from "@/lib/design";

export const dynamic = "force-dynamic";

const isUuid = (s: string) => /^[0-9a-f-]{6,40}$/i.test(s);

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return Response.json({ error: "not found" }, { status: 404 });
  const row = await getDesign(id);
  if (!row) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ design: row });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return Response.json({ error: "not found" }, { status: 404 });
  const body = (await req.json().catch(() => null)) as {
    title?: string;
    data?: Doc;
    category?: string;
    ownerId?: string;
    restore?: boolean;
  } | null;
  if (!body) return Response.json({ error: "invalid body" }, { status: 400 });
  if (body.data && !Array.isArray(body.data.elements)) {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }
  let ok = await updateDesign(id, {
    title: typeof body.title === "string" ? body.title : undefined,
    category: typeof body.category === "string" ? body.category : undefined,
    data: body.data,
  });
  // Serverless without a database: the instance that created the design may be
  // gone. If the browser sends the full doc, re-create it here instead of 404.
  if (!ok && body.data) {
    await restoreDesign({
      id,
      ownerId: body.ownerId || "anonymous",
      title: body.title || "Untitled design",
      category: body.category || "invitation",
      data: body.data,
    });
    ok = true;
  }
  if (!ok) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ ok: true, restored: !!body.restore });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return Response.json({ error: "not found" }, { status: 404 });
  await deleteDesign(id);
  return Response.json({ ok: true });
}
