export type Category = {
  slug: string;
  name: string;
  plural: string;
  emoji: string;
  description: string;
  gradient: string;
  tags: string[];
  size: { w: number; h: number };
};

export const CATEGORIES: Category[] = [
  {
    slug: "invitation",
    name: "Invitation Card",
    plural: "Invitation Cards",
    emoji: "💌",
    description: "Birthday, party, housewarming, festival & dinner invites.",
    gradient: "linear-gradient(135deg,#ff9a76,#ff5e7e)",
    tags: ["Birthday", "Party", "Housewarming", "Festival", "Dinner"],
    size: { w: 700, h: 1000 },
  },
  {
    slug: "wedding",
    name: "Marriage Card",
    plural: "Marriage Cards",
    emoji: "💍",
    description: "Shadi, engagement, mehendi, haldi & save-the-date cards.",
    gradient: "linear-gradient(135deg,#8c1c2e,#d4a24c)",
    tags: ["Hindu", "Modern", "Engagement", "Mehendi", "Save the Date"],
    size: { w: 700, h: 1000 },
  },
  {
    slug: "baby-shower",
    name: "Baby Shower Card",
    plural: "Baby Shower Cards",
    emoji: "🍼",
    description: "Boy, girl, gender reveal, godh bharai & sprinkle designs.",
    gradient: "linear-gradient(135deg,#7cc6fe,#f7a8c8)",
    tags: ["Boy", "Girl", "Gender Reveal", "Neutral", "Indian"],
    size: { w: 700, h: 1000 },
  },
  {
    slug: "birthday",
    name: "Birthday Card",
    plural: "Birthday Cards",
    emoji: "🎂",
    description: "Photo collage birthdays, kids parties, 18th & 21st milestones.",
    gradient: "linear-gradient(135deg,#7b61ff,#38bdf8)",
    tags: ["Photo Collage", "Kids", "Milestone", "Hindi", "Instagram"],
    size: { w: 700, h: 1000 },
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
