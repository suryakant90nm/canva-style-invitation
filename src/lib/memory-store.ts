import type { Doc } from "./design";
import { SEED_TEMPLATES } from "./templates";

export type StoreTemplate = {
  id: number;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  width: number;
  height: number;
  data: Doc;
  source: string;
  featured: boolean;
  uses: number;
  createdAt: Date;
};

let counter = 0;
const nextId = () => ++counter;

/** Built-in templates served straight from code — no database needed. */
export const BUILTIN: StoreTemplate[] = SEED_TEMPLATES.map((t) => ({
  id: nextId(),
  slug: t.slug,
  title: t.title,
  category: t.category,
  tags: [...t.tags],
  width: t.doc.width,
  height: t.doc.height,
  data: t.doc,
  source: "system",
  featured: !!t.featured,
  uses: 0,
  createdAt: new Date(),
}));

export const builtinBySlug = new Map(BUILTIN.map((t) => [t.slug, t]));

/**
 * Community templates + saved designs. When DATABASE_URL is missing (or the
 * database is unreachable) these live in process memory so the site still works
 * for demos. They reset on cold start, which is fine for a preview.
 */
type Stored = StoreTemplate & { ownerId: string };

const globalStore = globalThis as typeof globalThis & {
  __shubhCommunity?: Map<string, Stored>;
  __shubhDesigns?: Map<string, Stored & { title: string; updatedAt: Date; templateId: number | null }>;
};

export const community: Map<string, Stored> = (globalStore.__shubhCommunity ??= new Map());
export const designStore: Map<string, Stored & { title: string; updatedAt: Date; templateId: number | null }> =
  (globalStore.__shubhDesigns ??= new Map());

export const newId = () =>
  (crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "");
