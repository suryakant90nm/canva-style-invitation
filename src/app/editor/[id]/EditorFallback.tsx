"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Editor from "@/components/editor/Editor";
import { getLocalDesign, type LocalDesign } from "@/lib/local-designs";

/**
 * Rendered when the server could not find the design. Looks it up in the
 * browser's local mirror; if found, opens the editor exactly as normal and
 * re-registers the design with the server so autosave keeps working.
 */
export default function EditorFallback({ id }: { id: string }) {
  const [state, setState] = useState<"loading" | "found" | "missing">("loading");
  const [design, setDesign] = useState<LocalDesign | null>(null);

  useEffect(() => {
    const local = getLocalDesign(id);
    if (local) {
      setDesign(local);
      setState("found");
      // best-effort: recreate on the server so PUT/autosave have a target
      void fetch(`/api/designs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: local.title, data: local.data, category: local.category, ownerId: local.ownerId, restore: true }),
      }).catch(() => undefined);
    } else {
      setState("missing");
    }
  }, [id]);

  if (state === "loading") {
    return (
      <div className="grid h-screen place-items-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <p className="text-sm font-medium text-slate-600">Opening your design…</p>
        </div>
      </div>
    );
  }

  if (state === "found" && design) {
    return <Editor id={design.id} initialTitle={design.title} category={design.category} initialDoc={design.data} />;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center">
      <div>
        <p className="text-6xl">💌</p>
        <h1 className="mt-4 text-3xl font-extrabold">Design not found</h1>
        <p className="mt-2 max-w-md text-slate-500">
          This design was created on another device or browser, or it was deleted. Designs are saved in the browser
          where you made them.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/templates" className="rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700">
            Browse templates
          </Link>
          <Link href="/my-designs" className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100">
            My designs
          </Link>
        </div>
      </div>
    </main>
  );
}
