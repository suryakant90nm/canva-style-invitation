import { NextRequest } from "next/server";
import { sql } from "drizzle-orm";
import { db as dbClient } from "@/db";
import { listTemplates } from "@/lib/data";

export const dynamic = "force-dynamic";

/**
 * Health probe.
 * ok=true  → app is up. db reports whether PostgreSQL is attached.
 * The app works fully without a database (templates come from code), so
 * `ok` stays true either way.
 */
export async function GET() {
  let dbUp = false;
  try {
    if (process.env.DATABASE_URL) {
      await dbClient!.execute(sql`select 1`);
      dbUp = true;
    }
  } catch {
    dbUp = false;
  }
  let templates = 0;
  try {
    templates = (await listTemplates({ limit: 500 })).length;
  } catch {
    templates = 0;
  }
  return Response.json({ ok: true, db: dbUp, templates });
}
