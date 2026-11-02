"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DesignView } from "@/components/DesignView";
import { BlankDesignButton } from "@/components/StartButtons";
import { getOwnerId } from "@/lib/owner";
import type { Doc } from "@/lib/design";

type Row = { id: string; title: string; category: string; data: Doc; updatedAt: string };

export default function MyDesigns() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    const owner = getOwnerId();
    fetch(`/api/designs?owner=${owner}`)
      .then((r) => r.json())
      .then((j: { designs: Row[] }) => setRows(j.designs))
      .catch(() => setRows([]));
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this design permanently?")) return;
    await fetch(`/api/designs/${id}`, { method: "DELETE" });
    setRows((r) => (r ? r.filter((x) => x.id !== id) : r));
  }

  if (!rows) return <p className="mt-10 text-slate-500">Loading your designs…</p>;

  return (
    <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      <BlankDesignButton
        className="flex aspect-[4/5] flex-col items-center justify-center gap-2 self-start rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 text-violet-700 transition hover:bg-violet-100"
      >
        <span className="text-5xl leading-none">+</span>
        <span className="text-sm font-semibold">New design</span>
      </BlankDesignButton>
      {rows.map((d) => (
        <div key={d.id} className="group">
          <Link href={`/editor/${d.id}`} className="block rounded-2xl bg-slate-200 p-3 ring-1 ring-slate-200 transition hover:ring-violet-300">
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
          No designs yet. <Link href="/templates" className="font-semibold text-violet-600 hover:underline">Browse templates</Link> to start.
        </p>
      )}
    </div>
  );
}
