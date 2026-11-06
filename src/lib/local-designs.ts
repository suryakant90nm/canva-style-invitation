"use client";

import type { Doc } from "./design";

/**
 * Browser-side design store.
 *
 * Why: without DATABASE_URL the server keeps designs only in process memory.
 * On serverless hosts (Vercel) every request may hit a different instance, so a
 * design created on one instance can be "not found" on the next. Mirroring
 * designs in localStorage makes the editor and "My designs" work reliably with
 * zero configuration. When a database IS configured the server copy wins; this
 * is only a safety net.
 */

export type LocalDesign = {
  id: string;
  ownerId: string;
  title: string;
  category: string;
  width: number;
  height: number;
  data: Doc;
  templateId: number | null;
  createdAt: string;
  updatedAt: string;
};

const KEY = "shubh-designs-v1";
const MAX = 40; // keep the most recent 40 designs (~localStorage budget)

function readAll(): Record<string, LocalDesign> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}") as Record<string, LocalDesign>;
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, LocalDesign>) {
  if (typeof window === "undefined") return;
  // trim oldest if over budget
  const entries = Object.values(map).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, MAX);
  const next: Record<string, LocalDesign> = {};
  for (const e of entries) next[e.id] = e;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // quota exceeded → drop half and retry once
    const half = entries.slice(0, Math.ceil(entries.length / 2));
    const small: Record<string, LocalDesign> = {};
    for (const e of half) small[e.id] = e;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(small));
    } catch {
      /* give up silently */
    }
  }
}

export function saveLocalDesign(d: LocalDesign) {
  const map = readAll();
  map[d.id] = { ...d, updatedAt: new Date().toISOString() };
  writeAll(map);
}

export function getLocalDesign(id: string): LocalDesign | null {
  return readAll()[id] ?? null;
}

export function patchLocalDesign(id: string, patch: Partial<Pick<LocalDesign, "title" | "category" | "data">>) {
  const map = readAll();
  const cur = map[id];
  if (!cur) return;
  const data = patch.data ?? cur.data;
  map[id] = {
    ...cur,
    ...patch,
    data,
    width: data.width,
    height: data.height,
    updatedAt: new Date().toISOString(),
  };
  writeAll(map);
}

export function deleteLocalDesign(id: string) {
  const map = readAll();
  delete map[id];
  writeAll(map);
}

export function listLocalDesigns(ownerId: string): LocalDesign[] {
  return Object.values(readAll())
    .filter((d) => d.ownerId === ownerId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
