import { birthdayTemplates } from "./birthday";
import { babyShowerTemplates, babyShowerTemplatesExtra } from "./baby";
import { invitationTemplates } from "./invitation";
import { weddingTemplatesV2 } from "./wedding-v2";
import { myTemplates } from "./my-templates";
import type { SeedTemplate } from "./types";

/** Every built-in template. Categories currently hold 16–17 designs each. */
export const SEED_TEMPLATES: SeedTemplate[] = [
  ...weddingTemplatesV2,
  ...birthdayTemplates,
  ...babyShowerTemplates,
  ...babyShowerTemplatesExtra,
  ...invitationTemplates,
  // ↓ your own templates (src/lib/templates/my-templates.ts)
  ...myTemplates,
];

export type { SeedTemplate };
