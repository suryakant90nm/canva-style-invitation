import { eq } from "drizzle-orm";
import { db as dbClient } from "@/db";
import { settings } from "@/db/schema";

/**
 * Admin overrides applied on top of the bundled templates.
 * Stored in the `settings` table when a database exists, else in memory.
 * Keyed by template slug.
 */
export type TemplateOverride = {
  hidden?: boolean;
  featured?: boolean;
  title?: string;
  category?: string;
  tags?: string[];
};

export type SiteConfig = {
  announcement?: string; // banner text shown on home (empty = none)
  maintenance?: boolean; // show maintenance notice on public pages
};

type Store = { overrides: Record<string, TemplateOverride>; site: SiteConfig };

const g = globalThis as typeof globalThis & { __shubhAdmin?: Store };
const mem: Store = (g.__shubhAdmin ??= { overrides: {}, site: {} });

const KEY_OVERRIDES = "template_overrides";
const KEY_SITE = "site_config";

let cacheAt = 0;
async function load(): Promise<Store> {
  if (!dbClient) return mem;
  if (Date.now() - cacheAt < 10_000) return mem;
  try {
    const rows = await dbClient.select().from(settings);
    for (const r of rows) {
      if (r.key === KEY_OVERRIDES) mem.overrides = (r.value as Record<string, TemplateOverride>) ?? {};
      if (r.key === KEY_SITE) mem.site = (r.value as SiteConfig) ?? {};
    }
    cacheAt = Date.now();
  } catch {
    /* table may not exist yet → memory only */
  }
  return mem;
}

async function persist(key: string, value: unknown) {
  if (!dbClient) return;
  try {
    await dbClient
      .insert(settings)
      .values({ key, value: value as object })
      .onConflictDoUpdate({ target: settings.key, set: { value: value as object, updatedAt: new Date() } });
  } catch {
    /* ignore – memory copy still updated */
  }
}

export async function getOverrides(): Promise<Record<string, TemplateOverride>> {
  return (await load()).overrides;
}

export async function setOverride(slug: string, patch: TemplateOverride | null): Promise<void> {
  const st = await load();
  if (patch === null) delete st.overrides[slug];
  else st.overrides[slug] = { ...(st.overrides[slug] ?? {}), ...patch };
  await persist(KEY_OVERRIDES, st.overrides);
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return (await load()).site;
}

export async function setSiteConfig(patch: SiteConfig): Promise<SiteConfig> {
  const st = await load();
  st.site = { ...st.site, ...patch };
  await persist(KEY_SITE, st.site);
  return st.site;
}

/** Remove any unused override keys (e.g. after a template was deleted). */
export async function clearOverride(slug: string) {
  await setOverride(slug, null);
}

void eq;
