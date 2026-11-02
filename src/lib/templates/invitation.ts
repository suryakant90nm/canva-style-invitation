import { bunting, border, C, corner, D, divider, dots, glow, ornament, pill, ribbon, S, scatter, seal, T } from "../decor";
import { artBlend, artPattern } from "./art";
import type { SeedTemplate } from "./types";

const W = 700;
const H = 1000;

/* ════════ DIWALI DIYA ════════ */
const diwaliDiya: SeedTemplate = {
  slug: "diwali-diya-festival-invite",
  title: "Diwali Diya Festival Invite",
  category: "invitation",
  tags: ["Festival", "Diwali", "Hindi"],
  featured: true,
  doc: D(W, H, "linear-gradient(170deg,#2b0a3d,#6a1b4d 55%,#c2410c)", [
    ...scatter(W, [[0, 160], [860, 990]], 22, ["#ffd54a", "#ff9f1c", "#ffffff"], 11, ["star", "circle"], 24),
    ...ornament(W, 56, "✨ 🪔 ✨", 50),
    C(W, "शुभ दीपावली", 140, { fontFamily: "Yatra One", fontSize: 74, color: "#ffd54a" }),
    C(W, "Diwali", 248, { fontFamily: "Abril Fatface", fontSize: 124, color: "#ffffff", lineHeight: 1 }),
    C(W, "DHAMAKA PARTY", 392, { fontFamily: "Montserrat", fontSize: 34, fontWeight: 700, letterSpacing: 8, color: "#ff9f1c" }),
    ...divider(W, 486, "#ffd54a", "diamond", 210),
    ...artBlend("diya", 120, 498, 460, 300, { opacity: 0.95 }),
    C(W, "Join us for lights, laughter,", 812, { fontFamily: "Cormorant Garamond", fontSize: 27, color: "#fde7c8" }),
    C(W, "sweets & card games!", 848, { fontFamily: "Cormorant Garamond", fontSize: 27, color: "#fde7c8" }),
    ...pill(W, 902, "SAT · 1 NOV · 7 PM", "#ffd54a", "#2b0a3d", { fontSize: 19, letterSpacing: 3, fontWeight: 700 }, 54, 0.66),
  ]),
};

/* ════════ GRIHA PRAVESH ════════ */
const grihaPravesh: SeedTemplate = {
  slug: "griha-pravesh-housewarming",
  title: "Griha Pravesh Housewarming",
  category: "invitation",
  tags: ["Housewarming", "Hindi"],
  featured: true,
  doc: D(W, H, "#fff7e6", [
    S("rect", 30, 30, W - 60, H - 60, { fill: "transparent", stroke: "#c9791b", strokeWidth: 3 }),
    S("rect", 44, 44, W - 88, H - 88, { fill: "transparent", stroke: "#e3b26b", strokeWidth: 1 }),
    ...corner("arc", 32, 32, 130, "#c9791b"),
    ...corner("arc", W - 162, 32, 130, "#c9791b", 90),
    ...corner("arc", 32, H - 162, 130, "#c9791b", 270),
    ...corner("arc", W - 162, H - 162, 130, "#c9791b", 180),
    ...ornament(W, 72, "🕉️", 46),
    C(W, "गृह प्रवेश", 140, { fontFamily: "Yatra One", fontSize: 84, color: "#b8560a" }),
    C(W, "Housewarming Ceremony", 262, { fontFamily: "Playfair Display", fontSize: 34, italic: true, color: "#6b3a00" }),
    ...artBlend("ganesha-gold", W / 2 - 88, 320, 176, 176),
    C(W, "With the blessings of the Almighty, we", 530, { fontFamily: "Cormorant Garamond", fontSize: 25, color: "#6b3a00" }),
    C(W, "cordially invite you to the Griha Pravesh", 566, { fontFamily: "Cormorant Garamond", fontSize: 25, color: "#6b3a00" }),
    C(W, "of our new home", 602, { fontFamily: "Cormorant Garamond", fontSize: 25, color: "#6b3a00" }),
    ...pill(W, 650, "SUNDAY · 15 MARCH 2026", "#b8560a", "#fff7e6", { fontSize: 19, letterSpacing: 3 }, 56, 0.78),
    C(W, "Puja 10:00 AM · Lunch 1:00 PM", 734, { fontFamily: "Cormorant Garamond", fontSize: 26, color: "#6b3a00" }),
    C(W, "Flat 402, Sunrise Heights, Baner, Pune", 776, { fontFamily: "Cormorant Garamond", fontSize: 25, color: "#6b3a00" }),
    ...ornament(W, 856, "🪔 🌺 🪔", 36),
  ]),
};

/* ════════ BIRTHDAY CONFETTI ════════ */
const confettiBash: SeedTemplate = {
  slug: "birthday-confetti-bash",
  title: "Birthday Confetti Bash",
  category: "invitation",
  tags: ["Birthday", "Party"],
  featured: true,
  doc: D(W, H, "#fff1b8", [
    ...scatter(W, [[0, 200], [820, 990]], 32, ["#ff5e7e", "#3ec5c1", "#ffb400", "#7b61ff", "#ff8a3d"], 7, ["circle", "star", "rect", "triangle", "diamond"], 22),
    ...ornament(W, 66, "🎈 🎂 🎈", 52),
    C(W, "YOU'RE INVITED TO", 190, { fontFamily: "Fredoka", fontSize: 24, fontWeight: 600, letterSpacing: 5, color: "#ff5e7e" }),
    C(W, "Aanya's", 236, { fontFamily: "Lobster", fontSize: 96, color: "#7b61ff", lineHeight: 1.05 }),
    C(W, "5th Birthday", 356, { fontFamily: "Lobster", fontSize: 82, color: "#ff5e7e", lineHeight: 1.05 }),
    S("rect", 110, 490, 480, 260, { fill: "#ffffff", radius: 30 }),
    C(W, "SUNDAY, 8 MARCH", 522, { fontFamily: "Fredoka", fontSize: 31, fontWeight: 600, color: "#1f2a44" }),
    C(W, "4:00 PM – 7:00 PM", 572, { fontFamily: "Fredoka", fontSize: 25, color: "#1f2a44" }),
    C(W, "Fun Zone Party Hall, 12 Park Street", 620, { fontFamily: "Fredoka", fontSize: 22, color: "#6b7280" }),
    C(W, "Games · Cake · Return gifts!", 700, { fontFamily: "Caveat", fontSize: 40, fontWeight: 700, color: "#ff8a3d" }),
    ...ornament(W, 880, "🎉 🎁 🎉", 44),
  ]),
};

/* ════════ ELEGANT BLACK GOLD ════════ */
const elegantBlack: SeedTemplate = {
  slug: "elegant-black-gold-dinner",
  title: "Elegant Black & Gold Dinner",
  category: "invitation",
  tags: ["Dinner", "Royal"],
  doc: D(W, H, "#111111", [
    ...glow(W / 2 - 220, 60, 440, "#d4af37", 0.16),
    S("rect", 36, 36, W - 72, H - 72, { fill: "transparent", stroke: "#c9a24b", strokeWidth: 1.5 }),
    S("rect", 48, 48, W - 96, H - 96, { fill: "transparent", stroke: "#c9a24b", strokeWidth: 0.8 }),
    ...corner("dots", 44, 44, 110, "#c9a24b"),
    ...corner("dots", W - 154, 44, 110, "#c9a24b"),
    ...corner("dots", 44, H - 154, 110, "#c9a24b"),
    ...corner("dots", W - 154, H - 154, 110, "#c9a24b"),
    C(W, "YOU ARE CORDIALLY INVITED", 152, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 7, color: "#c9a24b", fontWeight: 700 }),
    C(W, "An Evening of", 214, { fontFamily: "Cormorant Garamond", fontSize: 38, italic: true, color: "#f1e7d0" }),
    C(W, "FINE DINING", 262, { fontFamily: "Cinzel", fontSize: 74, color: "#c9a24b", letterSpacing: 4, lineHeight: 1.05 }),
    ...divider(W, 382, "#c9a24b", "diamond", 220),
    C(W, "Hosted by Mr. & Mrs. Kapoor", 428, { fontFamily: "Cormorant Garamond", fontSize: 29, color: "#f1e7d0" }),
    C(W, "FRIDAY · 20 NOVEMBER", 500, { fontFamily: "Cinzel", fontSize: 29, letterSpacing: 4, color: "#c9a24b" }),
    C(W, "7:30 in the evening", 548, { fontFamily: "Cormorant Garamond", fontSize: 27, italic: true, color: "#f1e7d0" }),
    C(W, "The Oberoi Terrace, New Delhi", 596, { fontFamily: "Cormorant Garamond", fontSize: 28, color: "#f1e7d0" }),
    ...pill(W, 668, "DRESS CODE · BLACK TIE", "#c9a24b", "#111111", { fontSize: 18, letterSpacing: 4, fontWeight: 700 }, 56, 0.74),
    C(W, "Kindly RSVP · 98100 22334", 764, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 3, color: "#c9a24b" }),
    ...ornament(W, 852, "🍷 ✦ 🥂", 38),
  ]),
};

/* ════════ POOL PARTY SPLASH ════════ */
const poolParty: SeedTemplate = {
  slug: "pool-party-splash",
  title: "Pool Party Splash",
  category: "invitation",
  tags: ["Party", "Summer"],
  doc: D(W, H, "linear-gradient(180deg,#8fe3ff,#1aa7d8)", [
    S("circle", -80, 780, 300, 300, { fill: "rgba(255,255,255,0.25)" }),
    S("circle", 200, 860, 340, 340, { fill: "rgba(255,255,255,0.2)" }),
    S("circle", 480, 760, 300, 300, { fill: "rgba(255,255,255,0.25)" }),
    S("circle", 70, 80, 110, 110, { fill: "#ffd54a" }),
    T("🌴", W - 170, 60, 100, { fontSize: 88, align: "right" }),
    C(W, "POOL PARTY!", 240, { fontFamily: "Pacifico", fontSize: 86, color: "#ffffff", lineHeight: 1.1 }),
    C(W, "Come make a splash with us", 490, { fontFamily: "Fredoka", fontSize: 29, color: "#073b52" }),
    S("rect", 120, 560, 460, 190, { fill: "#ffffff", radius: 95 }),
    C(W, "SAT, 25 APRIL · 3 PM", 592, { fontFamily: "Fredoka", fontSize: 27, fontWeight: 600, color: "#0b7ba3" }),
    C(W, "Blue Lagoon Resort", 640, { fontFamily: "Fredoka", fontSize: 27, color: "#073b52" }),
    C(W, "Bring towels & sunscreen", 686, { fontFamily: "Fredoka", fontSize: 20, color: "#6b7280" }),
    ...ornament(W, 800, "🏊 🍉 🕶️ 🍹", 48),
  ]),
};

/* ════════ NEON NIGHT ════════ */
const neonNight: SeedTemplate = {
  slug: "neon-night-party",
  title: "Neon Night Party",
  category: "invitation",
  tags: ["Party", "Modern"],
  doc: D(W, H, "linear-gradient(160deg,#1a0b3b,#3d0f5c 55%,#10163f)", [
    S("circle", 420, -80, 360, 360, { fill: "rgba(255,0,153,0.35)" }),
    S("circle", -120, 620, 420, 420, { fill: "rgba(0,229,255,0.22)" }),
    S("rect", 70, 100, W - 140, 800, { fill: "transparent", stroke: "#ff3dac", strokeWidth: 4, radius: 10 }),
    S("rect", 86, 116, W - 172, 768, { fill: "transparent", stroke: "#27e6ff", strokeWidth: 2, radius: 6 }),
    C(W, "ONE NIGHT ONLY", 172, { fontFamily: "Montserrat", fontSize: 18, letterSpacing: 8, color: "#27e6ff" }),
    C(W, "NEON", 222, { fontFamily: "Bebas Neue", fontSize: 146, color: "#ffffff", lineHeight: 0.95, letterSpacing: 6 }),
    C(W, "NIGHT", 378, { fontFamily: "Bebas Neue", fontSize: 146, color: "#ff3dac", lineHeight: 0.95, letterSpacing: 6 }),
    C(W, "HOUSE PARTY", 566, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 5, color: "#ff3dac", fontWeight: 700 }),
    C(W, "KABIR'S B'DAY", 606, { fontFamily: "Bebas Neue", fontSize: 66, color: "#27e6ff", letterSpacing: 3 }),
    C(W, "SAT · 30 MAY · 9 PM TILL LATE", 716, { fontFamily: "Montserrat", fontSize: 18, letterSpacing: 3, color: "#ffffff", fontWeight: 700 }),
    C(W, "Club Pulse, Bandra West", 760, { fontFamily: "Montserrat", fontSize: 18, color: "#d6c6ff" }),
    ...pill(W, 818, "DRESS CODE · GLOW & NEON", "#27e6ff", "#1a0b3b", { fontSize: 18, letterSpacing: 3, fontWeight: 700 }, 56, 0.78),
  ]),
};

/* ════════ PARTY PHOTO GRID ════════ */
const photoGrid: SeedTemplate = {
  slug: "party-photo-grid-invite",
  title: "Party Photo Grid Invite",
  category: "invitation",
  tags: ["Photo Collage", "Party"],
  featured: true,
  doc: D(W, H, "#1b1030", [
    S("rect", 40, 40, 620, 380, { fill: "#2a1a48", stroke: "#27e6ff", strokeWidth: 2 }),
    T("Add main", 80, 190, 540, { fontSize: 44, fontWeight: 700, color: "#27e6ff", align: "center", fontFamily: "Poppins" }),
    T("photo", 80, 250, 540, { fontSize: 44, fontWeight: 700, color: "#27e6ff", align: "center", fontFamily: "Poppins" }),
    S("rect", 40, 432, 300, 250, { fill: "#2a1a48", stroke: "#ff3dac", strokeWidth: 2 }),
    T("Photo 2", 70, 536, 240, { fontSize: 30, fontWeight: 600, color: "#ff3dac", align: "center", fontFamily: "Poppins" }),
    S("rect", 360, 432, 300, 250, { fill: "#2a1a48", stroke: "#ff3dac", strokeWidth: 2 }),
    T("Photo 3", 390, 536, 240, { fontSize: 30, fontWeight: 600, color: "#ff3dac", align: "center", fontFamily: "Poppins" }),
    C(W, "YOU'RE INVITED", 724, { fontFamily: "Montserrat", fontSize: 18, letterSpacing: 8, color: "#27e6ff", fontWeight: 700 }),
    C(W, "HOUSE PARTY", 762, { fontFamily: "Bebas Neue", fontSize: 74, color: "#ffffff", letterSpacing: 3, lineHeight: 1 }),
    C(W, "SATURDAY · 30 MAY · 8 PM", 876, { fontFamily: "Montserrat", fontSize: 20, fontWeight: 700, color: "#ff3dac", letterSpacing: 2 }),
    C(W, "Rooftop 21, Bandra West, Mumbai", 916, { fontFamily: "Montserrat", fontSize: 17, color: "#d6c6ff" }),
  ]),
};

/* ════════ ANNAPRASHAN / FESTIVAL MANDALA ════════ */
const festivalMandala: SeedTemplate = {
  slug: "festival-mandala-invite",
  title: "Festival Mandala Invite",
  category: "invitation",
  tags: ["Festival", "Mandala"],
  featured: true,
  doc: D(W, H, "#ffffff", [
    ...artPattern("paisley", 0, 0, W, 210),
    ...artPattern("paisley", 0, H - 210, W, 210),
    C(W, "// Shree Ganeshaya Namah //", 234, { fontFamily: "Cormorant Garamond", fontSize: 23, italic: true, color: "#8c1c2e" }),
    ...artBlend("ganesha-gold", W / 2 - 78, 268, 156, 156),
    C(W, "We are delighted to invite you and your", 452, { fontFamily: "Cormorant Garamond", fontSize: 24, italic: true, color: "#4b3a2a" }),
    C(W, "family to grace the occasion of", 488, { fontFamily: "Cormorant Garamond", fontSize: 24, italic: true, color: "#4b3a2a" }),
    C(W, "Annprashan", 532, { fontFamily: "Playfair Display", fontSize: 56, fontWeight: 700, color: "#c2185b", lineHeight: 1.05 }),
    ...divider(W, 618, "#8c1c2e", "floral", 220),
    C(W, "SUNDAY · 22 MARCH 2026", 654, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 4, color: "#8c1c2e", fontWeight: 700 }),
    C(W, "11 AM · Gupta Mansion, Varanasi", 696, { fontFamily: "Playfair Display", fontSize: 25, color: "#4b3a2a" }),
    ...pill(W, 758, "RSVP · 98765 43210", "#8c1c2e", "#ffffff", { fontSize: 18, letterSpacing: 3 }, 54, 0.64),
  ]),
};



/* ════════ MORE INVITATION TEMPLATES ════════ */
const housePartyNeon: SeedTemplate = {
  slug: "house-party-neon-invite",
  title: "House Party Neon Invite",
  category: "invitation",
  tags: ["Party", "Modern"],
  doc: D(W, H, "linear-gradient(165deg,#160b2e,#3a1160 55%,#0d0620)", [
    ...glow(W / 2 - 240, 60, 480, "#ff3dac", 0.28),
    ...glow(W / 2 - 180, 620, 360, "#27e6ff", 0.2),
    S("rect", 60, 100, W - 120, H - 200, { fill: "transparent", stroke: "#ff3dac", strokeWidth: 3, radius: 14 }),
    S("rect", 76, 116, W - 152, H - 232, { fill: "transparent", stroke: "#27e6ff", strokeWidth: 1.6, radius: 10 }),
    ...scatter(W, [[0, 200], [820, 1000]], 20, ["#ff3dac", "#27e6ff", "#ffe066"], 99, ["star", "circle", "diamond"], 22),
    C(W, "♬ ♫ ♬", 130, { fontSize: 44, color: "#27e6ff" }),
    C(W, "HOUSE PARTY", 200, { fontFamily: "Bebas Neue", fontSize: 108, color: "#ffffff", letterSpacing: 5, lineHeight: 1 }),
    C(W, "LET'S GET LOUD", 328, { fontFamily: "Montserrat", fontSize: 22, letterSpacing: 8, color: "#ff3dac", fontWeight: 700 }),
    ...divider(W, 400, "#27e6ff", "wave", 230),
    C(W, "HOSTED BY KABIR", 436, { fontFamily: "Montserrat", fontSize: 17, letterSpacing: 5, color: "#ffe066", fontWeight: 700 }),
    ...pill(W, 486, "SAT · 30 MAY · 9 PM", "#27e6ff", "#160b2e", { fontSize: 21, letterSpacing: 3, fontWeight: 700 }, 58, 0.68),
    C(W, "Rooftop 21, Bandra West", 578, { fontFamily: "Montserrat", fontSize: 18, color: "#d6c6ff" }),
    C(W, "Music · Food · Games", 618, { fontFamily: "Montserrat", fontSize: 17, color: "#ffffff" }),
    ...pill(W, 676, "DRESS CODE · NEON", "#ff3dac", "#ffffff", { fontSize: 19, letterSpacing: 3, fontWeight: 700 }, 56, 0.7),
    ...ornament(W, 800, "🎉 🪩 🎉", 44),
  ]),
};

const mehendiInvite: SeedTemplate = {
  slug: "mehendi-invitation-floral",
  title: "Mehendi Invitation Floral",
  category: "invitation",
  tags: ["Mehendi", "Floral", "Hindi"],
  doc: D(W, H, "linear-gradient(180deg,#fff6d8,#ffe6a8)", [
    ...dots(W, H, "#f0b429", 0.3, 32),
    S("rect", 26, 26, W - 52, H - 52, { fill: "transparent", stroke: "#d98200", strokeWidth: 3, radius: 28 }),
    ...corner("petal", 14, 14, 120, "#f59f00", 20),
    ...corner("petal", W - 134, 14, 120, "#f59f00", -20),
    ...corner("petal", 14, H - 134, 120, "#f59f00", 160),
    ...corner("petal", W - 134, H - 134, 120, "#f59f00", 200),
    ...ornament(W, 66, "🌿 💚 🌿", 44),
    C(W, "मेहंदी समारोह", 138, { fontFamily: "Yatra One", fontSize: 76, color: "#b25a00" }),
    C(W, "Mehendi Ceremony", 248, { fontFamily: "Dancing Script", fontSize: 66, fontWeight: 700, color: "#2e7d32", lineHeight: 1.05 }),
    ...divider(W, 350, "#d98200", "wave", 230),
    C(W, "Henna, music and a whole lot of love", 384, { fontFamily: "Poppins", fontSize: 22, color: "#6b3a00" }),
    S("rect", 130, 442, W - 260, 300, { fill: "#fffdf5", radius: 32, stroke: "#f0b429", strokeWidth: 2 }),
    ...seal(W / 2, 442, 84, "#f59f00", "🌿", 0.52),
    C(W, "FRIDAY · 12 DECEMBER", 560, { fontFamily: "Poppins", fontSize: 29, fontWeight: 700, color: "#b25a00" }),
    C(W, "4:00 PM onwards", 606, { fontFamily: "Poppins", fontSize: 22, color: "#6b3a00" }),
    C(W, "Sharma Farmhouse, Gurugram", 650, { fontFamily: "Cormorant Garamond", fontSize: 26, color: "#6b3a00" }),
    ...pill(W, 786, "Wear green & yellow 💛💚", "#2e7d32", "#fffdf5", { fontSize: 21 }, 56, 0.68),
    ...ornament(W, 884, "🌼 🌿 🌼", 42),
  ]),
};

const haldiInvite: SeedTemplate = {
  slug: "haldi-invitation-yellow",
  title: "Haldi Invitation Yellow",
  category: "invitation",
  tags: ["Haldi", "Hindu"],
  doc: D(W, H, "linear-gradient(180deg,#fff9c4,#ffe082)", [
    ...scatter(W, [[0, 220], [800, 1000]], 22, ["#f9a825", "#e65100", "#ffffff"], 88, ["flower", "circle", "leaf"], 32),
    S("rect", 24, 24, W - 48, H - 48, { fill: "transparent", stroke: "#e65100", strokeWidth: 3, radius: 30 }),
    ...corner("petal", 16, 16, 120, "#f9a825", 10),
    ...corner("petal", W - 136, 16, 120, "#f9a825", -10),
    ...corner("petal", 16, H - 136, 120, "#f9a825", 170),
    ...corner("petal", W - 136, H - 136, 120, "#f9a825", 190),
    ...seal(W / 2, 180, 126, "#e65100", "💛", 0.5),
    C(W, "HALDI CEREMONY", 276, { fontFamily: "Montserrat", fontSize: 20, letterSpacing: 8, color: "#e65100", fontWeight: 700 }),
    C(W, "Haldi", 316, { fontFamily: "Lobster", fontSize: 106, color: "#bf360c", lineHeight: 1.05 }),
    ...divider(W, 462, "#e65100", "wave", 230),
    C(W, "Smear some turmeric, sing a song", 496, { fontFamily: "Poppins", fontSize: 23, color: "#6b3a00" }),
    C(W, "& bless the couple!", 532, { fontFamily: "Poppins", fontSize: 23, color: "#6b3a00" }),
    S("rect", 120, 586, W - 240, 260, { fill: "#fffdf5", radius: 26, stroke: "#f9a825", strokeWidth: 2 }),
    C(W, "THURSDAY · 10 DECEMBER", 618, { fontFamily: "Poppins", fontSize: 27, fontWeight: 700, color: "#bf360c" }),
    C(W, "10:00 AM onwards", 662, { fontFamily: "Poppins", fontSize: 22, color: "#6b3a00" }),
    C(W, "Sharma Niwas, Jaipur", 704, { fontFamily: "Cormorant Garamond", fontSize: 27, color: "#6b3a00" }),
    C(W, "Dress code: Yellow 💛", 758, { fontFamily: "Caveat", fontSize: 36, color: "#e65100" }),
    ...ornament(W, 884, "🌼 🌼 🌼", 42),
  ]),
};

const ringCeremony: SeedTemplate = {
  slug: "ring-ceremony-invitation",
  title: "Ring Ceremony Invitation",
  category: "invitation",
  tags: ["Engagement", "Royal"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#1b1230,#2e1d4d 55%,#1b1230)", [
    ...glow(W / 2 - 200, 120, 400, "#e5b3ff", 0.28),
    ...border(W, H, "#d9b8ff", { inset: 28, gap: 14, weight: 1.6 }),
    ...corner("arc", 34, 34, 120, "#d9b8ff"),
    ...corner("arc", W - 154, 34, 120, "#d9b8ff", 90),
    ...corner("arc", 34, H - 154, 120, "#d9b8ff", 270),
    ...corner("arc", W - 154, H - 154, 120, "#d9b8ff", 180),
    ...seal(W / 2, 200, 126, "#d9b8ff", "💍", 0.5),
    C(W, "SHE SAID YES!", 300, { fontFamily: "Montserrat", fontSize: 20, letterSpacing: 9, color: "#d9b8ff", fontWeight: 700 }),
    C(W, "Ring Ceremony", 342, { fontFamily: "Great Vibes", fontSize: 94, color: "#ffffff", lineHeight: 1.05 }),
    C(W, "of", 466, { fontFamily: "Cormorant Garamond", fontSize: 30, italic: true, color: "#b9a3e0" }),
    C(W, "Meera & Karan", 500, { fontFamily: "Playfair Display", fontSize: 72, color: "#f3e8ff", lineHeight: 1.05 }),
    ...divider(W, 624, "#d9b8ff", "diamond", 210),
    C(W, "SUNDAY · 10 JANUARY 2027", 658, { fontFamily: "Montserrat", fontSize: 18, letterSpacing: 4, color: "#f3e8ff", fontWeight: 700 }),
    C(W, "6 o'clock in the evening", 700, { fontFamily: "Cormorant Garamond", fontSize: 27, italic: true, color: "#b9a3e0" }),
    ...pill(W, 756, "LOTUS BANQUET · PUNE", "#d9b8ff", "#1b1230", { fontSize: 20, letterSpacing: 3, fontWeight: 700 }, 56, 0.7),
    C(W, "Dinner & celebrations to follow", 844, { fontFamily: "Cormorant Garamond", fontSize: 25, color: "#e8dfff" }),
    ...divider(W, 910, "#d9b8ff", "dots", 160),
  ]),
};

const sangeetInvite: SeedTemplate = {
  slug: "sangeet-invitation-night",
  title: "Sangeet Invitation Night",
  category: "invitation",
  tags: ["Sangeet", "Party"],
  doc: D(W, H, "linear-gradient(165deg,#160b2e,#3a1160 55%,#0d0620)", [
    ...glow(W / 2 - 240, 60, 480, "#ff3dac", 0.28),
    ...glow(W / 2 - 180, 600, 360, "#27e6ff", 0.2),
    S("rect", 60, 100, W - 120, H - 200, { fill: "transparent", stroke: "#ff3dac", strokeWidth: 3, radius: 14 }),
    S("rect", 76, 116, W - 152, H - 232, { fill: "transparent", stroke: "#27e6ff", strokeWidth: 1.6, radius: 10 }),
    ...scatter(W, [[0, 200], [820, 1000]], 20, ["#ff3dac", "#27e6ff", "#ffe066"], 99, ["star", "circle", "diamond"], 22),
    C(W, "SANGEET NIGHT", 190, { fontFamily: "Montserrat", fontSize: 20, letterSpacing: 9, color: "#27e6ff", fontWeight: 700 }),
    C(W, "Dance", 234, { fontFamily: "Bebas Neue", fontSize: 134, color: "#ffffff", letterSpacing: 6, lineHeight: 0.95 }),
    C(W, "All Night", 384, { fontFamily: "Bebas Neue", fontSize: 90, color: "#ff3dac", letterSpacing: 4, lineHeight: 1 }),
    ...divider(W, 512, "#27e6ff", "wave", 230),
    C(W, "Celebrating the wedding of", 546, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 3, color: "#ffffff" }),
    C(W, "Riya & Aditya", 580, { fontFamily: "Great Vibes", fontSize: 88, color: "#ffe066", lineHeight: 1.05 }),
    C(W, "FRIDAY · 11 DECEMBER · 8 PM", 706, { fontFamily: "Montserrat", fontSize: 19, letterSpacing: 3, color: "#ffffff", fontWeight: 700 }),
    C(W, "Marriott Grand Ballroom, Delhi", 748, { fontFamily: "Montserrat", fontSize: 17, color: "#d6c6ff" }),
    ...pill(W, 804, "DJ · DANCE · DINNER", "#27e6ff", "#160b2e", { fontSize: 20, letterSpacing: 4, fontWeight: 700 }, 56, 0.66),
    C(W, "Come ready to dance! 💃🕺", 892, { fontFamily: "Caveat", fontSize: 38, color: "#ff3dac" }),
  ]),
};

const anniversaryInvite: SeedTemplate = {
  slug: "anniversary-celebration-invite",
  title: "Anniversary Celebration Invite",
  category: "invitation",
  tags: ["Anniversary", "Royal"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fff5f8,#ffe4ec)", [
    ...corner("petal", -20, -20, 200, "#f7a8c4", 12),
    ...corner("petal", W - 180, H - 200, 180, "#f7a8c4", 190),
    ...border(W, H, "#e5578a", { inset: 30, gap: 12, weight: 1.6, radius: 18 }),
    C(W, "ANNIVERSARY", 148, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 8, color: "#c2185b", fontWeight: 700 }),
    C(W, "25 Wonderful", 190, { fontFamily: "Playfair Display", fontSize: 66, color: "#ad1457", lineHeight: 1.05 }),
    C(W, "Years", 274, { fontFamily: "Playfair Display", fontSize: 66, italic: true, color: "#c2185b", lineHeight: 1.05 }),
    ...divider(W, 382, "#e5578a", "floral", 220),
    C(W, "Sunita & Rajesh", 418, { fontFamily: "Great Vibes", fontSize: 92, color: "#ad1457", lineHeight: 1.05 }),
    C(W, "Join us as we celebrate 25 years of", 548, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#8a4a63" }),
    C(W, "love, laughter and togetherness", 586, { fontFamily: "Cormorant Garamond", fontSize: 26, italic: true, color: "#8a4a63" }),
    ...pill(W, 640, "SATURDAY · 14 FEBRUARY 2027", "#ad1457", "#fff5f8", { fontSize: 20, letterSpacing: 3 }, 60, 0.82),
    C(W, "Silver Sands Resort, Goa", 736, { fontFamily: "Playfair Display", fontSize: 27, color: "#8a4a63" }),
    C(W, "Dinner & dance at 8 PM", 778, { fontFamily: "Montserrat", fontSize: 16, color: "#8a4a63" }),
    C(W, "Your presence means the world to us 💕", 848, { fontFamily: "Caveat", fontSize: 36, color: "#ad1457" }),
    ...divider(W, 932, "#e5578a", "dots", 170),
  ]),
};

const kittyParty: SeedTemplate = {
  slug: "kitty-party-invitation",
  title: "Kitty Party Invitation",
  category: "invitation",
  tags: ["Party", "Floral"],
  doc: D(W, H, "linear-gradient(180deg,#fdf3ff,#f0dcff)", [
    ...scatter(W, [[0, 220], [800, 1000]], 20, ["#b197fc", "#f7a8c4", "#ffd166"], 66, ["flower", "circle", "star"], 28),
    S("rect", 26, 26, W - 52, H - 52, { fill: "transparent", stroke: "#9c27b0", strokeWidth: 3, radius: 28 }),
    ...seal(W / 2, 180, 126, "#9c27b0", "☕", 0.5),
    C(W, "KITTY PARTY", 278, { fontFamily: "Montserrat", fontSize: 20, letterSpacing: 8, color: "#9c27b0", fontWeight: 700 }),
    C(W, "Ladies Getaway", 318, { fontFamily: "Pacifico", fontSize: 84, color: "#6a1b9a", lineHeight: 1.05 }),
    ...divider(W, 456, "#9c27b0", "floral", 220),
    C(W, "An afternoon of fun, games,", 492, { fontFamily: "Poppins", fontSize: 23, color: "#4a148c" }),
    C(W, "tambola & high tea", 528, { fontFamily: "Poppins", fontSize: 23, color: "#4a148c" }),
    S("rect", 120, 582, W - 240, 250, { fill: "#ffffff", radius: 26, stroke: "#b197fc", strokeWidth: 2 }),
    C(W, "WEDNESDAY · 18 MARCH", 614, { fontFamily: "Poppins", fontSize: 27, fontWeight: 700, color: "#6a1b9a" }),
    C(W, "4:00 PM onwards", 660, { fontFamily: "Poppins", fontSize: 22, color: "#4a148c" }),
    C(W, "The Club House, Mumbai", 702, { fontFamily: "Cormorant Garamond", fontSize: 26, color: "#4a148c" }),
    C(W, "Bring your lucky charm 🍀", 762, { fontFamily: "Caveat", fontSize: 36, color: "#9c27b0" }),
    ...ornament(W, 884, "🌸 ☘️ 🌸", 40),
  ]),
};

const mundanInvite: SeedTemplate = {
  slug: "mundan-sanskar-invitation",
  title: "Mundan Sanskar Invitation",
  category: "invitation",
  tags: ["Hindi", "Kids"],
  doc: D(W, H, "linear-gradient(180deg,#fff8e8,#f7e4bd)", [
    S("rect", 22, 22, W - 44, H - 44, { fill: "#fffdf5", radius: 10, stroke: "#b8352a", strokeWidth: 3 }),
    S("rect", 38, 38, W - 76, H - 76, { fill: "transparent", stroke: "#c9a24b", strokeWidth: 1.2, radius: 6 }),
    ...corner("arc", 26, 26, 130, "#b8352a"),
    ...corner("arc", W - 156, 26, 130, "#b8352a", 90),
    ...corner("arc", 26, H - 156, 130, "#b8352a", 270),
    ...corner("arc", W - 156, H - 156, 130, "#b8352a", 180),
    C(W, "🪔 श्री गणेशाय नमः 🪔", 66, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#b8352a" }),
    C(W, "मुंडन संस्कार", 124, { fontFamily: "Yatra One", fontSize: 76, color: "#8c1c2e" }),
    ...divider(W, 232, "#c9a24b", "floral", 230),
    C(W, "Chhotu", 262, { fontFamily: "Great Vibes", fontSize: 82, color: "#8c1c2e", lineHeight: 1.05 }),
    C(W, "के मुंडन संस्कार की हर्षोल्लास के साथ", 386, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#5a2d0c" }),
    C(W, "आमंत्रण देना चाहते हैं", 426, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#5a2d0c" }),
    T("👶", W / 2 - 60, 470, 120, { fontSize: 94, align: "center" }),
    S("rect", 100, 596, W - 200, 210, { fill: "#fff3d6", radius: 18, stroke: "#c9a24b", strokeWidth: 1.5 }),
    C(W, "दिनांक : 14 दिसम्बर 2026, शनिवार", 628, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#8c1c2e" }),
    C(W, "समय : सुबह 10 बजे", 670, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#8c1c2e" }),
    C(W, "स्थान : शर्मा निवास, जयपुर", 712, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#8c1c2e" }),
    C(W, "आपका आगमन अवश्य करें 🙏", 862, { fontFamily: "Tiro Devanagari Hindi", fontSize: 27, color: "#b8352a" }),
    ...divider(W, 938, "#c9a24b", "dots", 160),
  ]),
};

export const invitationTemplates: SeedTemplate[] = [
  diwaliDiya,
  grihaPravesh,
  confettiBash,
  elegantBlack,
  poolParty,
  neonNight,
  photoGrid,
  festivalMandala,
  housePartyNeon,
  mehendiInvite,
  haldiInvite,
  ringCeremony,
  sangeetInvite,
  anniversaryInvite,
  kittyParty,
  mundanInvite,
];
