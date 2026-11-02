import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { listTemplates } from "@/lib/data";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();
  const rows = await listTemplates({ limit: 500 }).catch(() => []);

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/templates`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/my-designs`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    ...CATEGORIES.map((c) => ({
      url: `${base}/templates?category=${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...rows.map((t) => ({
      url: `${base}/templates/${t.slug}`,
      lastModified: t.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
