/**
 * Reusable illustration library for premium templates.
 *
 * These are locally hosted AI-generated illustrations (free, no attribution needed,
 * no API calls) so every template can look rich and "Canva-like" while staying
 * fully editable. Each entry declares whether it should be blended with
 * `mix-blend-mode: multiply` (artwork on a white/cream background) or drawn
 * as a solid block (artwork whose own background is part of the design).
 */
export type ArtAsset = {
  id: string;
  name: string;
  src: string;
  group: "Wedding" | "Birthday" | "Baby" | "Festival" | "Pattern";
  blend: boolean;
  /** default aspect ratio (w/h) so frames never look stretched */
  ratio: number;
};

export const ART: ArtAsset[] = [
  { id: "ganesha-maroon", name: "Ganesha Mandala (Maroon)", src: "/art/ganesha-gold-maroon.png", group: "Wedding", blend: false, ratio: 1 },
  { id: "ganesha-gold", name: "Ganesha Gold Motif", src: "/art/ganesha-icon-white.png", group: "Wedding", blend: true, ratio: 1 },
  { id: "couple", name: "Bride & Groom Illustration", src: "/art/couple-bride-groom.png", group: "Wedding", blend: true, ratio: 1 },
  { id: "mandala-red", name: "Red Mandala Corner", src: "/art/mandala-red.png", group: "Wedding", blend: true, ratio: 1 },
  { id: "paisley", name: "Paisley Damask Pattern", src: "/art/paisley-gold-red.png", group: "Pattern", blend: false, ratio: 1 },
  { id: "leaves", name: "Tropical Leaf Arch", src: "/art/tropical-leaves.png", group: "Wedding", blend: true, ratio: 1 },
  { id: "balloons", name: "Golden Balloons & Gifts", src: "/art/golden-balloons.png", group: "Birthday", blend: true, ratio: 1 },
  { id: "cake-pets", name: "Puppy & Kitten Cake", src: "/art/birthday-cake-pets.png", group: "Birthday", blend: true, ratio: 1.4 },
  { id: "baby-elements", name: "Baby Shower Set", src: "/art/baby-shower-elements.png", group: "Baby", blend: true, ratio: 1.3 },
  { id: "diya", name: "Diya & Marigold", src: "/art/diya-marigold.png", group: "Festival", blend: true, ratio: 1.2 },
];

export const artById = (id: string) => ART.find((a) => a.id === id);
