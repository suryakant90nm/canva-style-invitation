"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DesignView } from "@/components/DesignView";
import { BlankDesignButton } from "@/components/StartButtons";
import { getOwnerId } from "@/lib/owner";
import { deleteLocalDesign, listLocalDesigns } from "@/lib/local-designs";
import type { Doc } from "@/lib/design";

type Row = { id: string; title: string; category: string; data: Doc; updatedAt: string };

export default function MyDesigns() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    const owner = getOwnerId();
    // merge: server rows (if any) + browser mirror; newest first, de-duplicated by id
    const local = listLocalDesigns(owner) as unknown as Row[];
    fetch(`/api/designs?owner=${owner}`)
      .then((r) => r.json())
      .then((j: { designs: Row[] }) => {
        const map = new Map<string, Row>();
        for (const d of [...(j.designs ?? []), ...local]) {
          const prev = map.get(d.id);
          if (!prev || new Date(d.updatedAt) > new Date(prev.updatedAt)) map.set(d.id, d);
        }
        setRows(Array.from(map.values()).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
      })
      .catch(() => setRows(local));
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this design permanently?")) return;
    deleteLocalDesign(id);
    await fetch(`/api/designs/${id}`, { method: "DELETE" }).catch(() => undefined);
    setRows((r) => (r ? r.filter((x) => x.id !== id) : r));
  }

  if (!rows) return <p className="mt-10 text-slate-500">Loading your designs…</p>;

  return (
    <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      <BlankDesignButton
        className="flex aspect-[4/5] flex-col items-center justify-center gap-2 self-start rounded-2xl border-2 border-dashed border-gold-400 bg-gold-50 text-maroon-700 transition hover:bg-gold-100"
      >
        <span className="text-5xl leading-none">+</span>
        <span className="text-sm font-semibold">New design</span>
      </BlankDesignButton>
      {rows.map((d) => (
        <div key={d.id} className="group">
          <Link href={`/editor/${d.id}`} className="lift block rounded-2xl bg-ivory-dark p-3 ring-1 ring-gold-200/60 hover:ring-gold-400">
            <div className="flex aspect-[4/5] items-center justify-center">
              <div
                className="shadow-md"
                style={{ width: `${Math.min(100, (d.data.width / d.data.height / 0.8) * 100).toFixed(2)}%` }}
              >
                <DesignView doc={d.data} />
              </div>
            </div>
          </Link>
          <div className="mt-2 flex items-center justify-between px-1">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{d.title}</p>
              <p className="text-xs text-slate-500">Edited {new Date(d.updatedAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => remove(d.id)} className="rounded-lg px-2 py-1 text-xs text-rose-600 hover:bg-rose-50">
              Delete
            </button>
          </div>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="col-span-full text-slate-500">
          No designs yet. <Link href="/templates" className="font-semibold text-maroon-700 hover:underline">Browse templates</Link> to start.
        </p>
      )}
    </div>
  );
}
