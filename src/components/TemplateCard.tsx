import Link from "next/link";
import { DesignView } from "./DesignView";
import { getCategory } from "@/lib/categories";
import type { Doc } from "@/lib/design";

export type TemplateLite = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  data: Doc;
  source?: string;
  uses?: number;
};

export function TemplateCard({ t }: { t: TemplateLite }) {
  const cat = getCategory(t.category);
  return (
    <Link href={`/templates/${t.slug}`} className="group block">
      <div className="lift relative overflow-hidden rounded-2xl bg-ivory-dark p-3 shadow-sm ring-1 ring-gold-200/60 group-hover:ring-gold-400">
        <div className="flex aspect-[4/5] items-center justify-center">
          <div
            className="shadow-md"
            style={{ width: `${Math.min(100, (t.data.width / t.data.height / 0.8) * 100).toFixed(2)}%` }}
          >
            <DesignView doc={t.data} />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center bg-gradient-to-t from-black/60 to-transparent p-4 pt-10 transition duration-300 group-hover:translate-y-0">
          <span className="btn-shine rounded-full bg-gold-400 px-4 py-1.5 text-sm font-semibold text-maroon-900 shadow">
            Customize →
          </span>
        </div>
        {t.source === "community" && (
          <span className="absolute left-4 top-4 rounded-full bg-maroon-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-100">
            Community
          </span>
        )}
      </div>
      <div className="mt-2.5 px-1">
        <p className="truncate text-sm font-semibold text-ink">{t.title}</p>
        <p className="truncate text-xs text-ink-muted">
          {cat?.name ?? t.category}
          {t.tags.length ? ` · ${t.tags.slice(0, 2).join(", ")}` : ""}
        </p>
      </div>
    </Link>
  );
}
