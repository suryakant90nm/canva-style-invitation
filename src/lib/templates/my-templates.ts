/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ADD YOUR OWN TEMPLATES HERE                                          ║
 * ║  (naye templates yahan jodein — koi aur file chhune ki zaroorat nahi) ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * HOW IT WORKS
 * ------------
 * 1. Copy the EXAMPLE block below, paste it again, change the text/colours.
 * 2. Give it a unique `slug` (lowercase, hyphens, no spaces).
 * 3. Save → templates appear automatically on the site (no database step).
 * 4. Push to GitHub → Vercel redeploys → live.
 *
 * CANVAS: 700 wide × 1000 tall (portrait card). x/y are from the top-left.
 *
 * HELPERS
 * -------
 *  C(W, "text", y, {...})            centred text at height y
 *  T("text", x, y, width, {...})      text box at exact position
 *  S("shape", x, y, w, h, {...})      shape: rect circle ring heart star flower leaf arch line …
 *  PH(x, y, w, h, { label })          empty photo frame (user taps to add a photo)
 *  ...border(W, H, "#color")          double gold border
 *  ...divider(W, y, "#color", "floral" | "diamond" | "dots" | "wave" | "heart")
 *  ...corner("arc" | "petal" | "leaf" | "dots", x, y, size, "#color", rotate)
 *  ...pill(W, y, "TEXT", bg, fg)       rounded label strip
 *  ...scatter(W, [[y0,y1]], count, [colours], seed)   confetti / sparkles
 *  ...artBlend("ganesha-gold", x, y, w, h)   built-in illustration (see ids below)
 *
 * ART IDS: ganesha-maroon, ganesha-gold, couple, mandala, paisley, leaves,
 *          balloons, cake-pets, baby-elements, diya
 *
 * FONTS (any Google font from src/lib/fonts.ts), e.g.
 *   English : "Great Vibes", "Playfair Display", "Cinzel", "Montserrat", "Pacifico"
 *   Hindi   : "Yatra One", "Rozha One", "Tiro Devanagari Hindi"
 *   Marathi : "Tiro Devanagari Marathi"   Punjabi : "Baloo Paaji 2"
 *   Gujarati: "Mukta Vaani"   Bengali: "Baloo Da 2"   Tamil: "Catamaran"
 *
 * CATEGORIES: "wedding" | "birthday" | "baby-shower" | "invitation"
 *
 * TIP: open the editor, design visually, then use  ★ Publish as template
 *      — easiest way if you don't want to write code at all.
 */

import { C, D, PH, S, T, border, corner, divider, ornament, pill, scatter } from "../decor";
import { artBlend } from "./art";
import type { SeedTemplate } from "./types";

const W = 700;
const H = 1000;

export const myTemplates: SeedTemplate[] = [
  /* ──────────────────────────────────────────────────────────────────────
   * EXAMPLE 1 — Simple wedding card (copy this block to make a new one)
   * ────────────────────────────────────────────────────────────────────── */
  {
    slug: "example-royal-blue-wedding", // ← unique id, used in the URL
    title: "Royal Blue Wedding", // ← shown under the thumbnail
    category: "wedding", // ← wedding | birthday | baby-shower | invitation
    tags: ["Hindu", "Royal"], // ← filter chips (see categories.ts for names)
    featured: true, // ← true = shows on home page
    doc: D(W, H, "linear-gradient(165deg,#0b1f4d,#1c3a8a 50%,#0b1f4d)", [
      ...border(W, H, "#e0bc6a", { inset: 26, gap: 14, weight: 2 }),
      ...corner("arc", 26, 26, 120, "#e0bc6a"),
      ...corner("arc", W - 146, 26, 120, "#e0bc6a", 90),
      ...corner("arc", 26, H - 146, 120, "#e0bc6a", 270),
      ...corner("arc", W - 146, H - 146, 120, "#e0bc6a", 180),

      C(W, "॥ श्री गणेशाय नमः ॥", 70, { fontFamily: "Tiro Devanagari Hindi", fontSize: 26, color: "#e0bc6a" }),
      ...artBlend("ganesha-gold", W / 2 - 70, 110, 140, 140),

      C(W, "शुभ विवाह", 268, { fontFamily: "Yatra One", fontSize: 80, color: "#fff3d6" }),
      ...divider(W, 380, "#e0bc6a", "floral", 240),

      C(W, "Aarav", 412, { fontFamily: "Great Vibes", fontSize: 110, color: "#e0bc6a", lineHeight: 1.05 }),
      C(W, "&", 552, { fontFamily: "Cormorant Garamond", fontSize: 40, color: "#fff3d6" }),
      C(W, "Ananya", 586, { fontFamily: "Great Vibes", fontSize: 110, color: "#e0bc6a", lineHeight: 1.05 }),

      ...pill(W, 740, "SATURDAY · 14 DEC 2026", "#e0bc6a", "#0b1f4d", { fontSize: 22, letterSpacing: 3 }, 60, 0.76),
      C(W, "Taj Palace Banquet · Jaipur", 830, { fontFamily: "Cormorant Garamond", fontSize: 27, color: "#fff3d6" }),
      C(W, "RSVP · 98765 43210", 880, { fontFamily: "Montserrat", fontSize: 15, letterSpacing: 4, color: "#e0bc6a" }),
      ...divider(W, 940, "#e0bc6a", "dots", 170),
    ]),
  },

  /* ──────────────────────────────────────────────────────────────────────
   * EXAMPLE 2 — Birthday card with a photo frame
   * ────────────────────────────────────────────────────────────────────── */
  {
    slug: "example-sunshine-birthday-photo",
    title: "Sunshine Birthday Photo",
    category: "birthday",
    tags: ["Kids", "Photo Collage"],
    doc: D(W, H, "linear-gradient(180deg,#fff7cc,#ffe08a)", [
      ...scatter(W, [[0, 200], [820, 1000]], 24, ["#ff5e7e", "#3ec5c1", "#7b61ff", "#ff8a3d"], 42),
      ...ornament(W, 60, "🎈 🎂 🎈", 50),

      C(W, "You're invited to", 150, { fontFamily: "Caveat", fontSize: 42, color: "#7a4a00" }),
      C(W, "Aanya's 5th Birthday", 200, { fontFamily: "Lobster", fontSize: 66, color: "#e65100", lineHeight: 1.1 }),

      // empty photo frame — the user taps it and uploads a picture
      PH(W / 2 - 150, 310, 300, 300, { frame: "circle", label: "Add photo" }),
      S("ring", W / 2 - 160, 300, 320, 320, { fill: "#ff8a3d", strokeWidth: 6 }),

      S("rect", 110, 660, W - 220, 190, { fill: "#ffffff", radius: 28 }),
      C(W, "SUNDAY · 8 MARCH · 4 PM", 690, { fontFamily: "Fredoka", fontSize: 28, fontWeight: 600, color: "#1f2a44" }),
      C(W, "Fun Zone Party Hall, Pune", 740, { fontFamily: "Fredoka", fontSize: 22, color: "#6b7280" }),
      C(W, "Games · Cake · Return gifts!", 786, { fontFamily: "Caveat", fontSize: 34, color: "#e65100" }),
    ]),
  },

  /* ──────────────────────────────────────────────────────────────────────
   * EXAMPLE 3 — Marathi lagna patrika (shows non-Hindi language)
   * ────────────────────────────────────────────────────────────────────── */
  {
    slug: "example-marathi-lagna-patrika",
    title: "मराठी लग्न पत्रिका",
    category: "wedding",
    tags: ["Marathi", "Hindu"],
    doc: D(W, H, "linear-gradient(180deg,#fff8e8,#f7e4bd)", [
      S("rect", 22, 22, W - 44, H - 44, { fill: "#fffdf5", radius: 10, stroke: "#b8352a", strokeWidth: 3 }),
      S("rect", 38, 38, W - 76, H - 76, { fill: "transparent", stroke: "#c9a24b", strokeWidth: 1.2, radius: 6 }),

      C(W, "॥ श्री गणेशाय नमः ॥", 70, { fontFamily: "Tiro Devanagari Marathi", fontSize: 26, color: "#b8352a" }),
      C(W, "शुभ लग्न", 126, { fontFamily: "Yatra One", fontSize: 78, color: "#8c1c2e" }),
      ...divider(W, 236, "#c9a24b", "floral", 240),

      C(W, "चि. आरव", 272, { fontFamily: "Rozha One", fontSize: 58, color: "#8c1c2e" }),
      C(W, "आणि", 352, { fontFamily: "Tiro Devanagari Marathi", fontSize: 26, color: "#8a6b3a" }),
      C(W, "चि. सौ. कां. अनन्या", 390, { fontFamily: "Rozha One", fontSize: 58, color: "#8c1c2e" }),

      C(W, "यांचा शुभविवाह निश्चित झाला असून", 500, { fontFamily: "Tiro Devanagari Marathi", fontSize: 26, color: "#5a2d0c" }),
      C(W, "आपण सहकुटुंब सहपरिवार उपस्थित राहावे", 540, { fontFamily: "Tiro Devanagari Marathi", fontSize: 26, color: "#5a2d0c" }),

      S("rect", 100, 610, W - 200, 210, { fill: "#fff3d6", radius: 18, stroke: "#c9a24b", strokeWidth: 1.5 }),
      C(W, "दिनांक : १४ डिसेंबर २०२६, शनिवार", 642, { fontFamily: "Tiro Devanagari Marathi", fontSize: 26, color: "#8c1c2e" }),
      C(W, "मुहूर्त : दुपारी १२:३० वाजता", 686, { fontFamily: "Tiro Devanagari Marathi", fontSize: 26, color: "#8c1c2e" }),
      C(W, "स्थळ : श्री मंगल कार्यालय, पुणे", 730, { fontFamily: "Tiro Devanagari Marathi", fontSize: 26, color: "#8c1c2e" }),

      C(W, "आपले स्वागत करण्यास उत्सुक 🙏", 866, { fontFamily: "Tiro Devanagari Marathi", fontSize: 27, color: "#b8352a" }),
      ...divider(W, 940, "#c9a24b", "dots", 160),
    ]),
  },

  // ▼▼▼  PASTE YOUR NEW TEMPLATES BELOW THIS LINE  ▼▼▼
];

// unused-import guard (keeps TypeScript happy if you delete the examples)
void T;
