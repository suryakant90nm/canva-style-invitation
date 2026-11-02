import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

/**
 * The app is designed to run WITHOUT a database too (templates are bundled in
 * code), so a missing DATABASE_URL must not throw at import time — that would
 * take down every route on a fresh deploy. Instead we export a null client and
 * the data layer falls back to the bundled/memory store.
 */
export const hasDatabase = Boolean(databaseUrl);

export const pool: Pool | null = databaseUrl
  ? (globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
      // keep failures fast so pages fall back instead of hanging
      connectionTimeoutMillis: 5000,
      max: 10,
    }))
  : null;

if (pool) globalForDb.__arenaNextJsPostgresqlPool = pool;

export const db = (pool ? drizzle(pool) : null) as ReturnType<typeof drizzle> | null;
