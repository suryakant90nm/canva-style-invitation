import { makeImage } from "../design";
import type { El, ImageEl } from "../design";

/** logical id → file in /public/art (keeps template code short and safe) */
const FILES: Record<string, string> = {
  "ganesha-maroon": "ganesha-gold-maroon.png",
  "ganesha-gold": "ganesha-icon-white.png",
  couple: "couple-bride-groom.png",
  mandala: "mandala-red.png",
  paisley: "paisley-gold-red.png",
  leaves: "tropical-leaves.png",
  balloons: "golden-balloons.png",
  "cake-pets": "birthday-cake-pets.png",
  "baby-elements": "baby-shower-elements.png",
  diya: "diya-marigold.png",
};

const A = (id: string) => {
  const file = FILES[id] ?? `${id}.png`;
  return `/art/${file}`;
};

/** artwork block (solid background artwork, e.g. Ganesha on maroon) */
export function art(id: string, x: number, y: number, w: number, h: number, o: Partial<ImageEl> = {}): El[] {
  return [makeImage(A(id), { x, y, w, h, frame: "rect", blend: "normal", ...o })];
}

/** white-background artwork blended into the card (watercolour illustrations, motifs) */
export function artBlend(id: string, x: number, y: number, w: number, h: number, o: Partial<ImageEl> = {}): El[] {
  return [makeImage(A(id), { x, y, w, h, frame: "rect", blend: "multiply", ...o })];
}

/** repeating wallpaper pattern */
export function artPattern(id: string, x: number, y: number, w: number, h: number, o: Partial<ImageEl> = {}): El[] {
  return [makeImage(A(id), { x, y, w, h, frame: "rect", tile: true, ...o })];
}

/** every art id referenced anywhere must resolve to a file that exists */
export const ALL_ART_IDS = Object.keys(FILES);
