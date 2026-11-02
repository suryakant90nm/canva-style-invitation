import { archPhoto, border, C, corner, D, divider, dots, glow, ornament, pill, ribbon, S, scatter, seal, T, sideFlorals } from "../decor";
import { art, artBlend, artPattern } from "./art";
import type { SeedTemplate } from "./types";

const W = 700;
const H = 1000;
const GOLD = "#e0bc6a";
const GOLD_D = "#b8933f";
const MAROON = "#7d1226";

/* ════════ 1. GANESHA GRAND MAROON (reference style) ════════ */
const ganeshaGrand: SeedTemplate = {
  slug: "ganesha-grand-maroon-wedding",
  title: "Ganesha Grand Maroon Wedding",
  category: "wedding",
  tags: ["Hindu", "Royal", "Ganesha"],
  featured: true,
  doc: D(W, H, "linear-gradient(170deg,#6b0f20,#8c1c2e 50%,#5c0d1c)", [
    ...scatter(W, [[0, 220], [780, 1000]], 14, [GOLD, "#f3d9a4"], 3, ["circle", "diamond"], 16),
    S("rect", 22, 22, W - 44, H - 44, { fill: "transparent", stroke: GOLD, strokeWidth: 2.5, radius: 4 }),
    S("rect", 36, 36, W - 72, H - 72, { fill: "transparent", stroke: GOLD_D, strokeWidth: 1, radius: 3 }),
    ...art("ganesha-gold-maroon", W / 2 - 190, 70, 380, 380, { frame: "circle" }),
    S("ring", W / 2 - 202, 58, 404, 404, { fill: GOLD, strokeWidth: 2 }),
    C(W, "॥ श्री गणेशाय नमः ॥", 492, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: GOLD }),
    ...divider(W, 546, GOLD, "floral", 240),
    C(W, "Aarav", 576, { fontFamily: "Great Vibes", fontSize: 108, color: GOLD, lineHeight: 1.05 }),
    C(W, "weds", 712, { fontFamily: "Cormorant Garamond", fontSize: 30, italic: true, color: "#f3d9a4" }),
    C(W, "Ananya", 742, { fontFamily: "Great Vibes", fontSize: 108, color: GOLD, lineHeight: 1.05 }),
    ...pill(W, 882, "14 DEC 2026 · JAIPUR", GOLD, "#5c0d1c", { fontSize: 21, letterSpacing: 3, fontWeight: 700 }, 58, 0.68),
  ]),
};

/* ════════ 2. MANGAL VIVAAH COUPLE (reference style) ════════ */
const mangalVivaah: SeedTemplate = {
  slug: "mangal-vivaah-hindi-wedding",
  title: "Mangal Vivaah Hindi Wedding",
  category: "wedding",
  tags: ["Hindu", "Couple", "Hindi"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fdf3e3,#f7e2c4)", [
    ...artBlend("leaves", 0, 0, W, 300, { opacity: 0.75 }),
    C(W, "शुभ विवाह", 96, { fontFamily: "Yatra One", fontSize: 92, color: "#b8352a" }),
    ...divider(W, 218, GOLD_D, "floral", 250),
    ...artBlend("couple", 90, 240, 520, 520),
    ...pill(W, 762, "AARAV WEDS ANANYA", "#b8352a", "#fdf3e3", { fontSize: 22, letterSpacing: 3, fontWeight: 700 }, 60, 0.72),
    C(W, "शनिवार · 14 दिसम्बर 2026", 832, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#5a2d0c" }),
    C(W, "शुभ मुहूर्त · रात 11:30 बजे", 872, { fontFamily: "Tiro Devanagari Hindi", fontSize: 24, color: "#6b5a3a" }),
    C(W, "ताज पैलेस, जयपुर", 912, { fontFamily: "Tiro Devanagari Hindi", fontSize: 24, color: "#6b5a3a" }),
  ]),
};

/* ════════ 3. WHITE RED MANDALA (reference style) ════════ */
const whiteRedMandala: SeedTemplate = {
  slug: "white-red-mandala-housewarming",
  title: "White & Red Mandala Card",
  category: "wedding",
  tags: ["Hindu", "Mandala"],
  featured: true,
  doc: D(W, H, "#ffffff", [
    ...artPattern("paisley", 0, 0, W, 230),
    ...artPattern("paisley", 0, H - 230, W, 230),
    S("rect", 0, 0, W, 230, { fill: "rgba(255,255,255,0.14)" }),
    C(W, "// Shree Ganeshaya Namah //", 250, { fontFamily: "Cormorant Garamond", fontSize: 24, italic: true, color: "#8c1c2e" }),
    ...artBlend("ganesha-gold", W / 2 - 95, 292, 190, 190),
    C(W, "We are delighted to invite you and your", 502, { fontFamily: "Cormorant Garamond", fontSize: 25, italic: true, color: "#4b3a2a" }),
    C(W, "family to grace the occasion of our", 538, { fontFamily: "Cormorant Garamond", fontSize: 25, italic: true, color: "#4b3a2a" }),
    C(W, "Wedding", 584, { fontFamily: "Playfair Display", fontSize: 74, fontWeight: 700, color: "#c2185b", lineHeight: 1.05 }),
    C(W, "Ceremony", 668, { fontFamily: "Playfair Display", fontSize: 52, fontWeight: 700, color: "#c2185b", lineHeight: 1.05 }),
    ...divider(W, 742, "#8c1c2e", "floral", 230),
    C(W, "Aarav & Ananya", 772, { fontFamily: "Great Vibes", fontSize: 84, color: "#8c1c2e", lineHeight: 1.05 }),
    C(W, "14 DECEMBER 2026 · JAIPUR", 886, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 4, color: "#8c1c2e", fontWeight: 700 }),
    C(W, "RSVP · 98765 43210", 928, { fontFamily: "Montserrat", fontSize: 14, letterSpacing: 3, color: "#6b5a3a" }),
  ]),
};

/* ════════ 4. GATHBANDHAN COUPLE (reference style) ════════ */
const gathbandhan: SeedTemplate = {
  slug: "gathbandhan-couple-invitation",
  title: "Gathbandhan Couple Invitation",
  category: "wedding",
  tags: ["Hindu", "Couple", "Floral"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fffdf7,#f8efe0)", [
    ...artBlend("leaves", 0, H - 320, W, 320, { opacity: 0.6 }),
    ...artBlend("couple", 70, 250, 560, 560),
    C(W, "Gathbandhan", 56, { fontFamily: "Great Vibes", fontSize: 82, color: "#8c1c2e", lineHeight: 1.05 }),
    ...divider(W, 162, GOLD_D, "floral", 240),
    C(W, "Two families, one beautiful bond", 856, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#6b5a3a" }),
    ...pill(W, 906, "SUNDAY · 22 MARCH 2027", "#8c1c2e", "#fffdf7", { fontSize: 20, letterSpacing: 3, fontWeight: 700 }, 56, 0.72),
  ]),
};

/* ════════ 5. ROYAL MAROON SHUBH VIVAH ════════ */
const royalMaroon: SeedTemplate = {
  slug: "royal-maroon-shubh-vivah",
  title: "Royal Maroon Shubh Vivah",
  category: "wedding",
  tags: ["Hindu", "Royal"],
  featured: true,
  doc: D(W, H, "linear-gradient(165deg,#5c0d1c,#8c1c2e 45%,#5c0d1c)", [
    ...scatter(W, [[0, 240], [760, 1000]], 16, [GOLD, "#f3d9a4"], 3, ["circle", "diamond", "star"], 18),
    S("rect", 24, 24, W - 48, H - 48, { fill: "transparent", stroke: GOLD, strokeWidth: 2.5, radius: 6 }),
    S("rect", 38, 38, W - 76, H - 76, { fill: "transparent", stroke: GOLD_D, strokeWidth: 1, radius: 4 }),
    ...corner("arc", 24, 24, 120, GOLD),
    ...corner("arc", W - 144, 24, 120, GOLD, 90),
    ...corner("arc", 24, H - 144, 120, GOLD, 270),
    ...corner("arc", W - 144, H - 144, 120, GOLD, 180),
    C(W, "॥ श्री गणेशाय नमः ॥", 66, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: GOLD }),
    ...artBlend("ganesha-gold", W / 2 - 70, 108, 140, 140),
    C(W, "शुभ विवाह", 262, { fontFamily: "Yatra One", fontSize: 82, color: "#fff3d6" }),
    ...divider(W, 376, GOLD, "floral", 250),
    C(W, "Together with their families", 406, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#f3d9a4" }),
    C(W, "Aarav", 442, { fontFamily: "Great Vibes", fontSize: 112, color: GOLD, lineHeight: 1.05 }),
    C(W, "&", 586, { fontFamily: "Cormorant Garamond", fontSize: 40, color: "#fff3d6" }),
    C(W, "Ananya", 618, { fontFamily: "Great Vibes", fontSize: 112, color: GOLD, lineHeight: 1.05 }),
    ...pill(W, 764, "SATURDAY · 14 DEC 2026", GOLD, "#5c0d1c", { letterSpacing: 3, fontSize: 22 }, 60, 0.76),
    C(W, "Muhurat 11:30 AM onwards", 848, { fontFamily: "Cormorant Garamond", fontSize: 26, color: "#fff3d6" }),
    C(W, "Taj Palace Banquet · Jaipur", 888, { fontFamily: "Cormorant Garamond", fontSize: 26, color: "#fff3d6" }),
    ...divider(W, 948, GOLD, "dots", 170),
  ]),
};

/* ════════ 6. GRAND ARCH FLORAL ════════ */
const archFloral: SeedTemplate = {
  slug: "grand-arch-floral-wedding",
  title: "Grand Arch Floral Wedding",
  category: "wedding",
  tags: ["Hindu", "Floral"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fdf1dd,#f6dfc0)", [
    ...glow(W / 2 - 220, 40, 440, "#ffd98a", 0.5),
    S("arch", 90, 90, W - 180, 700, { fill: "#fffaf0", stroke: GOLD, strokeWidth: 2 }),
    S("arch", 112, 112, W - 224, 678, { fill: "transparent", stroke: GOLD_D, strokeWidth: 1 }),
    ...corner("petal", 74, 96, 130, "#e8a33d", 15),
    ...corner("petal", W - 204, 96, 130, "#e8a33d", -15),
    C(W, "THE WEDDING OF", 200, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 7, color: "#a8802f", fontWeight: 700 }),
    C(W, "Kabir", 240, { fontFamily: "Playfair Display", fontSize: 76, color: "#5a2d0c", lineHeight: 1.05 }),
    S("heart", W / 2 - 22, 340, 44, 40, { fill: "#c2185b" }),
    C(W, "Meera", 388, { fontFamily: "Playfair Display", fontSize: 76, color: "#5a2d0c", lineHeight: 1.05 }),
    ...divider(W, 496, GOLD_D, "floral", 240),
    C(W, "son of Shri & Smt. Sharma", 528, { fontFamily: "Cormorant Garamond", fontSize: 22, italic: true, color: "#8a6b3a" }),
    C(W, "&", 560, { fontFamily: "Great Vibes", fontSize: 38, color: "#c2185b" }),
    C(W, "daughter of Shri & Smt. Patel", 598, { fontFamily: "Cormorant Garamond", fontSize: 22, italic: true, color: "#8a6b3a" }),
    ...ribbon(W, 676, "09 FEBRUARY 2027 · 7 PM", "#5a2d0c", "#f6dfc0", { letterSpacing: 3 }),
    C(W, "Umaid Bhawan Lawns · Jodhpur", 788, { fontFamily: "Playfair Display", fontSize: 26, color: "#5a2d0c" }),
    C(W, "Dinner & Sangeet to follow", 830, { fontFamily: "Cormorant Garamond", fontSize: 24, italic: true, color: "#8a6b3a" }),
    ...divider(W, 902, GOLD_D, "dots", 160),
  ]),
};

/* ════════ 7. GOLD LUXE DARK ════════ */
const goldLuxe: SeedTemplate = {
  slug: "gold-luxe-dark-wedding",
  title: "Gold Luxe Dark Wedding",
  category: "wedding",
  tags: ["Modern", "Royal"],
  featured: true,
  doc: D(W, H, "linear-gradient(150deg,#0a0a0a,#1c1a17 40%,#0d0b09)", [
    ...glow(W / 2 - 240, 120, 480, "#d4af37", 0.2),
    ...border(W, H, GOLD, { inset: 30, gap: 16, weight: 2 }),
    ...corner("dots", 40, 40, 110, GOLD),
    ...corner("dots", W - 150, 40, 110, GOLD),
    ...corner("dots", 40, H - 150, 110, GOLD),
    ...corner("dots", W - 150, H - 150, 110, GOLD),
    S("diamond", W / 2 - 22, 88, 44, 44, { fill: GOLD }),
    C(W, "TOGETHER WITH THEIR FAMILIES", 168, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 8, color: GOLD, fontWeight: 700 }),
    C(W, "SOPHIA", 216, { fontFamily: "Cinzel", fontSize: 82, color: "#f7f1e1", letterSpacing: 8, lineHeight: 1.05 }),
    S("line", W / 2 - 90, 328, 180, 1.5, { stroke: GOLD, strokeWidth: 1.5 }),
    C(W, "&", 342, { fontFamily: "Great Vibes", fontSize: 76, color: GOLD }),
    S("line", W / 2 - 90, 442, 180, 1.5, { stroke: GOLD, strokeWidth: 1.5 }),
    C(W, "JAMES", 462, { fontFamily: "Cinzel", fontSize: 82, color: "#f7f1e1", letterSpacing: 8, lineHeight: 1.05 }),
    ...divider(W, 592, GOLD, "diamond", 240),
    C(W, "SATURDAY", 622, { fontFamily: "Montserrat", fontSize: 17, letterSpacing: 9, color: GOLD }),
    C(W, "18", 658, { fontFamily: "Cormorant Garamond", fontSize: 118, color: "#f7f1e1", lineHeight: 1 }),
    C(W, "SEPTEMBER 2026", 800, { fontFamily: "Cinzel", fontSize: 30, letterSpacing: 5, color: GOLD }),
    C(W, "The Grand Ballroom · Mumbai", 868, { fontFamily: "Cormorant Garamond", fontSize: 28, italic: true, color: "#e8dfc8" }),
    C(W, "COCKTAILS 6 PM · DINNER 8 PM", 914, { fontFamily: "Montserrat", fontSize: 13, letterSpacing: 4, color: GOLD, fontWeight: 700 }),
  ]),
};

/* ════════ 8. BLUSH MINIMAL ════════ */
const blushMinimal: SeedTemplate = {
  slug: "blush-minimal-wedding",
  title: "Blush Minimal Wedding",
  category: "wedding",
  tags: ["Modern"],
  featured: true,
  doc: D(W, H, "#fbf5f2", [
    ...artBlend("leaves", -40, -40, W + 80, 380, { opacity: 0.5 }),
    S("circle", -140, 760, 380, 380, { fill: "#f6e4dc" }),
    S("quarter", W - 150, H - 150, 150, 150, { fill: "#e9c4ba", opacity: 0.7 }),
    C(W, "WE'RE GETTING MARRIED", 320, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 8, color: "#a3827a", fontWeight: 700 }),
    C(W, "Emma", 364, { fontFamily: "Playfair Display", fontSize: 100, color: "#3b2a26", lineHeight: 1.05 }),
    C(W, "& Liam", 486, { fontFamily: "Playfair Display", fontSize: 100, italic: true, color: "#c07b6c", lineHeight: 1.05 }),
    ...divider(W, 636, "#c07b6c", "heart", 200),
    C(W, "06 · 09 · 2026", 668, { fontFamily: "Cormorant Garamond", fontSize: 50, letterSpacing: 4, color: "#3b2a26" }),
    C(W, "ROSEWOOD GARDEN · UDAIPUR", 750, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 5, color: "#a3827a", fontWeight: 700 }),
    C(W, "Ceremony 5 PM  ·  Dinner 7:30 PM", 790, { fontFamily: "Montserrat", fontSize: 15, color: "#a3827a" }),
    ...pill(W, 850, "Kindly RSVP by 1st August", "#3b2a26", "#fbf5f2", { fontFamily: "Dancing Script", fontSize: 26, fontWeight: 700, letterSpacing: 0 }, 58, 0.6),
  ]),
};

/* ════════ 9. COUPLE PHOTO CLASSIC ════════ */
const couplePhoto: SeedTemplate = {
  slug: "couple-photo-classic-wedding",
  title: "Couple Photo Classic Wedding",
  category: "wedding",
  tags: ["Photo Collage", "Modern"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fffdf8,#f7ead6)", [
    ...archPhoto(W, 96, 420, 470, GOLD, "Couple photo"),
    ...corner("petal", 40, 70, 120, "#e8a33d", 18),
    ...corner("petal", W - 160, 70, 120, "#e8a33d", -18),
    C(W, "TOGETHER WITH THEIR FAMILIES", 610, { fontFamily: "Montserrat", fontSize: 14, letterSpacing: 6, color: "#a8802f", fontWeight: 700 }),
    C(W, "Aarav & Ananya", 646, { fontFamily: "Great Vibes", fontSize: 92, color: MAROON, lineHeight: 1.05 }),
    ...divider(W, 786, GOLD_D, "floral", 240),
    C(W, "request the honour of your presence", 816, { fontFamily: "Cormorant Garamond", fontSize: 25, italic: true, color: "#6b5a3a" }),
    ...pill(W, 862, "14 DECEMBER 2026 · JAIPUR", MAROON, "#f6dfc0", { fontSize: 22, letterSpacing: 3 }, 58, 0.7),
    C(W, "RSVP · 98765 43210", 946, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 4, color: "#8a6b3a", fontWeight: 700 }),
  ]),
};

/* ════════ 10. MEHENDI CARNIVAL ════════ */
const mehendiCarnival: SeedTemplate = {
  slug: "mehendi-marigold-carnival",
  title: "Mehendi Marigold Carnival",
  category: "wedding",
  tags: ["Mehendi", "Hindu"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fff6d8,#ffe6a8)", [
    ...dots(W, H, "#f0b429", 0.35, 34),
    S("rect", 26, 26, W - 52, H - 52, { fill: "transparent", stroke: "#d98200", strokeWidth: 3, radius: 28 }),
    ...corner("petal", 14, 14, 120, "#f59f00", 20),
    ...corner("petal", W - 134, 14, 120, "#f59f00", -20),
    ...corner("petal", 14, H - 134, 120, "#f59f00", 160),
    ...corner("petal", W - 134, H - 134, 120, "#f59f00", 200),
    C(W, "मेहंदी & हल्दी", 70, { fontFamily: "Rozha One", fontSize: 70, color: "#b25a00" }),
    C(W, "Celebration", 176, { fontFamily: "Dancing Script", fontSize: 80, fontWeight: 700, color: "#2e7d32", lineHeight: 1 }),
    ...divider(W, 286, "#d98200", "wave", 240),
    C(W, "An evening of music, colours", 318, { fontFamily: "Poppins", fontSize: 24, color: "#6b3a00" }),
    C(W, "& dhol beats!", 354, { fontFamily: "Poppins", fontSize: 24, color: "#6b3a00" }),
    S("rect", 130, 412, W - 260, 330, { fill: "#fffdf5", radius: 32, stroke: "#f0b429", strokeWidth: 2 }),
    ...seal(W / 2, 412, 84, "#f59f00", "💃", 0.52),
    C(W, "FRIDAY · 12 DECEMBER", 530, { fontFamily: "Poppins", fontSize: 29, fontWeight: 700, color: "#b25a00" }),
    C(W, "Mehendi 4 PM  ·  Haldi 7 PM", 578, { fontFamily: "Poppins", fontSize: 22, color: "#6b3a00" }),
    C(W, "Sharma Farmhouse", 622, { fontFamily: "Cormorant Garamond", fontSize: 27, color: "#6b3a00" }),
    C(W, "Sector 21, Gurugram", 660, { fontFamily: "Cormorant Garamond", fontSize: 25, color: "#6b3a00" }),
    ...pill(W, 786, "Wear yellow & green 💛💚", "#2e7d32", "#fffdf5", { fontSize: 22 }, 56, 0.66),
    C(W, "🌼 🌿 🌼", 884, { fontSize: 42 }),
  ]),
};

/* ════════ 11. EMERALD GARDEN ════════ */
const emeraldGarden: SeedTemplate = {
  slug: "emerald-garden-wedding",
  title: "Emerald Garden Wedding",
  category: "wedding",
  tags: ["Modern", "Floral"],
  doc: D(W, H, "linear-gradient(170deg,#0b3527,#14563c 55%,#0b3527)", [
    ...scatter(W, [[0, 300], [740, 1000]], 20, ["#8fc9a8", GOLD, "#d9f0e0"], 21, ["leaf", "circle", "flower"], 30),
    S("arch", 130, 96, W - 260, 560, { fill: "#f7f2e4" }),
    S("arch", 148, 114, W - 296, 542, { fill: "transparent", stroke: GOLD, strokeWidth: 1.6 }),
    ...corner("leaf", 96, 80, 140, "#8fc9a8", 30),
    ...corner("leaf", W - 236, 80, 140, "#8fc9a8", -30),
    C(W, "THE WEDDING OF", 226, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 7, color: "#14563c", fontWeight: 700 }),
    C(W, "Sophia", 266, { fontFamily: "Alex Brush", fontSize: 100, color: "#0b3527", lineHeight: 1.05 }),
    C(W, "&", 388, { fontFamily: "Cormorant Garamond", fontSize: 44, color: GOLD_D }),
    C(W, "James", 424, { fontFamily: "Alex Brush", fontSize: 100, color: "#0b3527", lineHeight: 1.05 }),
    C(W, "SATURDAY · 21 FEBRUARY 2027", 716, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 5, color: "#d9f0e0", fontWeight: 700 }),
    ...pill(W, 758, "THE ORCHARD ESTATE · LONAVALA", GOLD, "#0b3527", { fontSize: 18, letterSpacing: 3 }, 56, 0.84),
    C(W, "Ceremony at 4 PM", 848, { fontFamily: "Cormorant Garamond", fontSize: 28, italic: true, color: "#f7f2e4" }),
    C(W, "Reception to follow", 888, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#d9f0e0" }),
    ...divider(W, 950, GOLD, "wave", 200),
  ]),
};

/* ════════ 12. PINK PEONY ════════ */
const pinkPeony: SeedTemplate = {
  slug: "pink-peony-elegance",
  title: "Pink Peony Elegance",
  category: "wedding",
  tags: ["Floral", "Modern"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fff5f8,#ffe4ec)", [
    ...corner("petal", -20, -20, 200, "#f7a8c4", 12),
    ...corner("petal", W - 180, H - 200, 180, "#f7a8c4", 190),
    ...scatter(W, [[0, 200], [820, 1000]], 14, ["#f7a8c4", "#e5578a", "#ffd1e0"], 44, ["flower", "circle"], 34),
    ...border(W, H, "#e5578a", { inset: 30, gap: 12, weight: 1.6, radius: 18 }),
    C(W, "WEDDING INVITATION", 148, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 8, color: "#c2185b", fontWeight: 700 }),
    C(W, "Ishita", 190, { fontFamily: "Great Vibes", fontSize: 108, color: "#ad1457", lineHeight: 1.05 }),
    S("heart", W / 2 - 24, 336, 48, 44, { fill: "#e5578a" }),
    C(W, "Rohan", 386, { fontFamily: "Great Vibes", fontSize: 108, color: "#ad1457", lineHeight: 1.05 }),
    ...divider(W, 532, "#e5578a", "floral", 220),
    C(W, "together with their families", 562, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#8a4a63" }),
    C(W, "joyfully invite you to celebrate", 598, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#8a4a63" }),
    ...pill(W, 652, "SUNDAY · 22 MARCH 2027", "#ad1457", "#fff5f8", { fontSize: 22, letterSpacing: 3 }, 60, 0.74),
    C(W, "The Rose Palace · Lucknow", 748, { fontFamily: "Playfair Display", fontSize: 27, color: "#8a4a63" }),
    C(W, "Lunch 1 PM · Sangeet 7 PM", 790, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 2, color: "#8a4a63" }),
    C(W, "We can't wait to celebrate with you 🌷", 862, { fontFamily: "Caveat", fontSize: 36, color: "#ad1457" }),
    ...divider(W, 936, "#e5578a", "dots", 170),
  ]),
};

/* ════════ 13. HINDI TRADITIONAL PANNA ════════ */
const hindiTraditional: SeedTemplate = {
  slug: "hindi-traditional-panna-card",
  title: "Hindi Traditional Panna Card",
  category: "wedding",
  tags: ["Hindu", "Hindi"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fff8e8,#f7e4bd)", [
    S("rect", 22, 22, W - 44, H - 44, { fill: "#fffdf5", radius: 10, stroke: "#b8352a", strokeWidth: 3 }),
    S("rect", 38, 38, W - 76, H - 76, { fill: "transparent", stroke: "#c9a24b", strokeWidth: 1.2, radius: 6 }),
    ...corner("arc", 26, 26, 130, "#b8352a"),
    ...corner("arc", W - 156, 26, 130, "#b8352a", 90),
    ...corner("arc", 26, H - 156, 130, "#b8352a", 270),
    ...corner("arc", W - 156, H - 156, 130, "#b8352a", 180),
    C(W, "🪔 श्री गणेशाय नमः 🪔", 66, { fontFamily: "Tiro Devanagari Hindi", fontSize: 27, color: "#b8352a" }),
    C(W, "विवाह बधू संमेलन", 122, { fontFamily: "Yatra One", fontSize: 70, color: "#8c1c2e" }),
    ...divider(W, 228, "#c9a24b", "floral", 240),
    C(W, "सुश्री अनन्या", 262, { fontFamily: "Great Vibes", fontSize: 74, color: "#8c1c2e", lineHeight: 1 }),
    C(W, "के साथ", 364, { fontFamily: "Tiro Devanagari Hindi", fontSize: 25, color: "#8a6b3a" }),
    C(W, "श्री आरव वर्मा", 396, { fontFamily: "Great Vibes", fontSize: 74, color: "#8c1c2e", lineHeight: 1 }),
    C(W, "के शुभ विवाह की बेहद खुशी के साथ", 500, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#5a2d0c" }),
    C(W, "आमंत्रण देना चाहते हैं", 540, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#5a2d0c" }),
    S("rect", 100, 600, W - 200, 220, { fill: "#fff3d6", radius: 18, stroke: "#c9a24b", strokeWidth: 1.5 }),
    C(W, "दिनांक : 14 दिसम्बर 2026, शनिवार", 632, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#8c1c2e" }),
    C(W, "शुभ मुहूर्त : रात 11:30 बजे", 676, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#8c1c2e" }),
    C(W, "स्थान : ताज पैलेस, जयपुर", 720, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#8c1c2e" }),
    C(W, "आपका आगमन अवश्य करें 🙏", 862, { fontFamily: "Tiro Devanagari Hindi", fontSize: 27, color: "#b8352a" }),
    ...divider(W, 944, "#c9a24b", "dots", 170),
  ]),
};

/* ════════ 14. NAVY GEOMETRIC ════════ */
const navyGeometric: SeedTemplate = {
  slug: "navy-geometric-modern",
  title: "Navy Geometric Modern",
  category: "wedding",
  tags: ["Modern"],
  doc: D(W, H, "linear-gradient(160deg,#081a38,#0f2d5c 60%,#081a38)", [
    S("circle", -140, -140, 380, 380, { fill: "rgba(255,255,255,0.05)" }),
    S("circle", W - 200, H - 240, 380, 380, { fill: "rgba(201,162,75,0.08)" }),
    S("rect", 40, 40, W - 80, H - 80, { fill: "transparent", stroke: GOLD, strokeWidth: 1.6 }),
    ...scatter(W, [[0, 260], [800, 1000]], 16, [GOLD, "#ffffff"], 55, ["circle", "diamond"], 14),
    ...seal(W / 2, 168, 118, GOLD, "💍", 0.48),
    C(W, "THE WEDDING CELEBRATION OF", 268, { fontFamily: "Montserrat", fontSize: 14, letterSpacing: 7, color: GOLD, fontWeight: 700 }),
    C(W, "Neha", 310, { fontFamily: "Josefin Sans", fontSize: 86, color: "#f7f1e1", letterSpacing: 6, lineHeight: 1.05 }),
    S("line", W / 2 - 70, 424, 140, 1.5, { stroke: GOLD, strokeWidth: 1.5 }),
    C(W, "&", 438, { fontFamily: "Great Vibes", fontSize: 66, color: GOLD }),
    S("line", W / 2 - 70, 526, 140, 1.5, { stroke: GOLD, strokeWidth: 1.5 }),
    C(W, "Arjun", 544, { fontFamily: "Josefin Sans", fontSize: 86, color: "#f7f1e1", letterSpacing: 6, lineHeight: 1.05 }),
    ...divider(W, 672, GOLD, "diamond", 220),
    S("rect", W / 2 - 92, 704, 184, 184, { fill: "transparent", stroke: GOLD, strokeWidth: 1.6, rotation: 45 }),
    C(W, "08", 728, { fontFamily: "Cormorant Garamond", fontSize: 84, color: "#f7f1e1", lineHeight: 1 }),
    C(W, "MAY · 2027", 826, { fontFamily: "Montserrat", fontSize: 17, letterSpacing: 6, color: GOLD, fontWeight: 700 }),
    C(W, "The Leela · Udaipur", 916, { fontFamily: "Cormorant Garamond", fontSize: 28, italic: true, color: "#e8dfc8" }),
  ]),
};

/* ════════ 15. RECEPTION DINNER ════════ */
const receptionDinner: SeedTemplate = {
  slug: "wedding-reception-dinner",
  title: "Wedding Reception Dinner",
  category: "wedding",
  tags: ["Reception", "Modern"],
  doc: D(W, H, "linear-gradient(180deg,#f8f5ef,#efe6d8)", [
    S("rect", 0, 0, W, 320, { fill: "#2b2118" }),
    ...dots(W, 320, GOLD, 0.2, 28),
    ...glow(W / 2 - 200, -100, 400, GOLD, 0.25),
    C(W, "WEDDING RECEPTION", 140, { fontFamily: "Montserrat", fontSize: 17, letterSpacing: 8, color: GOLD, fontWeight: 700 }),
    C(W, "Dinner & Dance", 186, { fontFamily: "Playfair Display", fontSize: 60, color: "#f8f5ef", lineHeight: 1.05 }),
    S("rect", 80, 250, W - 160, 520, { fill: "#ffffff", radius: 22 }),
    S("rect", 96, 266, W - 192, 488, { fill: "transparent", stroke: GOLD, strokeWidth: 1.2, radius: 16 }),
    C(W, "in honour of", 302, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#8a6b3a" }),
    C(W, "Diya & Shaan", 340, { fontFamily: "Great Vibes", fontSize: 88, color: "#2b2118", lineHeight: 1.05 }),
    ...divider(W, 478, GOLD_D, "floral", 200),
    C(W, "SATURDAY · 20 MARCH 2027", 510, { fontFamily: "Montserrat", fontSize: 17, letterSpacing: 4, color: "#2b2118", fontWeight: 700 }),
    C(W, "7:30 in the evening", 550, { fontFamily: "Cormorant Garamond", fontSize: 27, italic: true, color: "#8a6b3a" }),
    C(W, "The Grand Hyatt · Mumbai", 592, { fontFamily: "Playfair Display", fontSize: 27, color: "#2b2118" }),
    C(W, "Black tie optional", 634, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 3, color: "#8a6b3a" }),
    ...pill(W, 702, "RSVP · 98200 11223", "#2b2118", "#f8f5ef", { fontSize: 20, letterSpacing: 3 }, 56, 0.64),
    ...scatter(W, [[820, 960]], 14, ["#c9a24b", "#8a6b3a"], 77, ["flower", "leaf", "circle"], 28),
    C(W, "We look forward to celebrating with you", 868, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#2b2118" }),
    ...divider(W, 936, GOLD_D, "dots", 170),
  ]),
};

/* ════════ 16. SANGEET NEON ════════ */
const sangeetNeon: SeedTemplate = {
  slug: "sangeet-night-neon",
  title: "Sangeet Night Neon",
  category: "wedding",
  tags: ["Sangeet", "Party"],
  doc: D(W, H, "linear-gradient(165deg,#160b2e,#3a1160 55%,#0d0620)", [
    ...glow(W / 2 - 240, 60, 480, "#ff3dac", 0.3),
    ...glow(W / 2 - 180, 600, 360, "#27e6ff", 0.22),
    S("rect", 60, 100, W - 120, H - 200, { fill: "transparent", stroke: "#ff3dac", strokeWidth: 3, radius: 14 }),
    S("rect", 76, 116, W - 152, H - 232, { fill: "transparent", stroke: "#27e6ff", strokeWidth: 1.6, radius: 10 }),
    ...scatter(W, [[0, 200], [820, 1000]], 20, ["#ff3dac", "#27e6ff", "#ffe066"], 99, ["star", "circle", "diamond"], 22),
    C(W, "♬ ♫ ♬", 130, { fontSize: 44, color: "#27e6ff" }),
    C(W, "SANGEET NIGHT", 206, { fontFamily: "Montserrat", fontSize: 20, letterSpacing: 9, color: "#27e6ff", fontWeight: 700 }),
    C(W, "Dance", 248, { fontFamily: "Bebas Neue", fontSize: 136, color: "#ffffff", letterSpacing: 6, lineHeight: 0.95 }),
    C(W, "All Night", 400, { fontFamily: "Bebas Neue", fontSize: 92, color: "#ff3dac", letterSpacing: 4, lineHeight: 1 }),
    ...divider(W, 526, "#27e6ff", "wave", 240),
    C(W, "Celebrating the wedding of", 558, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 3, color: "#ffffff" }),
    C(W, "Riya & Aditya", 592, { fontFamily: "Great Vibes", fontSize: 88, color: "#ffe066", lineHeight: 1.05 }),
    C(W, "FRIDAY · 11 DECEMBER · 8 PM", 722, { fontFamily: "Montserrat", fontSize: 19, letterSpacing: 3, color: "#ffffff", fontWeight: 700 }),
    C(W, "Marriott Grand Ballroom · Delhi", 764, { fontFamily: "Montserrat", fontSize: 17, color: "#d6c6ff" }),
    ...pill(W, 820, "DJ · DANCE · DINNER", "#27e6ff", "#160b2e", { fontSize: 20, letterSpacing: 4, fontWeight: 700 }, 56, 0.64),
    C(W, "Come ready to dance! 💃🕺", 908, { fontFamily: "Caveat", fontSize: 38, color: "#ff3dac" }),
  ]),
};

/* ════════ 17. PAISLEY ROYAL ════════ */
const paisleyRoyal: SeedTemplate = {
  slug: "paisley-royal-wedding",
  title: "Paisley Royal Wedding",
  category: "wedding",
  tags: ["Hindu", "Royal", "Pattern"],
  doc: D(W, H, "#4a0714", [
    ...artPattern("paisley", 0, 0, W, H, { opacity: 0.5 }),
    S("rect", 60, 60, W - 120, H - 120, { fill: "rgba(74,7,20,0.82)", radius: 8, stroke: GOLD, strokeWidth: 2 }),
    C(W, "॥ श्री गणेशाय नमः ॥", 110, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: GOLD }),
    ...artBlend("ganesha-gold", W / 2 - 78, 152, 156, 156),
    C(W, "Wedding", 348, { fontFamily: "Great Vibes", fontSize: 96, color: GOLD, lineHeight: 1.05 }),
    C(W, "Invitation", 476, { fontFamily: "Cormorant Garamond", fontSize: 34, italic: true, color: "#f3d9a4", letterSpacing: 6 }),
    ...divider(W, 546, GOLD, "floral", 230),
    C(W, "Aarav", 578, { fontFamily: "Playfair Display", fontSize: 74, color: "#fff3d6", lineHeight: 1.05 }),
    C(W, "&", 676, { fontFamily: "Great Vibes", fontSize: 48, color: GOLD }),
    C(W, "Ananya", 706, { fontFamily: "Playfair Display", fontSize: 74, color: "#fff3d6", lineHeight: 1.05 }),
    ...pill(W, 820, "14 · 12 · 2026", GOLD, "#4a0714", { fontSize: 24, letterSpacing: 5, fontWeight: 700 }, 60, 0.58),
    C(W, "The Royal Palace · Jaipur", 912, { fontFamily: "Cormorant Garamond", fontSize: 26, color: "#f3d9a4" }),
  ]),
};

export const weddingTemplatesV2: SeedTemplate[] = [
  ganeshaGrand,
  mangalVivaah,
  whiteRedMandala,
  gathbandhan,
  royalMaroon,
  archFloral,
  goldLuxe,
  blushMinimal,
  couplePhoto,
  mehendiCarnival,
  emeraldGarden,
  pinkPeony,
  hindiTraditional,
  navyGeometric,
  receptionDinner,
  sangeetNeon,
  paisleyRoyal,
];
