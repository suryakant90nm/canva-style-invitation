import { bunting, border, C, corner, D, divider, dots, glow, ornament, pill, ribbon, S, scatter, seal, T } from "../decor";
import { art, artBlend, artPattern } from "./art";
import type { SeedTemplate } from "./types";

const W = 700;
const H = 1000;

/* ════════ GOLDEN BIRTHDAY (reference style) ════════ */
const goldenBirthday: SeedTemplate = {
  slug: "golden-brown-birthday-photo",
  title: "Golden Brown Theme Birthday",
  category: "birthday",
  tags: ["Photo Collage", "Royal"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fdefd8,#f6dcae)", [
    ...artBlend("balloons", -30, -60, W + 60, 460, { opacity: 0.95 }),
    S("circle", W / 2 - 118, 108, 236, 236, { fill: "#fffaf0", stroke: "#c9a24b", strokeWidth: 4 }),
    S("circle", W / 2 - 104, 122, 208, 208, { fill: "transparent", stroke: "#e0bc6a", strokeWidth: 1.5 }),
    T("Add", W / 2 - 104, 172, 208, { fontSize: 46, fontWeight: 700, color: "#b8933f", align: "center", fontFamily: "Poppins" }),
    T("photo", W / 2 - 104, 232, 208, { fontSize: 46, fontWeight: 700, color: "#b8933f", align: "center", fontFamily: "Poppins" }),
    C(W, "YOU ARE INVITED TO CELEBRATE", 372, { fontFamily: "Montserrat", fontSize: 14, letterSpacing: 5, color: "#8a6b3a", fontWeight: 700 }),
    C(W, "Aadhya's", 404, { fontFamily: "Dancing Script", fontSize: 66, fontWeight: 700, color: "#5a3e1b", lineHeight: 1.05 }),
    C(W, "BIRTHDAY", 476, { fontFamily: "Abril Fatface", fontSize: 92, color: "#c9862a", lineHeight: 1, letterSpacing: 2 }),
    C(W, "PARTY", 576, { fontFamily: "Abril Fatface", fontSize: 62, color: "#8a6b3a", letterSpacing: 10, lineHeight: 1 }),
    S("line", W / 2 - 90, 668, 180, 1.5, { stroke: "#b8933f", strokeWidth: 1.5 }),
    C(W, "27 JULY 2025", 684, { fontFamily: "Montserrat", fontSize: 22, letterSpacing: 4, color: "#5a3e1b", fontWeight: 700 }),
    C(W, "AT 7:00 PM", 722, { fontFamily: "Montserrat", fontSize: 17, letterSpacing: 4, color: "#8a6b3a" }),
    C(W, "Venue : Bouncy Bunch KidsPlay House,", 778, { fontFamily: "Poppins", fontSize: 19, color: "#6b5a3a" }),
    C(W, "Bypass Road, Indore", 810, { fontFamily: "Poppins", fontSize: 19, color: "#6b5a3a" }),
    C(W, "Rahul Deshmukh : 9000000000", 856, { fontFamily: "Poppins", fontSize: 19, fontWeight: 700, color: "#5a3e1b" }),
    ...artBlend("balloons", 0, 890, W, 300, { opacity: 0.55 }),
  ]),
};

/* ════════ COLOURFUL BIRTHDAY FRAME (reference style) ════════ */
const colourfulFrame: SeedTemplate = {
  slug: "colourful-birthday-frame",
  title: "Colourful Birthday Theme Party",
  category: "birthday",
  tags: ["Photo Collage", "Kids"],
  featured: true,
  doc: D(W, H, "#0d3b4f", [
    ...artBlend("balloons", -20, H - 300, W + 40, 300, { opacity: 0.5 }),
    S("circle", 40, 60, 120, 120, { fill: "#12798f", opacity: 0.8 }),
    S("circle", W - 160, 780, 150, 150, { fill: "#f6a5c0", opacity: 0.75 }),
    S("circle", W - 90, 120, 70, 70, { fill: "#ffd166" }),
    ...scatter(W, [[0, 200], [820, 960]], 18, ["#ffd166", "#f6a5c0", "#7ee0d6"], 12, ["star", "circle"], 20),
    S("rect", 110, 100, W - 220, H - 200, { fill: "#fdf0e4", radius: 20, stroke: "#ffd166", strokeWidth: 3 }),
    S("rect", 128, 118, W - 256, H - 236, { fill: "transparent", stroke: "#e07a3f", strokeWidth: 1.2, radius: 14 }),
    C(W, "You are Invited", 148, { fontFamily: "Cormorant Garamond", fontSize: 25, italic: true, color: "#6b5a3a" }),
    C(W, "To Celebrate With Us", 184, { fontFamily: "Cormorant Garamond", fontSize: 22, italic: true, color: "#6b5a3a" }),
    S("rect", W / 2 - 78, 226, 156, 176, { fill: "#ffffff", stroke: "#e07a3f", strokeWidth: 2 }),
    T("Add", W / 2 - 70, 268, 140, { fontSize: 34, fontWeight: 700, color: "#c9a24b", align: "center", fontFamily: "Poppins" }),
    T("photo", W / 2 - 70, 314, 140, { fontSize: 34, fontWeight: 700, color: "#c9a24b", align: "center", fontFamily: "Poppins" }),
    C(W, "TANISHA'S", 424, { fontFamily: "Playfair Display", fontSize: 46, color: "#1f6f8b", letterSpacing: 3 }),
    C(W, "BIRTHDAY", 480, { fontFamily: "Abril Fatface", fontSize: 66, color: "#e0577f", lineHeight: 1 }),
    S("rect", W / 2 - 92, 566, 184, 54, { fill: "#1f6f8b", radius: 6 }),
    C(W, "PARTY", 580, { fontFamily: "Josefin Sans", fontSize: 26, letterSpacing: 8, color: "#fdf0e4", fontWeight: 700 }),
    C(W, "20 August 2026", 644, { fontFamily: "Poppins", fontSize: 21, fontWeight: 700, color: "#5a3e1b" }),
    C(W, "At 7:00 PM", 678, { fontFamily: "Poppins", fontSize: 19, color: "#6b5a3a" }),
    C(W, "Venue", 726, { fontFamily: "Josefin Sans", fontSize: 18, letterSpacing: 4, color: "#e0577f", fontWeight: 700 }),
    C(W, "206, Block-C, Ahmed Nagar", 762, { fontFamily: "Poppins", fontSize: 18, color: "#6b5a3a" }),
    C(W, "Tuljapur, Maharashtra", 792, { fontFamily: "Poppins", fontSize: 18, color: "#6b5a3a" }),
    C(W, "Roshni Patel", 840, { fontFamily: "Dancing Script", fontSize: 34, fontWeight: 700, color: "#1f6f8b" }),
    C(W, "9000000000 | 9000000000", 886, { fontFamily: "Poppins", fontSize: 18, fontWeight: 700, color: "#5a3e1b" }),
  ]),
};

/* ════════ TEDDY BEAR PINK (reference style) ════════ */
const teddyPink: SeedTemplate = {
  slug: "teddy-bear-birthday-extravaganza",
  title: "Teddy Bear Birthday Pink",
  category: "birthday",
  tags: ["Kids", "Photo Collage"],
  featured: true,
  doc: D(W, H, "#fde4ee", [
    ...bunting(W, 30, ["#f6a5c0", "#7ec8e3", "#ffd166", "#b197fc"]),
    C(W, "You are Invited by", 108, { fontFamily: "Caveat", fontSize: 46, fontWeight: 700, color: "#5a3e5a" }),
    S("circle", W / 2 - 150, 190, 300, 300, { fill: "#f7a8c4" }),
    S("circle", W / 2 - 132, 208, 264, 264, { fill: "#ffffff" }),
    T("🧸", W / 2 - 110, 250, 220, { fontSize: 130, align: "center" }),
    ...artBlend("balloons", 0, 520, W, 290, { opacity: 0.85 }),
    S("rect", 0, 812, W, 116, { fill: "#e0577f" }),
    S("circle", 20, 802, 36, 36, { fill: "#e0577f" }),
    S("circle", W - 56, 802, 36, 36, { fill: "#e0577f" }),
    S("circle", 20, 902, 36, 36, { fill: "#e0577f" }),
    S("circle", W - 56, 902, 36, 36, { fill: "#e0577f" }),
    C(W, "Anjali's 5th Birthday", 836, { fontFamily: "Great Vibes", fontSize: 58, color: "#ffffff", lineHeight: 1.05 }),
    C(W, "SUN · 12 OCT · 4 PM · FUNZONE, DELHI", 952, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 3, color: "#5a3e5a", fontWeight: 700 }),
  ]),
};

/* ════════ CUTE ANIMAL FRIENDS (reference style) ════════ */
const animalFriends: SeedTemplate = {
  slug: "cute-animal-friends-birthday",
  title: "Cute Animal Friends Birthday",
  category: "birthday",
  tags: ["Kids", "Cartoon"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fff6e0,#ffe9c9)", [
    ...scatter(W, [[0, 140], [880, 1000]], 20, ["#ff6b9d", "#4ecdc4", "#ffd166", "#95a5ff"], 22, ["circle", "star", "diamond"], 22),
    C(W, "Birthday Party", 54, { fontFamily: "Fredoka", fontSize: 60, fontWeight: 600, color: "#2b6cb0", lineHeight: 1 }),
    C(W, "of", 124, { fontFamily: "Caveat", fontSize: 38, color: "#6b7280" }),
    S("rect", W / 2 - 130, 172, 260, 54, { fill: "#f0a500", radius: 10 }),
    C(W, "Pradeep", 186, { fontFamily: "Fredoka", fontSize: 32, fontWeight: 600, color: "#ffffff" }),
    S("rect", W / 2 - 118, 250, 236, 236, { fill: "#ffffff", radius: 12, stroke: "#f0a500", strokeWidth: 3 }),
    T("🧒", W / 2 - 100, 276, 200, { fontSize: 120, align: "center" }),
    C(W, "turns 6!", 506, { fontFamily: "Caveat", fontSize: 46, fontWeight: 700, color: "#e0577f" }),
    ...artBlend("cake-pets", 40, 548, 620, 340),
    C(W, "SUN · 12 OCT · 5 PM", 908, { fontFamily: "Fredoka", fontSize: 25, fontWeight: 600, color: "#2b6cb0" }),
    C(W, "Balloon House, Powai, Mumbai", 950, { fontFamily: "Fredoka", fontSize: 20, color: "#4b5563" }),
  ]),
};

/* ════════ WILD TUNES DINO ════════ */
const wildTunes: SeedTemplate = {
  slug: "wild-tunes-animal-band-birthday",
  title: "Wild Tunes Animal Band Birthday",
  category: "birthday",
  tags: ["Kids", "Cartoon"],
  doc: D(W, H, "#12b5cf", [
    ...bunting(W, 26, ["#ffffff", "#ffd166", "#ff6b9d", "#b197fc"]),
    C(W, "HAPPY", 90, { fontFamily: "Fredoka", fontSize: 62, fontWeight: 600, color: "#ffffff", letterSpacing: 8 }),
    C(W, "BIRTHDAY", 162, { fontFamily: "Fredoka", fontSize: 62, fontWeight: 600, color: "#ffffff", letterSpacing: 6 }),
    ...scatter(W, [[0, 300], [760, 1000]], 22, ["#ffd166", "#ff6b9d", "#ffffff", "#b197fc"], 33, ["circle", "star"], 24),
    S("rect", 130, 250, 440, 300, { fill: "#ffffff", radius: 14, stroke: "#ffd166", strokeWidth: 5 }),
    T("🦖", 160, 268, 380, { fontSize: 150, align: "center" }),
    S("rect", W / 2 - 170, 578, 340, 62, { fill: "#7b3ff2", radius: 8 }),
    C(W, "10th Birthday Party", 592, { fontFamily: "Fredoka", fontSize: 30, fontWeight: 600, color: "#ffffff" }),
    ...artBlend("cake-pets", 60, 654, 580, 300),
    C(W, "SAT · 18 JULY · 4 PM", 924, { fontFamily: "Fredoka", fontSize: 24, fontWeight: 600, color: "#ffffff" }),
    C(W, "Dino Park, Ahmedabad", 962, { fontFamily: "Fredoka", fontSize: 20, color: "#e0fbff" }),
  ]),
};

/* ════════ FILM STRIP MEMORIES ════════ */
const filmStrip: SeedTemplate = {
  slug: "film-strip-birthday-memories",
  title: "Film Strip Birthday Memories",
  category: "birthday",
  tags: ["Photo Collage", "Milestone"],
  featured: true,
  doc: D(W, H, "#141414", [
    S("rect", 30, 120, W - 60, 700, { fill: "#1f1f1f", radius: 10 }),
    ...Array.from({ length: 9 }, (_, i) => S("rect", 52, 140 + i * 76, 26, 44, { fill: "#000000", radius: 4 })),
    ...Array.from({ length: 9 }, (_, i) => S("rect", W - 78, 140 + i * 76, 26, 44, { fill: "#000000", radius: 4 })),
    S("rect", 130, 165, 440, 290, { fill: "#2b2b2b", stroke: "#ffd54a", strokeWidth: 2 }),
    T("Add main", 150, 262, 400, { fontSize: 40, fontWeight: 700, color: "#ffd54a", align: "center", fontFamily: "Poppins" }),
    T("photo", 150, 316, 400, { fontSize: 40, fontWeight: 700, color: "#ffd54a", align: "center", fontFamily: "Poppins" }),
    S("rect", 130, 480, 210, 220, { fill: "#2b2b2b", stroke: "#ffffff", strokeWidth: 1.5 }),
    T("Photo 2", 148, 566, 174, { fontSize: 28, fontWeight: 600, color: "#ffffff", align: "center", fontFamily: "Poppins" }),
    S("rect", 360, 480, 210, 220, { fill: "#2b2b2b", stroke: "#ffffff", strokeWidth: 1.5 }),
    T("Photo 3", 378, 566, 174, { fontSize: 28, fontWeight: 600, color: "#ffffff", align: "center", fontFamily: "Poppins" }),
    C(W, "Dear Friend,", 58, { fontFamily: "Caveat", fontSize: 42, color: "#ffd54a" }),
    C(W, "Happy", 852, { fontFamily: "Pacifico", fontSize: 72, color: "#ffffff", lineHeight: 1 }),
    C(W, "B'Day!", 930, { fontFamily: "Pacifico", fontSize: 72, color: "#ffd54a", lineHeight: 1 }),
  ]),
};

/* ════════ BIG NUMBER MILESTONE ════════ */
const bigNumber: SeedTemplate = {
  slug: "big-number-milestone-birthday",
  title: "Big Number Milestone Birthday",
  category: "birthday",
  tags: ["Milestone", "Photo Collage"],
  doc: D(W, H, "#101828", [
    C(W, "18", 30, { fontFamily: "Bebas Neue", fontSize: 360, color: "rgba(255,255,255,0.12)", lineHeight: 0.9 }),
    S("rect", 170, 150, 360, 460, { fill: "#1b2740", stroke: "#f4b942", strokeWidth: 3, radius: 22 }),
    T("Your", 200, 320, 300, { fontSize: 48, fontWeight: 700, color: "#f4b942", align: "center", fontFamily: "Poppins" }),
    T("photo", 200, 384, 300, { fontSize: 48, fontWeight: 700, color: "#f4b942", align: "center", fontFamily: "Poppins" }),
    ...corner("dots", 150, 130, 120, "#f4b942"),
    ...corner("dots", W - 270, 560, 120, "#f4b942"),
    C(W, "IT'S MY", 662, { fontFamily: "Montserrat", fontSize: 26, letterSpacing: 12, color: "#f4b942", fontWeight: 700 }),
    C(W, "BIRTHDAY", 700, { fontFamily: "Bebas Neue", fontSize: 106, color: "#ffffff", letterSpacing: 4, lineHeight: 1 }),
    C(W, "Saturday · 4 May · 8 PM onwards", 848, { fontFamily: "Montserrat", fontSize: 20, color: "#f4b942", fontWeight: 700 }),
    C(W, "Sky Lounge, Andheri West, Mumbai", 890, { fontFamily: "Montserrat", fontSize: 18, color: "#cbd5e1" }),
    C(W, "Come dressed in black & gold", 940, { fontFamily: "Caveat", fontSize: 34, color: "#f4b942" }),
  ]),
};

/* ════════ PINK COLLAGE ════════ */
const pinkCollage: SeedTemplate = {
  slug: "pink-photo-collage-birthday",
  title: "Pink Photo Collage Birthday",
  category: "birthday",
  tags: ["Photo Collage", "Instagram"],
  featured: true,
  doc: D(W, H, "#fde8ef", [
    S("rect", 0, 0, W, H, { fill: "rgba(255,255,255,0.55)" }),
    S("rect", 250, -60, 200, 46, { fill: "#f9c6d8", rotation: -6, radius: 8 }),
    C(W, "Happy Birthday!", 40, { fontFamily: "Great Vibes", fontSize: 80, color: "#c2185b" }),
    S("rect", 55, 160, 275, 275, { fill: "#ffffff", rotation: -4, radius: 8, stroke: "#f9c6d8", strokeWidth: 3 }),
    T("Photo 1", 75, 274, 235, { fontSize: 30, fontWeight: 600, color: "#e58aa5", align: "center", fontFamily: "Poppins" }),
    S("rect", 370, 180, 275, 275, { fill: "#ffffff", rotation: 5, radius: 8, stroke: "#f9c6d8", strokeWidth: 3 }),
    T("Photo 2", 390, 294, 235, { fontSize: 30, fontWeight: 600, color: "#e58aa5", align: "center", fontFamily: "Poppins" }),
    S("rect", 210, 485, 280, 265, { fill: "#ffffff", rotation: -2, radius: 12, stroke: "#f9c6d8", strokeWidth: 3 }),
    T("Photo 3", 230, 594, 240, { fontSize: 30, fontWeight: 600, color: "#e58aa5", align: "center", fontFamily: "Poppins" }),
    S("circle", 40, 900, 70, 70, { fill: "#f9c6d8" }),
    S("circle", 590, 90, 60, 60, { fill: "#f3b3cb" }),
    S("heart", 610, 905, 60, 54, { fill: "#e5578a" }),
    C(W, "Olivia Wilson", 786, { fontFamily: "Dancing Script", fontSize: 64, fontWeight: 700, color: "#8a2d52" }),
    C(W, "07 JANUARY 2026 · PARTY AT 7 PM", 866, { fontFamily: "Montserrat", fontSize: 18, letterSpacing: 3, color: "#a1506b", fontWeight: 700 }),
    C(W, "Join the celebration 🎉", 912, { fontFamily: "Caveat", fontSize: 38, color: "#c2185b" }),
  ]),
};

/* ════════ HINDI JANAMDIN ════════ */
const hindiJanamdin: SeedTemplate = {
  slug: "hindi-janamdin-photo-card",
  title: "Hindi Janamdin Photo Card",
  category: "birthday",
  tags: ["Hindi", "Photo Collage"],
  featured: true,
  doc: D(W, H, "linear-gradient(180deg,#fff4d6,#ffe0b2)", [
    S("rect", 26, 26, W - 52, H - 52, { fill: "transparent", stroke: "#e07b00", strokeWidth: 3, radius: 24 }),
    ...corner("petal", 14, 14, 120, "#f59f00", 15),
    ...corner("petal", W - 134, 14, 120, "#f59f00", -15),
    ...corner("petal", 14, H - 134, 120, "#f59f00", 165),
    ...corner("petal", W - 134, H - 134, 120, "#f59f00", 195),
    C(W, "जन्मदिन की", 66, { fontFamily: "Rozha One", fontSize: 58, color: "#b25a00" }),
    C(W, "हार्दिक शुभकामनाएँ", 140, { fontFamily: "Yatra One", fontSize: 58, color: "#e07b00" }),
    S("rect", 150, 232, 400, 400, { fill: "#ffffff", radius: 18, stroke: "#e07b00", strokeWidth: 3 }),
    T("फोटो", 180, 380, 340, { fontSize: 52, color: "#e07b00", align: "center", fontFamily: "Tiro Devanagari Hindi", fontWeight: 700 }),
    T("लगाएँ", 180, 450, 340, { fontSize: 52, color: "#e07b00", align: "center", fontFamily: "Tiro Devanagari Hindi", fontWeight: 700 }),
    C(W, "Rahul Sharma", 662, { fontFamily: "Great Vibes", fontSize: 78, color: "#8a3b00", lineHeight: 1.05 }),
    C(W, "रविवार · 12 अक्टूबर · शाम 6 बजे", 770, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#6b3a00" }),
    C(W, "शर्मा फार्म हाउस, जयपुर", 826, { fontFamily: "Tiro Devanagari Hindi", fontSize: 25, color: "#6b3a00" }),
    ...ornament(W, 892, "🎉 🎂 🎉", 44),
  ]),
};

/* ════════ PASTEL TEA PARTY ════════ */
const pastelTea: SeedTemplate = {
  slug: "pastel-tea-party-birthday",
  title: "Sweet Pastel Tea Party",
  category: "birthday",
  tags: ["Kids", "Floral"],
  doc: D(W, H, "#ffeef3", [
    S("circle", -60, -60, 260, 260, { fill: "#ffd1e0" }),
    S("circle", 520, -40, 220, 220, { fill: "#cdeedd" }),
    S("circle", 560, 840, 260, 260, { fill: "#ffd1e0" }),
    S("circle", -80, 860, 220, 220, { fill: "#cdeedd" }),
    C(W, "You're invited to a", 230, { fontFamily: "Cormorant Garamond", fontSize: 31, italic: true, color: "#8a5a6a" }),
    C(W, "Tea Party", 270, { fontFamily: "Pacifico", fontSize: 96, color: "#d9487a", lineHeight: 1.05 }),
    C(W, "for Siya's birthday", 408, { fontFamily: "Dancing Script", fontSize: 52, fontWeight: 700, color: "#3a8f6f" }),
    S("rect", 120, 500, 460, 290, { fill: "#ffffff", radius: 26, stroke: "#ffc2d6", strokeWidth: 3 }),
    C(W, "☕ 🧁 🍰", 528, { fontSize: 54 }),
    C(W, "SATURDAY · 18 JULY", 604, { fontFamily: "Josefin Sans", fontSize: 27, letterSpacing: 4, color: "#d9487a", fontWeight: 700 }),
    C(W, "3 o'clock sharp", 650, { fontFamily: "Cormorant Garamond", fontSize: 31, italic: true, color: "#6b4a57" }),
    C(W, "Rose Cottage Café, Kolkata", 694, { fontFamily: "Josefin Sans", fontSize: 21, color: "#6b4a57" }),
    C(W, "Dress up in pastels 🌷", 824, { fontFamily: "Caveat", fontSize: 38, color: "#3a8f6f" }),
  ]),
};

/* ════════ NEON NIGHT CLUB ════════ */
const neonNight: SeedTemplate = {
  slug: "neon-night-birthday-club",
  title: "Neon Night Birthday Club",
  category: "birthday",
  tags: ["Party", "Modern"],
  featured: true,
  doc: D(W, H, "linear-gradient(160deg,#1a0b3b,#3d0f5c 55%,#10163f)", [
    S("circle", 420, -80, 360, 360, { fill: "rgba(255,0,153,0.35)" }),
    S("circle", -120, 620, 420, 420, { fill: "rgba(0,229,255,0.22)" }),
    S("rect", 70, 100, W - 140, 800, { fill: "transparent", stroke: "#ff3dac", strokeWidth: 4, radius: 10 }),
    S("rect", 86, 116, W - 172, 768, { fill: "transparent", stroke: "#27e6ff", strokeWidth: 2, radius: 6 }),
    C(W, "ONE NIGHT ONLY", 172, { fontFamily: "Montserrat", fontSize: 18, letterSpacing: 8, color: "#27e6ff" }),
    C(W, "NEON", 222, { fontFamily: "Bebas Neue", fontSize: 148, color: "#ffffff", lineHeight: 0.95, letterSpacing: 6 }),
    C(W, "NIGHT", 378, { fontFamily: "Bebas Neue", fontSize: 148, color: "#ff3dac", lineHeight: 0.95, letterSpacing: 6 }),
    C(W, "THE BIRTHDAY PARTY OF", 566, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 5, color: "#ff3dac", fontWeight: 700 }),
    C(W, "KABIR TURNS 21", 606, { fontFamily: "Bebas Neue", fontSize: 68, color: "#27e6ff", letterSpacing: 3 }),
    C(W, "SAT · 30 MAY · 9 PM TILL LATE", 716, { fontFamily: "Montserrat", fontSize: 18, letterSpacing: 3, color: "#ffffff", fontWeight: 700 }),
    C(W, "Club Pulse, Bandra West", 760, { fontFamily: "Montserrat", fontSize: 18, color: "#d6c6ff" }),
    ...pill(W, 818, "DRESS CODE · GLOW & NEON", "#27e6ff", "#1a0b3b", { fontSize: 19, letterSpacing: 3, fontWeight: 700 }, 56, 0.78),
  ]),
};

/* ════════ BALLOON KIDS ════════ */
const balloonKids: SeedTemplate = {
  slug: "kids-balloons-birthday",
  title: "Kids Balloon Birthday",
  category: "birthday",
  tags: ["Kids", "Photo Collage"],
  doc: D(W, H, "linear-gradient(180deg,#e8f4ff,#ffe8f3)", [
    ...scatter(W, [[0, 160], [860, 990]], 24, ["#ff5e7e", "#3ec5c1", "#ffb400", "#7b61ff"], 33, ["circle", "star", "diamond"], 26),
    C(W, "🎈 🎉 🎈", 50, { fontSize: 50 }),
    C(W, "Aarav is turning 5!", 140, { fontFamily: "Fredoka", fontSize: 50, fontWeight: 600, color: "#ff5e7e" }),
    S("rect", 70, 230, 260, 280, { fill: "#ffffff", radius: 24, stroke: "#c9d8ff", strokeWidth: 3 }),
    T("🧒", 100, 268, 200, { fontSize: 110, align: "center" }),
    S("rect", 370, 230, 260, 280, { fill: "#ffffff", radius: 24, stroke: "#c9d8ff", strokeWidth: 3 }),
    T("🎈", 400, 268, 200, { fontSize: 110, align: "center" }),
    S("rect", 110, 570, 480, 250, { fill: "#ffffff", radius: 28 }),
    C(W, "SUNDAY · 12 OCT · 4 PM", 604, { fontFamily: "Fredoka", fontSize: 28, fontWeight: 600, color: "#1f2a44" }),
    C(W, "Balloon House, Powai, Mumbai", 656, { fontFamily: "Fredoka", fontSize: 22, color: "#6b7280" }),
    C(W, "Cake · Games · Magic show 🎩", 702, { fontFamily: "Fredoka", fontSize: 21, color: "#7b61ff" }),
    C(W, "celebrate with us!", 878, { fontFamily: "Lobster", fontSize: 56, color: "#3ec5c1" }),
  ]),
};

/* ════════ FOUR GRID ════════ */
const fourGrid: SeedTemplate = {
  slug: "four-photo-grid-birthday",
  title: "Four Photo Grid Birthday",
  category: "birthday",
  tags: ["Photo Collage", "Instagram"],
  doc: D(700, 700, "#ffffff", [
    S("rect", 30, 30, 315, 315, { fill: "#f1f5f9", stroke: "#e2e8f0", strokeWidth: 2 }),
    T("Photo 1", 60, 162, 255, { fontSize: 30, fontWeight: 600, color: "#94a3b8", align: "center", fontFamily: "Poppins" }),
    S("rect", 355, 30, 315, 315, { fill: "#f1f5f9", stroke: "#e2e8f0", strokeWidth: 2 }),
    T("Photo 2", 385, 162, 255, { fontSize: 30, fontWeight: 600, color: "#94a3b8", align: "center", fontFamily: "Poppins" }),
    S("rect", 30, 355, 315, 315, { fill: "#f1f5f9", stroke: "#e2e8f0", strokeWidth: 2 }),
    T("Photo 3", 60, 487, 255, { fontSize: 30, fontWeight: 600, color: "#94a3b8", align: "center", fontFamily: "Poppins" }),
    S("rect", 355, 355, 315, 315, { fill: "#f1f5f9", stroke: "#e2e8f0", strokeWidth: 2 }),
    T("Photo 4", 385, 487, 255, { fontSize: 30, fontWeight: 600, color: "#94a3b8", align: "center", fontFamily: "Poppins" }),
    S("rect", 175, 265, 350, 175, { fill: "rgba(255,255,255,0.94)", radius: 16 }),
    S("rect", 250, 252, 130, 22, { fill: "#ffd77a", rotation: -6, radius: 6 }),
    C(700, "Happy", 295, { fontFamily: "Pacifico", fontSize: 50, color: "#1f2937", lineHeight: 1.05 }, 185),
    C(700, "Birthday", 345, { fontFamily: "Pacifico", fontSize: 50, color: "#1f2937", lineHeight: 1.05 }, 185),
    C(700, "SARAH · 21 MARCH", 405, { fontFamily: "Montserrat", fontSize: 17, letterSpacing: 4, color: "#6b7280", fontWeight: 700 }, 185),
  ]),
};

/* ════════ GRADUATION ════════ */
const graduation: SeedTemplate = {
  slug: "graduation-celebration-invite",
  title: "Graduation Celebration Invite",
  category: "birthday",
  tags: ["Milestone", "Party"],
  doc: D(W, H, "#13294b", [
    S("rect", 0, 0, W, 330, { fill: "#f4b942" }),
    S("circle", 520, 40, 240, 240, { fill: "rgba(255,255,255,0.18)" }),
    C(W, "🎓", 66, { fontSize: 126 }),
    C(W, "CLASS OF 2026", 226, { fontFamily: "Montserrat", fontSize: 24, letterSpacing: 8, color: "#13294b", fontWeight: 700 }),
    C(W, "I did it!", 400, { fontFamily: "Abril Fatface", fontSize: 122, color: "#f4b942", lineHeight: 1 }),
    C(W, "Please join me to celebrate my graduation", 558, { fontFamily: "Lora", fontSize: 24, italic: true, color: "#e8eefb" }),
    C(W, "Rahul Verma", 606, { fontFamily: "Playfair Display", fontSize: 54, color: "#ffffff" }),
    ...divider(W, 700, "#f4b942", "diamond", 200),
    C(W, "SATURDAY · 6 JUNE · 6 PM", 734, { fontFamily: "Montserrat", fontSize: 20, letterSpacing: 4, color: "#f4b942", fontWeight: 700 }),
    C(W, "Garden Terrace, Koramangala", 778, { fontFamily: "Lora", fontSize: 24, color: "#e8eefb" }),
    C(W, "Bengaluru", 814, { fontFamily: "Lora", fontSize: 24, color: "#e8eefb" }),
    C(W, "Dinner & music", 886, { fontFamily: "Caveat", fontSize: 38, color: "#f4b942" }),
  ]),
};

/* ════════ POOL PARTY ════════ */
const poolParty: SeedTemplate = {
  slug: "pool-party-splash-birthday",
  title: "Pool Party Splash Birthday",
  category: "birthday",
  tags: ["Party", "Summer"],
  doc: D(W, H, "linear-gradient(180deg,#8fe3ff,#1aa7d8)", [
    S("circle", -80, 780, 300, 300, { fill: "rgba(255,255,255,0.25)" }),
    S("circle", 200, 860, 340, 340, { fill: "rgba(255,255,255,0.2)" }),
    S("circle", 480, 760, 300, 300, { fill: "rgba(255,255,255,0.25)" }),
    S("circle", 70, 80, 110, 110, { fill: "#ffd54a" }),
    T("🌴", W - 170, 60, 100, { fontSize: 90, align: "right" }),
    C(W, "POOL PARTY!", 240, { fontFamily: "Pacifico", fontSize: 86, color: "#ffffff", lineHeight: 1.1 }),
    C(W, "Come make a splash with us", 490, { fontFamily: "Fredoka", fontSize: 29, color: "#073b52" }),
    S("rect", 120, 560, 460, 190, { fill: "#ffffff", radius: 95 }),
    C(W, "SAT, 25 APRIL · 3 PM", 592, { fontFamily: "Fredoka", fontSize: 27, fontWeight: 600, color: "#0b7ba3" }),
    C(W, "Blue Lagoon Resort", 640, { fontFamily: "Fredoka", fontSize: 27, color: "#073b52" }),
    C(W, "Bring towels & sunscreen", 686, { fontFamily: "Fredoka", fontSize: 20, color: "#6b7280" }),
    ...ornament(W, 800, "🏊 🍉 🕶️ 🍹", 48),
  ]),
};

/* ════════ HOUSEWARMING MANDALA ════════ */
const housewarming: SeedTemplate = {
  slug: "housewarming-mandala-invite",
  title: "Housewarming Mandala Invite",
  category: "birthday",
  tags: ["Hindi", "Mandala"],
  featured: true,
  doc: D(W, H, "#ffffff", [
    ...artPattern("paisley", 0, 0, W, 220),
    ...artPattern("paisley", 0, H - 220, W, 220),
    C(W, "// Shree Ganeshaya Namah //", 244, { fontFamily: "Cormorant Garamond", fontSize: 24, italic: true, color: "#8c1c2e" }),
    ...artBlend("ganesha-gold", W / 2 - 90, 286, 180, 180),
    C(W, "We are delighted to invite you and your", 496, { fontFamily: "Cormorant Garamond", fontSize: 25, italic: true, color: "#4b3a2a" }),
    C(W, "family to grace the occasion of our", 532, { fontFamily: "Cormorant Garamond", fontSize: 25, italic: true, color: "#4b3a2a" }),
    C(W, "House Warming", 578, { fontFamily: "Playfair Display", fontSize: 58, fontWeight: 700, color: "#c2185b", lineHeight: 1.05 }),
    C(W, "Ceremony", 648, { fontFamily: "Playfair Display", fontSize: 44, fontWeight: 700, color: "#c2185b", lineHeight: 1.05 }),
    ...divider(W, 720, "#8c1c2e", "floral", 220),
    C(W, "SUNDAY · 15 MARCH 2026", 756, { fontFamily: "Montserrat", fontSize: 16, letterSpacing: 4, color: "#8c1c2e", fontWeight: 700 }),
    C(W, "Sunrise Heights, Baner, Pune", 800, { fontFamily: "Playfair Display", fontSize: 25, color: "#4b3a2a" }),
    C(W, "Puja 10 AM · Lunch 1 PM", 844, { fontFamily: "Cormorant Garamond", fontSize: 24, color: "#4b3a2a" }),
  ]),
};

/* ════════ BALLOON GOLD MINIMAL ════════ */
const goldMinimal: SeedTemplate = {
  slug: "gold-balloons-minimal-birthday",
  title: "Gold Balloons Minimal Birthday",
  category: "birthday",
  tags: ["Royal", "Instagram"],
  doc: D(W, H, "linear-gradient(180deg,#fffaf0,#f7ecd8)", [
    ...artBlend("balloons", 0, 0, W, 400, { opacity: 0.7 }),
    ...border(W, H, "#c9a24b", { inset: 26, gap: 12, weight: 1.6, radius: 8 }),
    C(W, "YOU ARE INVITED TO", 438, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 7, color: "#a8802f", fontWeight: 700 }),
    C(W, "Vihaan's", 474, { fontFamily: "Great Vibes", fontSize: 84, color: "#8a5a1b", lineHeight: 1.05 }),
    C(W, "BIRTHDAY", 580, { fontFamily: "Cinzel", fontSize: 72, color: "#c9862a", letterSpacing: 4, lineHeight: 1 }),
    ...divider(W, 692, "#c9a24b", "diamond", 220),
    C(W, "SUNDAY · 8 MARCH · 6 PM", 726, { fontFamily: "Montserrat", fontSize: 19, letterSpacing: 3, color: "#5a3e1b", fontWeight: 700 }),
    C(W, "The Grand Hyatt, Mumbai", 768, { fontFamily: "Cormorant Garamond", fontSize: 27, color: "#6b5a3a" }),
    ...pill(W, 828, "RSVP · 98200 11223", "#8a5a1b", "#fffaf0", { fontSize: 20, letterSpacing: 3 }, 56, 0.62),
    ...artBlend("balloons", 0, 880, W, 300, { opacity: 0.5 }),
  ]),
};

export const birthdayTemplates: SeedTemplate[] = [
  goldenBirthday,
  colourfulFrame,
  teddyPink,
  animalFriends,
  wildTunes,
  filmStrip,
  bigNumber,
  pinkCollage,
  hindiJanamdin,
  pastelTea,
  neonNight,
  balloonKids,
  fourGrid,
  graduation,
  poolParty,
  housewarming,
  goldMinimal,
];
