import { bunting, border, C, corner, D, divider, dots, glow, ornament, pill, ribbon, S, scatter, seal, T } from "../decor";
const GOLD = "#e0bc6a";
import { artBlend, artPattern } from "./art";
import type { SeedTemplate } from "./types";

const W = 700;
const H = 1000;

/* ════════ LITTLE PRINCE BLUE ════════ */
const littlePrince: SeedTemplate = {
  slug: "little-prince-baby-shower",
  title: "Little Prince Baby Shower",
  category: "baby-shower",
  tags: ["Boy", "Royal"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#d8efff,#a9d8ff)", [
    S("circle", -60, 760, 260, 260, { fill: "#ffffff" }),
    S("circle", 120, 820, 300, 300, { fill: "#f3faff" }),
    S("circle", 400, 780, 280, 280, { fill: "#ffffff" }),
    T("☁️", 40, 30, 160, { fontSize: 78, align: "left" }),
    T("☁️", W - 170, 80, 120, { fontSize: 58, align: "right" }),
    ...seal(W / 2, 210, 132, "#2d6cdf", "👑", 0.5),
    C(W, "Baby Shower", 300, { fontFamily: "Pacifico", fontSize: 82, color: "#2d6cdf", lineHeight: 1.05 }),
    ...pill(W, 420, "FOR A LITTLE PRINCE", "#ffffff", "#2d6cdf", { fontSize: 22, letterSpacing: 5, fontWeight: 700 }, 58, 0.72),
    S("circle", 250, 520, 200, 200, { fill: "#ffffff", stroke: "#2d6cdf", strokeWidth: 4 }),
    T("🧸", 276, 556, 148, { fontSize: 108, align: "center" }),
    C(W, "Honouring mom-to-be Neha", 760, { fontFamily: "Fredoka", fontSize: 27, color: "#1d3f7a" }),
    C(W, "SUN · 12 APRIL · 4 PM", 806, { fontFamily: "Fredoka", fontSize: 25, fontWeight: 600, color: "#2d6cdf" }),
    C(W, "Rainbow Hall, Indore", 848, { fontFamily: "Fredoka", fontSize: 23, color: "#1d3f7a" }),
    ...ornament(W, 908, "🍼 🧸 👼", 42),
  ]),
};

/* ════════ IT'S A GIRL PINK ════════ */
const itsGirl: SeedTemplate = {
  slug: "its-a-girl-baby-shower",
  title: "It's A Girl Baby Shower",
  category: "baby-shower",
  tags: ["Girl", "Modern"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#ffe3ee,#ffc1d8)", [
    S("circle", -60, 760, 260, 260, { fill: "#ffffff" }),
    S("circle", 120, 820, 300, 300, { fill: "#fff5f9" }),
    S("circle", 400, 780, 280, 280, { fill: "#ffffff" }),
    ...scatter(W, [[0, 220], [760, 940]], 20, ["#ff8fb5", "#ffd1e0", "#ffffff"], 44, ["flower", "circle", "heart" as never], 28),
    T("🎀", W / 2 - 40, 40, 80, { fontSize: 68, align: "center" }),
    C(W, "It's a", 140, { fontFamily: "Dancing Script", fontSize: 62, fontWeight: 700, color: "#d9487a" }),
    C(W, "GIRL!", 204, { fontFamily: "Abril Fatface", fontSize: 148, color: "#e5578a", lineHeight: 1 }),
    C(W, "Baby Shower", 392, { fontFamily: "Pacifico", fontSize: 62, color: "#b83266", lineHeight: 1.05 }),
    S("heart", W / 2 - 45, 500, 90, 82, { fill: "#ff8fb5" }),
    C(W, "Come shower Pooja with love", 620, { fontFamily: "Fredoka", fontSize: 27, color: "#8a2d52" }),
    C(W, "SATURDAY · 9 MAY · 5 PM", 668, { fontFamily: "Fredoka", fontSize: 26, fontWeight: 600, color: "#d9487a" }),
    C(W, "Pink Petal Banquet, Surat", 710, { fontFamily: "Fredoka", fontSize: 23, color: "#8a2d52" }),
    ...ornament(W, 788, "👑 🍼 🦄", 42),
  ]),
};

/* ════════ BABY SHOWER ELEMENTS COLLAGE ════════ */
const elementsCollage: SeedTemplate = {
  slug: "baby-shower-elements-collage",
  title: "Baby Shower Pastel Collage",
  category: "baby-shower",
  tags: ["Neutral", "Cartoon"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#f2fbf7,#e4f6ee)", [
    S("circle", -60, -70, 240, 240, { fill: "#cdeedd" }),
    S("circle", 540, 820, 260, 260, { fill: "#cdeedd" }),
    ...bunting(W, 28, ["#9ad8c0", "#ffd77a", "#ffb7c9", "#b9c8ff"]),
    C(W, "Oh Baby!", 100, { fontFamily: "Pacifico", fontSize: 78, color: "#3a8f6f", lineHeight: 1.05 }),
    C(W, "Please join us for a baby shower", 196, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#4b6b5a" }),
    S("rect", 60, 250, 280, 300, { fill: "#ffffff", radius: 20, stroke: "#9ad8c0", strokeWidth: 3 }),
    T("Mom to", 84, 348, 232, { fontSize: 30, fontWeight: 600, color: "#7ab8a0", align: "center", fontFamily: "Poppins" }),
    T("be 🤰", 84, 390, 232, { fontSize: 30, fontWeight: 600, color: "#7ab8a0", align: "center", fontFamily: "Poppins" }),
    S("rect", 360, 250, 280, 300, { fill: "#ffffff", radius: 20, stroke: "#b9c8ff", strokeWidth: 3 }),
    T("Photo 2", 384, 372, 232, { fontSize: 30, fontWeight: 600, color: "#9aa8e0", align: "center", fontFamily: "Poppins" }),
    ...artBlend("baby-elements", 50, 566, 600, 300),
    C(W, "Tanvi & Dev", 856, { fontFamily: "Dancing Script", fontSize: 62, fontWeight: 700, color: "#2f7a5c", lineHeight: 1.05 }),
    C(W, "SAT · 11 JULY · 4 PM · WILLOW HOUSE, GOA", 946, { fontFamily: "Montserrat", fontSize: 14, letterSpacing: 2, color: "#3a8f6f", fontWeight: 700 }),
  ]),
};

/* ════════ GENDER REVEAL ════════ */
const genderReveal: SeedTemplate = {
  slug: "he-or-she-gender-reveal",
  title: "He or She? Gender Reveal",
  category: "baby-shower",
  tags: ["Gender Reveal"],
  featured: true,
  doc: D(W, H, "#bfe3ff", [
    S("rect", 350, 0, 350, H, { fill: "#ffc4dc" }),
    S("circle", 100, 190, 500, 500, { fill: "#ffffff" }),
    S("circle", 125, 215, 450, 450, { fill: "transparent", stroke: "#b8a5e8", strokeWidth: 2 }),
    C(W, "GENDER REVEAL PARTY", 100, { fontFamily: "Montserrat", fontSize: 20, letterSpacing: 7, color: "#4a3b78", fontWeight: 700 }),
    C(W, "He", 290, { fontFamily: "Abril Fatface", fontSize: 126, color: "#3b82f6" }, 150),
    C(W, "or", 430, { fontFamily: "Dancing Script", fontSize: 52, fontWeight: 700, color: "#8b7bc8" }, 150),
    C(W, "She?", 480, { fontFamily: "Abril Fatface", fontSize: 126, color: "#ec4899" }, 150),
    S("heart", 330, 640, 40, 38, { fill: "#8b7bc8" }),
    C(W, "Join us as we find out!", 730, { fontFamily: "Fredoka", fontSize: 31, fontWeight: 600, color: "#2b2352" }),
    C(W, "SAT · 20 JUNE · 5 PM", 786, { fontFamily: "Fredoka", fontSize: 25, color: "#2b2352" }),
    C(W, "The Singh Residence, Chandigarh", 826, { fontFamily: "Fredoka", fontSize: 22, color: "#2b2352" }),
    C(W, "Wear 💙 or 💖 to cast your vote", 898, { fontFamily: "Caveat", fontSize: 34, color: "#2b2352" }),
  ]),
};

/* ════════ GODH BHARAI ════════ */
const godhBharai: SeedTemplate = {
  slug: "godh-bharai-ceremony-card",
  title: "Godh Bharai Ceremony Card",
  category: "baby-shower",
  tags: ["Indian", "Girl", "Hindi"],
  featured: true,
  doc: D(W, H, "linear-gradient(170deg,#fff0f5,#ffd6e3)", [
    S("rect", 30, 30, W - 60, H - 60, { fill: "transparent", stroke: "#c9a24b", strokeWidth: 3, radius: 20 }),
    S("rect", 44, 44, W - 88, H - 88, { fill: "transparent", stroke: "#e5578a", strokeWidth: 1, radius: 14 }),
    ...corner("arc", 32, 32, 130, "#c9a24b"),
    ...corner("arc", W - 162, 32, 130, "#c9a24b", 90),
    ...corner("arc", 32, H - 162, 130, "#c9a24b", 270),
    ...corner("arc", W - 162, H - 162, 130, "#c9a24b", 180),
    ...ornament(W, 70, "🌸 🪔 🌸", 46),
    C(W, "॥ श्री गणेशाय नमः ॥", 152, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#9a6b00" }),
    C(W, "गोद भराई", 200, { fontFamily: "Yatra One", fontSize: 92, color: "#c2185b" }),
    C(W, "Baby Shower Ceremony", 326, { fontFamily: "Playfair Display", fontSize: 33, italic: true, color: "#7a2b4b" }),
    T("🤰", W / 2 - 60, 386, 120, { fontSize: 98, align: "center" }),
    C(W, "With joy and blessings we invite you to", 524, { fontFamily: "Cormorant Garamond", fontSize: 27, color: "#5c2340" }),
    C(W, "shower love on our Mom-to-be", 562, { fontFamily: "Cormorant Garamond", fontSize: 27, color: "#5c2340" }),
    C(W, "Anjali & Vikram", 606, { fontFamily: "Great Vibes", fontSize: 78, color: "#c2185b", lineHeight: 1.05 }),
    ...pill(W, 726, "SUNDAY · 22 NOVEMBER 2026", "#9a6b00", "#fff0f5", { fontSize: 19, letterSpacing: 3 }, 56, 0.8),
    C(W, "Ceremony 11 AM · Lunch 1 PM", 806, { fontFamily: "Cormorant Garamond", fontSize: 26, color: "#5c2340" }),
    C(W, "Gulmohar Lawns, Nagpur", 846, { fontFamily: "Cormorant Garamond", fontSize: 26, color: "#5c2340" }),
    ...ornament(W, 906, "🌺 🌸 🌺", 34),
  ]),
};

/* ════════ TWINKLE STAR ════════ */
const twinkleStar: SeedTemplate = {
  slug: "twinkle-twinkle-star-baby-shower",
  title: "Twinkle Twinkle Star Baby Shower",
  category: "baby-shower",
  tags: ["Neutral", "Boy"],
  doc: D(W, H, "linear-gradient(180deg,#0d1b4c,#27408b)", [
    ...scatter(W, [[0, 200], [780, 1000]], 24, ["#ffd54a", "#fff3b0"], 12, ["star"], 34),
    T("🌙", W / 2 - 50, 80, 100, { fontSize: 88, align: "center" }),
    C(W, "Twinkle, twinkle,", 208, { fontFamily: "Dancing Script", fontSize: 60, fontWeight: 700, color: "#ffd54a" }),
    C(W, "little star", 276, { fontFamily: "Dancing Script", fontSize: 60, fontWeight: 700, color: "#ffd54a" }),
    C(W, "BABY SHOWER", 396, { fontFamily: "Josefin Sans", fontSize: 52, letterSpacing: 8, fontWeight: 700, color: "#ffffff" }),
    ...divider(W, 486, "#ffd54a", "diamond", 200),
    C(W, "Please join us in celebrating", 520, { fontFamily: "Josefin Sans", fontSize: 24, color: "#dbe4ff" }),
    C(W, "the upcoming arrival of", 554, { fontFamily: "Josefin Sans", fontSize: 24, color: "#dbe4ff" }),
    C(W, "Baby Mehra", 596, { fontFamily: "Great Vibes", fontSize: 74, color: "#ffd54a", lineHeight: 1.05 }),
    ...pill(W, 712, "SATURDAY · 14 NOVEMBER · 5 PM", "#ffd54a", "#0d1b4c", { fontSize: 18, letterSpacing: 3, fontWeight: 700 }, 56, 0.82),
    C(W, "Starlight Lounge, Mumbai", 802, { fontFamily: "Josefin Sans", fontSize: 22, color: "#dbe4ff" }),
    ...ornament(W, 880, "⭐ 🌙 ⭐", 38),
  ]),
};

/* ════════ BOHO RAINBOW ════════ */
const bohoRainbow: SeedTemplate = {
  slug: "boho-rainbow-baby-shower",
  title: "Boho Rainbow Baby Shower",
  category: "baby-shower",
  tags: ["Neutral", "Girl"],
  featured: true,
  doc: D(W, H, "#fbf1e6", [
    S("arch", 175, 90, 350, 350, { fill: "#d98e73" }),
    S("arch", 205, 120, 290, 320, { fill: "#e9b79a" }),
    S("arch", 235, 150, 230, 290, { fill: "#f3d3b6" }),
    S("arch", 265, 180, 170, 260, { fill: "#fbf1e6" }),
    S("rect", 150, 440, 400, 3, { fill: "#b8795f" }),
    C(W, "OH BABY", 498, { fontFamily: "Cormorant Garamond", fontSize: 24, letterSpacing: 10, color: "#b8795f", fontWeight: 700 }),
    C(W, "Baby Shower", 536, { fontFamily: "Great Vibes", fontSize: 96, color: "#7a4a3a", lineHeight: 1.05 }),
    C(W, "Come celebrate the sweetest", 668, { fontFamily: "Cormorant Garamond", fontSize: 28, italic: true, color: "#7a4a3a" }),
    C(W, "little rainbow baby", 706, { fontFamily: "Cormorant Garamond", fontSize: 28, italic: true, color: "#7a4a3a" }),
    ...pill(W, 768, "SATURDAY · 7 MARCH · 3 PM", "#b8795f", "#fbf1e6", { fontSize: 17, letterSpacing: 3, fontWeight: 700 }, 54, 0.76),
    C(W, "Willow House, Goa", 858, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 3, color: "#7a4a3a", fontWeight: 700 }),
    ...ornament(W, 906, "🌾 🌸 🌾", 34),
  ]),
};

/* ════════ SAFARI WILD ONE ════════ */
const safari: SeedTemplate = {
  slug: "safari-wild-one-baby-shower",
  title: "Safari Wild One Baby Shower",
  category: "baby-shower",
  tags: ["Neutral", "Kids"],
  doc: D(W, H, "#f6e7c1", [
    S("rect", 0, 800, W, 200, { fill: "#6b8f3a" }),
    S("circle", 520, 60, 150, 150, { fill: "#f4b942" }),
    T("🌴", 30, 730, 120, { fontSize: 96, align: "left" }),
    T("🌴", W - 150, 730, 120, { fontSize: 96, align: "right" }),
    ...ornament(W, 90, "🦁 🐘 🦒", 66),
    C(W, "A WILD ONE", 206, { fontFamily: "Bebas Neue", fontSize: 96, letterSpacing: 4, color: "#5b3a14", lineHeight: 1 }),
    C(W, "is on the way", 316, { fontFamily: "Caveat", fontSize: 68, fontWeight: 700, color: "#6b8f3a", lineHeight: 1 }),
    C(W, "BABY SHOWER", 420, { fontFamily: "Montserrat", fontSize: 25, letterSpacing: 8, color: "#5b3a14", fontWeight: 700 }),
    S("rect", 130, 500, 440, 230, { fill: "#ffffff", radius: 20 }),
    C(W, "Celebrating Ritu & Sameer", 532, { fontFamily: "Baloo 2", fontSize: 27, fontWeight: 700, color: "#5b3a14" }),
    C(W, "SUNDAY · 2 AUGUST · 11 AM", 580, { fontFamily: "Baloo 2", fontSize: 23, color: "#6b8f3a", fontWeight: 700 }),
    C(W, "Jungle Cafe Garden", 624, { fontFamily: "Baloo 2", fontSize: 22, color: "#5b3a14" }),
    C(W, "Hyderabad", 660, { fontFamily: "Baloo 2", fontSize: 22, color: "#5b3a14" }),
  ]),
};

/* ════════ OH BABY SPRINKLE ════════ */
const sprinkle: SeedTemplate = {
  slug: "oh-baby-sprinkle-square",
  title: "Oh Baby! Sprinkle Square",
  category: "baby-shower",
  tags: ["Neutral", "Girl"],
  doc: D(800, 800, "#e4f6ee", [
    ...scatter(800, [[0, 140], [660, 790]], 34, ["#ffb7c9", "#ffd77a", "#9ad8c0", "#b9c8ff"], 21, ["circle", "star", "flower"], 26),
    S("circle", 150, 140, 500, 500, { fill: "#ffffff" }),
    S("circle", 170, 160, 460, 460, { fill: "transparent", stroke: "#9ad8c0", strokeWidth: 3 }),
    C(800, "BABY SPRINKLE", 230, { fontFamily: "Montserrat", fontSize: 20, letterSpacing: 8, color: "#3a8f6f", fontWeight: 700 }, 200),
    C(800, "Oh", 274, { fontFamily: "Abril Fatface", fontSize: 118, color: "#f08aa5", lineHeight: 1 }, 200),
    C(800, "Baby!", 384, { fontFamily: "Pacifico", fontSize: 96, color: "#3a8f6f", lineHeight: 1.1 }, 200),
    C(800, "for Tanvi & Dev", 518, { fontFamily: "Dancing Script", fontSize: 40, fontWeight: 700, color: "#6b7280" }, 200),
    C(800, "SAT 11 JULY · 4 PM", 576, { fontFamily: "Montserrat", fontSize: 18, letterSpacing: 3, color: "#1f2937", fontWeight: 700 }, 200),
  ]),
};

/* ════════ BABY SHOWER PHOTO CIRCLE ════════ */
const photoCircle: SeedTemplate = {
  slug: "baby-shower-photo-circle",
  title: "Baby Shower Photo Circle",
  category: "baby-shower",
  tags: ["Photo Collage", "Neutral"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#eaf4ff,#fde8f3)", [
    ...bunting(W, 26, ["#ffb7c9", "#b9c8ff", "#9ad8c0", "#ffd77a"]),
    C(W, "A Baby is Brewing", 96, { fontFamily: "Pacifico", fontSize: 70, color: "#6b8fb5", lineHeight: 1.05 }),
    S("circle", W / 2 - 165, 220, 330, 330, { fill: "#ffffff", stroke: "#b9c8ff", strokeWidth: 5 }),
    T("Scan", W / 2 - 120, 336, 240, { fontSize: 46, fontWeight: 700, color: "#b9c8ff", align: "center", fontFamily: "Poppins" }),
    T("photo", W / 2 - 120, 400, 240, { fontSize: 46, fontWeight: 700, color: "#b9c8ff", align: "center", fontFamily: "Poppins" }),
    ...artBlend("baby-elements", 60, 556, 580, 300, { opacity: 0.95 }),
    C(W, "Please join us for a baby shower honouring", 866, { fontFamily: "Cormorant Garamond", fontSize: 25, italic: true, color: "#5a6b8a" }),
    C(W, "Priya Sharma", 904, { fontFamily: "Dancing Script", fontSize: 58, fontWeight: 700, color: "#e57ba5", lineHeight: 1.05 }),
    C(W, "SUN · 8 MARCH · 5 PM", 976, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 4, color: "#6b8fb5", fontWeight: 700 }),
  ]),
};

/* ════════ MANDALA GIRL ════════ */
const mandalaGirl: SeedTemplate = {
  slug: "mandala-pink-baby-shower",
  title: "Mandala Pink Baby Shower",
  category: "baby-shower",
  tags: ["Girl", "Mandala"],
  doc: D(W, H, "#ffffff", [
    ...artPattern("paisley", 0, 0, W, 210),
    ...artPattern("paisley", 0, H - 210, W, 210),
    C(W, "// Shree Ganeshaya Namah //", 234, { fontFamily: "Cormorant Garamond", fontSize: 23, italic: true, color: "#8c1c2e" }),
    C(W, "Welcome", 272, { fontFamily: "Great Vibes", fontSize: 80, color: "#ad1457", lineHeight: 1.05 }),
    C(W, "Little Princess", 368, { fontFamily: "Playfair Display", fontSize: 52, fontWeight: 700, color: "#8c1c2e", lineHeight: 1.05 }),
    ...divider(W, 452, "#c9a24b", "floral", 220),
    T("👶🎀", W / 2 - 100, 470, 200, { fontSize: 80, align: "center" }),
    C(W, "We are delighted to invite you and your", 592, { fontFamily: "Cormorant Garamond", fontSize: 24, italic: true, color: "#4b3a2a" }),
    C(W, "family to grace the occasion of our", 628, { fontFamily: "Cormorant Garamond", fontSize: 24, italic: true, color: "#4b3a2a" }),
    C(W, "Baby Shower", 672, { fontFamily: "Playfair Display", fontSize: 54, fontWeight: 700, color: "#c2185b", lineHeight: 1.05 }),
    C(W, "SUNDAY · 9 AUGUST 2026", 756, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 4, color: "#8c1c2e", fontWeight: 700 }),
    C(W, "Pink Petal Banquet, Surat", 800, { fontFamily: "Playfair Display", fontSize: 25, color: "#4b3a2a" }),
  ]),
};

export const babyShowerTemplates: SeedTemplate[] = [
  littlePrince,
  itsGirl,
  elementsCollage,
  genderReveal,
  godhBharai,
  twinkleStar,
  bohoRainbow,
  safari,
  sprinkle,
  photoCircle,
  mandalaGirl,
];

/* ════════ MORE BABY SHOWER TEMPLATES ════════ */
const godhBharaiMandala: SeedTemplate = {
  slug: "godh-bharai-mandala-card",
  title: "Godh Bharai Mandala Card",
  category: "baby-shower",
  tags: ["Indian", "Girl", "Mandala"],
  featured: true,
  doc: D(W, H, "#ffffff", [
    ...artPattern("paisley", 0, 0, W, 210),
    ...artPattern("paisley", 0, H - 210, W, 210),
    C(W, "// Shree Ganeshaya Namah //", 234, { fontFamily: "Cormorant Garamond", fontSize: 23, italic: true, color: "#8c1c2e" }),
    ...artBlend("ganesha-gold", W / 2 - 82, 272, 164, 164),
    C(W, "We are delighted to invite you and your", 464, { fontFamily: "Cormorant Garamond", fontSize: 25, italic: true, color: "#4b3a2a" }),
    C(W, "family to grace the occasion of", 500, { fontFamily: "Cormorant Garamond", fontSize: 25, italic: true, color: "#4b3a2a" }),
    C(W, "Godh Bharai", 540, { fontFamily: "Playfair Display", fontSize: 58, fontWeight: 700, color: "#c2185b", lineHeight: 1.05 }),
    ...divider(W, 628, "#8c1c2e", "floral", 220),
    C(W, "SUNDAY · 22 NOVEMBER 2026", 664, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 4, color: "#8c1c2e", fontWeight: 700 }),
    C(W, "11 AM · Gulmohar Lawns, Nagpur", 706, { fontFamily: "Playfair Display", fontSize: 24, color: "#4b3a2a" }),
    ...pill(W, 764, "RSVP · 98765 43210", "#8c1c2e", "#ffffff", { fontSize: 18, letterSpacing: 3 }, 54, 0.64),
  ]),
};

const princeRoyalBlue: SeedTemplate = {
  slug: "royal-prince-blue-baby-shower",
  title: "Royal Prince Blue Baby Shower",
  category: "baby-shower",
  tags: ["Boy", "Royal"],
  doc: D(W, H, "linear-gradient(165deg,#0b2d5c,#1b4f8f 55%,#0b2d5c)", [
    ...glow(W / 2 - 220, 80, 440, "#8fc9ff", 0.28),
    ...border(W, H, GOLD, { inset: 28, gap: 14, weight: 1.8 }),
    ...corner("dots", 36, 36, 110, GOLD),
    ...corner("dots", W - 146, 36, 110, GOLD),
    ...corner("dots", 36, H - 146, 110, GOLD),
    ...corner("dots", W - 146, H - 146, 110, GOLD),
    ...seal(W / 2, 190, 130, GOLD, "👑", 0.5),
    C(W, "A BABY SHOWER FOR", 296, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 8, color: GOLD, fontWeight: 700 }),
    C(W, "OUR LITTLE", 336, { fontFamily: "Cinzel", fontSize: 54, color: "#f7f1e1", letterSpacing: 4, lineHeight: 1.05 }),
    C(W, "PRINCE", 402, { fontFamily: "Cinzel", fontSize: 74, color: GOLD, letterSpacing: 6, lineHeight: 1.05 }),
    ...divider(W, 516, GOLD, "diamond", 210),
    C(W, "Honouring mom-to-be Neha", 552, { fontFamily: "Cormorant Garamond", fontSize: 28, italic: true, color: "#e8f0ff" }),
    ...pill(W, 614, "SUNDAY · 12 APRIL · 4 PM", GOLD, "#0b2d5c", { fontSize: 20, letterSpacing: 3, fontWeight: 700 }, 58, 0.72),
    C(W, "Rainbow Hall, Indore", 706, { fontFamily: "Cormorant Garamond", fontSize: 27, color: "#e8f0ff" }),
    ...ornament(W, 790, "🍼 👑 🍼", 40),
  ]),
};

const twinsJoy: SeedTemplate = {
  slug: "twice-the-joy-twins-baby-shower",
  title: "Twice The Joy Twins Baby Shower",
  category: "baby-shower",
  tags: ["Neutral", "Modern"],
  doc: D(W, H, "linear-gradient(180deg,#eaf4ff,#fdf0f7)", [
    ...bunting(W, 26, ["#b9c8ff", "#ffb7c9", "#9ad8c0", "#ffd77a"]),
    C(W, "Twice the", 100, { fontFamily: "Great Vibes", fontSize: 84, color: "#6b8fb5", lineHeight: 1.05 }),
    C(W, "JOY!", 200, { fontFamily: "Abril Fatface", fontSize: 130, color: "#e57ba5", lineHeight: 1 }),
    C(W, "Twins on the way!", 356, { fontFamily: "Fredoka", fontSize: 38, fontWeight: 600, color: "#6b8fb5" }),
    S("circle", 130, 440, 190, 190, { fill: "#ffffff", stroke: "#b9c8ff", strokeWidth: 4 }),
    T("💙", 172, 486, 106, { fontSize: 76, align: "center" }),
    S("circle", 380, 440, 190, 190, { fill: "#ffffff", stroke: "#ffb7c9", strokeWidth: 4 }),
    T("💖", 422, 486, 106, { fontSize: 76, align: "center" }),
    ...artBlend("baby-elements", 70, 648, 560, 280, { opacity: 0.9 }),
    C(W, "Baby Shower for Priya", 900, { fontFamily: "Dancing Script", fontSize: 50, fontWeight: 700, color: "#5a6b8a", lineHeight: 1.05 }),
    C(W, "SAT · 18 JULY · 5 PM", 968, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 4, color: "#6b8fb5", fontWeight: 700 }),
  ]),
};

const welcomeBabyHindi: SeedTemplate = {
  slug: "welcome-baby-hindi-shower",
  title: "Welcome Baby Hindi Shower",
  category: "baby-shower",
  tags: ["Hindi", "Indian"],
  doc: D(W, H, "linear-gradient(180deg,#fff4d6,#ffe0b2)", [
    S("rect", 26, 26, W - 52, H - 52, { fill: "transparent", stroke: "#e07b00", strokeWidth: 3, radius: 24 }),
    ...corner("petal", 14, 14, 120, "#f59f00", 15),
    ...corner("petal", W - 134, 14, 120, "#f59f00", -15),
    ...corner("petal", 14, H - 134, 120, "#f59f00", 165),
    ...corner("petal", W - 134, H - 134, 120, "#f59f00", 195),
    ...ornament(W, 68, "🍼 🎀 🍼", 44),
    C(W, "सीमंतोन्नयन", 142, { fontFamily: "Yatra One", fontSize: 80, color: "#b25a00" }),
    C(W, "Baby Shower Ceremony", 262, { fontFamily: "Playfair Display", fontSize: 32, italic: true, color: "#6b3a00" }),
    T("🤰", W / 2 - 60, 322, 120, { fontSize: 96, align: "center" }),
    C(W, "आने वाले नन्हे मेहमान के स्वागत में", 452, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#5a2d0c" }),
    C(W, "आप सभी सादर आमंत्रित हैं", 492, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#5a2d0c" }),
    C(W, "Anjali & Vikram", 540, { fontFamily: "Great Vibes", fontSize: 80, color: "#b25a00", lineHeight: 1.05 }),
    ...pill(W, 656, "रविवार · 22 नवम्बर 2026", "#b25a00", "#fff4d6", { fontFamily: "Tiro Devanagari Hindi", fontSize: 21 }, 58, 0.74),
    C(W, "सुबह 11 बजे · गुलमोहर लॉन, नागपुर", 748, { fontFamily: "Tiro Devanagari Hindi", fontSize: 25, color: "#5a2d0c" }),
    ...ornament(W, 826, "🌺 🌸 🌺", 36),
  ]),
};

const sunflowerBaby: SeedTemplate = {
  slug: "sunflower-baby-shower",
  title: "Sunflower Baby Shower",
  category: "baby-shower",
  tags: ["Neutral", "Floral"],
  doc: D(W, H, "linear-gradient(180deg,#fffdf0,#fff4c4)", [
    ...scatter(W, [[0, 240], [800, 1000]], 20, ["#f4b942", "#e8a33d", "#7cb342"], 55, ["flower", "circle", "leaf"], 30),
    S("rect", 26, 26, W - 52, H - 52, { fill: "transparent", stroke: "#e8a33d", strokeWidth: 3, radius: 26 }),
    T("🌻", W / 2 - 60, 70, 120, { fontSize: 92, align: "center" }),
    C(W, "A Little Sunflower", 200, { fontFamily: "Cormorant Garamond", fontSize: 32, italic: true, color: "#8a6b3a" }),
    C(W, "is Growing", 244, { fontFamily: "Great Vibes", fontSize: 92, color: "#e8a33d", lineHeight: 1.05 }),
    ...divider(W, 380, "#e8a33d", "floral", 220),
    C(W, "BABY SHOWER", 412, { fontFamily: "Montserrat", fontSize: 24, letterSpacing: 8, color: "#6b8f3a", fontWeight: 700 }),
    C(W, "Please join us to celebrate", 470, { fontFamily: "Poppins", fontSize: 22, color: "#6b5a3a" }),
    C(W, "Ritu & Sameer", 512, { fontFamily: "Dancing Script", fontSize: 66, fontWeight: 700, color: "#e8a33d", lineHeight: 1.05 }),
    S("rect", 120, 610, W - 240, 220, { fill: "#ffffff", radius: 24, stroke: "#f4b942", strokeWidth: 2 }),
    C(W, "SUNDAY · 2 AUGUST · 11 AM", 642, { fontFamily: "Poppins", fontSize: 25, fontWeight: 700, color: "#8a6b3a" }),
    C(W, "Jungle Cafe Garden", 688, { fontFamily: "Poppins", fontSize: 22, color: "#6b5a3a" }),
    C(W, "Hyderabad", 722, { fontFamily: "Poppins", fontSize: 22, color: "#6b5a3a" }),
    ...ornament(W, 862, "🌻 🌼 🌻", 40),
  ]),
};

const moonStarsBoy: SeedTemplate = {
  slug: "over-the-moon-baby-shower",
  title: "Over The Moon Baby Shower",
  category: "baby-shower",
  tags: ["Boy", "Modern"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#1a2b6b,#2d4a9e 55%,#101c4a)", [
    ...scatter(W, [[0, 260], [780, 1000]], 26, ["#ffd54a", "#fff3b0", "#ffffff"], 33, ["star", "circle"], 26),
    S("circle", W / 2 - 100, 100, 200, 200, { fill: "#f7f1e1" }),
    S("circle", W / 2 - 40, 130, 160, 160, { fill: "#1a2b6b" }),
    C(W, "OVER", 200, { fontFamily: "Montserrat", fontSize: 18, letterSpacing: 8, color: "#ffd54a", fontWeight: 700 }),
    C(W, "THE MOON", 240, { fontFamily: "Bebas Neue", fontSize: 96, color: "#ffffff", letterSpacing: 4, lineHeight: 1 }),
    C(W, "Excited to welcome our baby boy", 366, { fontFamily: "Cormorant Garamond", fontSize: 27, italic: true, color: "#dbe4ff" }),
    ...divider(W, 430, "#ffd54a", "diamond", 210),
    C(W, "BABY SHOWER", 466, { fontFamily: "Josefin Sans", fontSize: 44, letterSpacing: 8, fontWeight: 700, color: "#ffd54a" }),
    C(W, "for Kavita & Rohit", 540, { fontFamily: "Dancing Script", fontSize: 58, fontWeight: 700, color: "#ffffff", lineHeight: 1.05 }),
    ...pill(W, 640, "SAT · 14 NOVEMBER · 5 PM", "#ffd54a", "#1a2b6b", { fontSize: 19, letterSpacing: 3, fontWeight: 700 }, 56, 0.76),
    C(W, "Starlight Lounge, Mumbai", 728, { fontFamily: "Josefin Sans", fontSize: 22, color: "#dbe4ff" }),
    ...ornament(W, 806, "🌙 ⭐ 🌙", 38),
  ]),
};

export const babyShowerTemplatesExtra: SeedTemplate[] = [
  godhBharaiMandala,
  princeRoyalBlue,
  twinsJoy,
  welcomeBabyHindi,
  sunflowerBaby,
  moonStarsBoy,
];
