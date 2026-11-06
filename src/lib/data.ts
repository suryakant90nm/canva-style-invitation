import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { designs, templates } from "@/db/schema";
import { SEED_TEMPLATES } from "./templates";
import { BUILTIN, builtinBySlug, community, designStore, newId, type StoreTemplate } from "./memory-store";
import type { Doc } from "./design";
import { db as dbClient } from "@/db";

/**
 * Data layer with an automatic fallback.
 *
 * - If DATABASE_URL is configured and reachable → real PostgreSQL (persistent).
 * - Otherwise → the same templates come straight from code, and saved
 *   designs/community templates live in process memory.
 *
 * This means a fresh Vercel deploy shows all 67 templates immediately, with
 * zero configuration, and switches to PostgreSQL as soon as DATABASE_URL exists.
 */

let checked = false;
let useDb = false;
let lastCheck = 0;

/** Call only after dbAvailable() returned true — db client is guaranteed present. */
const d = () => dbClient!;

async function dbAvailable(): Promise<boolean> {
  if (checked && Date.now() - lastCheck < 30_000) return useDb;
  if (!process.env.DATABASE_URL) {
    useDb = false;
    checked = true;
    lastCheck = Date.now();
    return false;
  }
  try {
    await d().execute(sql`select 1`);
    useDb = true;
  } catch {
    useDb = false;
  }
  checked = true;
  lastCheck = Date.now();
  return useDb;
}

let inFlight: Promise<void> | null = null;

/** Insert the built-in templates (upsert, so edits propagate on redeploy). */
export async function ensureSeeded(): Promise<void> {
  if (!(await dbAvailable())) return;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    const [row] = await d().select({ n: sql<number>`count(*)::int` }).from(templates).where(eq(templates.source, "system"));
    if ((row?.n ?? 0) >= SEED_TEMPLATES.length) return;
    for (const t of SEED_TEMPLATES) {
      await d()
        .insert(templates)
        .values({
          slug: t.slug,
          title: t.title,
          category: t.category,
          tags: t.tags,
          width: t.doc.width,
          height: t.doc.height,
          data: t.doc,
          source: "system",
          featured: !!t.featured,
        })
        .onConflictDoUpdate({
          target: templates.slug,
          set: {
            title: t.title,
            category: t.category,
            tags: t.tags,
            width: t.doc.width,
            height: t.doc.height,
            data: t.doc,
            featured: !!t.featured,
          },
        });
    }
  })().catch((e) => {
    inFlight = null;
    throw e;
  });
  return inFlight;
}

export type TemplateQuery = {
  category?: string;
  q?: string;
  tag?: string;
  featured?: boolean;
  source?: string;
  sort?: string;
  limit?: number;
};

const NO_DB_ORDER = (sort?: string) => (a: StoreTemplate, b: StoreTemplate) => {
  if (sort === "new") return b.createdAt.getTime() - a.createdAt.getTime();
  if (sort === "popular") return b.uses - a.uses || b.id - a.id;
  return Number(b.featured) - Number(a.featured) || b.uses - a.uses || a.id - b.id;
};

function memoryQuery(query: TemplateQuery): StoreTemplate[] {
  const all = [...BUILTIN, ...Array.from(community.values())];
  let out = all;
  if (query.category) out = out.filter((t) => t.category === query.category);
  if (query.source) out = out.filter((t) => t.source === query.source);
  if (query.featured) out = out.filter((t) => t.featured);
  if (query.tag) out = out.filter((t) => t.tags.includes(query.tag!));
  if (query.q) {
    const q = query.q.toLowerCase();
    out = out.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  return out.sort(NO_DB_ORDER(query.sort)).slice(0, query.limit ?? 100);
}

export async function listTemplates(query: TemplateQuery = {}): Promise<StoreTemplate[]> {
  if (!(await dbAvailable())) return memoryQuery(query);
  try {
    await ensureSeeded();
    const conds = [];
    if (query.category) conds.push(eq(templates.category, query.category));
    if (query.source) conds.push(eq(templates.source, query.source));
    if (query.featured) conds.push(eq(templates.featured, true));
    if (query.tag) conds.push(sql`${query.tag} = any(${templates.tags})`);
    if (query.q) {
      const like = `%${query.q}%`;
      conds.push(
        or(
          ilike(templates.title, like),
          ilike(templates.category, like),
          sql`exists (select 1 from unnest(${templates.tags}) t where t ilike ${like})`,
        ),
      );
    }
    const order =
      query.sort === "popular"
        ? [desc(templates.uses), desc(templates.id)]
        : query.sort === "new"
          ? [desc(templates.createdAt), desc(templates.id)]
          : [desc(templates.featured), desc(templates.uses), templates.id];
    const rows = await d()
      .select()
      .from(templates)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(...order)
      .limit(query.limit ?? 100);
    return rows as StoreTemplate[];
  } catch {
    // database hiccup → degrade gracefully instead of showing an empty page
    return memoryQuery(query);
  }
}

export async function getTemplate(slug: string): Promise<StoreTemplate | undefined> {
  if (!(await dbAvailable())) return builtinBySlug.get(slug) ?? community.get(slug);
  try {
    await ensureSeeded();
    const [row] = await d().select().from(templates).where(eq(templates.slug, slug)).limit(1);
    return (row as StoreTemplate) ?? builtinBySlug.get(slug) ?? community.get(slug);
  } catch {
    return builtinBySlug.get(slug) ?? community.get(slug);
  }
}

export async function createTemplate(input: {
  title: string;
  category: string;
  tags: string[];
  data: Doc;
}): Promise<StoreTemplate> {
  if (!(await dbAvailable())) {
    const row: StoreTemplate = {
      id: nextMemId(),
      slug: `${slugify(input.title)}-${Math.random().toString(36).slice(2, 7)}`,
      title: input.title,
      category: input.category,
      tags: input.tags,
      width: input.data.width,
      height: input.data.height,
      data: input.data,
      source: "community",
      featured: false,
      uses: 0,
      createdAt: new Date(),
    };
    community.set(row.slug, row as never);
    return row;
  }
  const slug = `${slugify(input.title)}-${Math.random().toString(36).slice(2, 7)}`;
  const [row] = await d()
    .insert(templates)
    .values({
      slug,
      title: input.title,
      category: input.category,
      tags: input.tags,
      width: input.data.width,
      height: input.data.height,
      data: input.data,
      source: "community",
    })
    .returning();
  return row as StoreTemplate;
}

/** Create a design row from a template, or a blank canvas. */
export async function createDesign(input: {
  ownerId: string;
  templateSlug?: string;
  category?: string;
  width?: number;
  height?: number;
  title?: string;
}): Promise<DesignRecord> {
  const title = input.title?.trim() || "Untitled design";
  if (!(await dbAvailable())) {
    let doc: Doc;
    let category = input.category ?? "invitation";
    let templateId: number | null = null;
    if (input.templateSlug) {
      const tpl = await getTemplate(input.templateSlug);
      if (!tpl) throw new Error("template not found");
      doc = structuredClone(tpl.data);
      title || tpl.title;
      category = tpl.category;
      templateId = tpl.id;
      bumpUses(tpl.slug);
    } else {
      const width = clamp(input.width ?? 700);
      const height = clamp(input.height ?? 1000);
      doc = { width, height, background: "#ffffff", elements: [] };
    }
    const id = newId();
    const rec = {
      id,
      ownerId: input.ownerId,
      title: input.templateSlug ? (getTemplateSyncTitle(input.templateSlug) ?? title) : title,
      category,
      width: doc.width,
      height: doc.height,
      data: doc,
      templateId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    designStore.set(id, rec as never);
    return rec as unknown as DesignRecord;
  }
  await ensureSeeded();
  let doc: Doc;
  let finalTitle = title;
  let category = input.category ?? "invitation";
  let templateId: number | null = null;

  if (input.templateSlug) {
    const tpl = await getTemplate(input.templateSlug);
    if (!tpl) throw new Error("template not found");
    doc = structuredClone(tpl.data);
    finalTitle = input.title?.trim() || tpl.title;
    category = tpl.category;
    templateId = tpl.id;
    await d()
      .update(templates)
      .set({ uses: sql`${templates.uses} + 1` })
      .where(eq(templates.slug, input.templateSlug));
  } else {
    const width = clamp(input.width ?? 700);
    const height = clamp(input.height ?? 1000);
    doc = { width, height, background: "#ffffff", elements: [] };
  }

  const [row] = await d()
    .insert(designs)
    .values({ ownerId: input.ownerId, title: finalTitle, category, width: doc.width, height: doc.height, data: doc, templateId })
    .returning();
  return row as unknown as DesignRecord;
}

export type DesignRecord = {
  id: string;
  ownerId: string;
  title: string;
  category: string;
  width: number;
  height: number;
  data: Doc;
  templateId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function listDesigns(ownerId: string): Promise<DesignRecord[]> {
  if (!(await dbAvailable())) {
    return Array.from(designStore.values())
      .filter((d) => d.ownerId === ownerId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()) as unknown as DesignRecord[];
  }
  const rows = await d().select().from(designs).where(eq(designs.ownerId, ownerId)).orderBy(desc(designs.updatedAt)).limit(100);
  return rows as unknown as DesignRecord[];
}

const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function getDesign(id: string): Promise<DesignRecord | null> {
  const mem = designStore.get(id) as unknown as DesignRecord | undefined;
  if (!(await dbAvailable()) || !isUuid(id)) return mem ?? null;
  try {
    const [row] = await d().select().from(designs).where(eq(designs.id, id)).limit(1);
    return (row as unknown as DesignRecord) ?? mem ?? null;
  } catch {
    return mem ?? null;
  }
}

export async function updateDesign(
  id: string,
  patch: { title?: string; category?: string; data?: Doc },
): Promise<boolean> {
  if (!(await dbAvailable()) || !isUuid(id)) {
    const rec = designStore.get(id);
    if (!rec) return false;
    if (typeof patch.title === "string") rec.title = patch.title.slice(0, 120) || "Untitled design";
    if (typeof patch.category === "string") rec.category = patch.category;
    if (patch.data) {
      rec.data = patch.data;
      rec.width = patch.data.width;
      rec.height = patch.data.height;
    }
    rec.updatedAt = new Date();
    return true;
  }
  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof patch.title === "string") values.title = patch.title.slice(0, 120) || "Untitled design";
  if (typeof patch.category === "string") values.category = patch.category;
  if (patch.data) {
    values.data = patch.data;
    values.width = patch.data.width;
    values.height = patch.data.height;
  }
  const rows = await d().update(designs).set(values).where(eq(designs.id, id)).returning({ id: designs.id });
  return rows.length > 0;
}

/** Re-create a design the browser still has but the server lost (serverless memory). */
export async function restoreDesign(input: {
  id: string;
  ownerId: string;
  title: string;
  category: string;
  data: Doc;
}): Promise<void> {
  const rec = {
    id: input.id,
    ownerId: input.ownerId,
    title: input.title || "Untitled design",
    category: input.category || "invitation",
    width: input.data.width,
    height: input.data.height,
    data: input.data,
    templateId: null as number | null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  if (!(await dbAvailable())) {
    designStore.set(input.id, rec as never);
    return;
  }
  // with a database the id must be a uuid; memory ids are 32-hex → only insert if valid
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.id)) {
    designStore.set(input.id, rec as never);
    return;
  }
  try {
    await d()
      .insert(designs)
      .values({ id: input.id, ownerId: rec.ownerId, title: rec.title, category: rec.category, width: rec.width, height: rec.height, data: rec.data })
      .onConflictDoNothing();
  } catch {
    designStore.set(input.id, rec as never);
  }
}

export async function deleteDesign(id: string): Promise<void> {
  if (!(await dbAvailable())) {
    designStore.delete(id);
    return;
  }
  await d().delete(designs).where(eq(designs.id, id));
}

/* ── small helpers ── */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "template";
const clamp = (n: number) => Math.min(4000, Math.max(100, Math.round(n)));
let memCounter = 10_000;
const nextMemId = () => ++memCounter;
function bumpUses(slug: string) {
  const t = builtinBySlug.get(slug) ?? community.get(slug);
  if (t) t.uses += 1;
}
function getTemplateSyncTitle(slug: string) {
  return builtinBySlug.get(slug)?.title ?? community.get(slug)?.title;
}
