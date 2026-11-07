import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { adminStats } from "@/lib/data";
import { getSiteConfig, setSiteConfig, type SiteConfig } from "@/lib/admin-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const [stats, site] = await Promise.all([adminStats(), getSiteConfig()]);
  return Response.json({ stats, site });
}

/** PATCH site config { announcement?, maintenance? } */
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as SiteConfig | null;
  if (!body) return Response.json({ error: "invalid" }, { status: 400 });
  const patch: SiteConfig = {};
  if (typeof body.announcement === "string") patch.announcement = body.announcement.slice(0, 200);
  if (typeof body.maintenance === "boolean") patch.maintenance = body.maintenance;
  const site = await setSiteConfig(patch);
  return Response.json({ ok: true, site });
}
