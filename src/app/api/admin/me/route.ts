import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** GET → { admin: boolean } — lets client components show admin-only controls. */
export async function GET() {
  return Response.json({ admin: await isAdmin() });
}
