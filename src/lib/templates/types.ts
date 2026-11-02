import type { Doc } from "../design";

export type SeedTemplate = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  featured?: boolean;
  doc: Doc;
};
