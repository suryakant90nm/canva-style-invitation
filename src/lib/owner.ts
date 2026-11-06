"use client";

import { useEffect, useState } from "react";
import { saveLocalDesign, type LocalDesign } from "./local-designs";

const KEY = "cardcanvas-owner";

export function getOwnerId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, "");
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

export function useOwnerId(): string {
  const [id, setId] = useState("");
  useEffect(() => {
    setId(getOwnerId());
  }, []);
  return id;
}

/**
 * Create a design on the server AND mirror it in localStorage, so the editor
 * can always open it even if the server instance that created it is gone
 * (serverless without a database).
 */
export async function createDesign(opts: {
  templateSlug?: string;
  category?: string;
  width?: number;
  height?: number;
  title?: string;
}): Promise<string> {
  const res = await fetch("/api/designs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerId: getOwnerId(), ...opts }),
  });
  if (!res.ok) throw new Error("Could not create design");
  const j = (await res.json()) as { design: LocalDesign };
  try {
    saveLocalDesign({
      ...j.design,
      createdAt: String(j.design.createdAt ?? new Date().toISOString()),
      updatedAt: String(j.design.updatedAt ?? new Date().toISOString()),
    });
  } catch {
    /* localStorage unavailable — server copy still exists */
  }
  return j.design.id;
}
