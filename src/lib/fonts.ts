export type FontDef = { name: string; group: string; weights: number[] };

export const FONTS: FontDef[] = [
  // ── Script / wedding ──
  { name: "Great Vibes", group: "Script", weights: [400] },
  { name: "Parisienne", group: "Script", weights: [400] },
  { name: "Allura", group: "Script", weights: [400] },
  { name: "Alex Brush", group: "Script", weights: [400] },
  { name: "Dancing Script", group: "Script", weights: [400, 700] },
  { name: "Satisfy", group: "Script", weights: [400] },
  { name: "Pacifico", group: "Script", weights: [400] },
  { name: "Caveat", group: "Handwriting", weights: [400, 700] },
  { name: "Kalam", group: "Handwriting", weights: [400, 700] },
  // ── Serif / display ──
  { name: "Playfair Display", group: "Serif", weights: [400, 700] },
  { name: "Cormorant Garamond", group: "Serif", weights: [400, 700] },
  { name: "Cinzel", group: "Serif", weights: [400, 700] },
  { name: "Lora", group: "Serif", weights: [400, 700] },
  { name: "Libre Baskerville", group: "Serif", weights: [400, 700] },
  { name: "Abril Fatface", group: "Display", weights: [400] },
  { name: "Bebas Neue", group: "Display", weights: [400] },
  { name: "Lobster", group: "Display", weights: [400] },
  { name: "Amatic SC", group: "Display", weights: [400, 700] },
  // ── Sans ──
  { name: "Montserrat", group: "Sans", weights: [400, 700] },
  { name: "Poppins", group: "Sans", weights: [400, 700] },
  { name: "Raleway", group: "Sans", weights: [400, 700] },
  { name: "Josefin Sans", group: "Sans", weights: [400, 700] },

  // ── Devanagari: Hindi, Marathi, Rajasthani, Sanskrit, Jain Prakrit ──
  { name: "Tiro Devanagari Hindi", group: "Devanagari", weights: [400] },
  { name: "Tiro Devanagari Marathi", group: "Devanagari", weights: [400] },
  { name: "Tiro Devanagari Sanskrit", group: "Devanagari", weights: [400] },
  { name: "Yatra One", group: "Devanagari", weights: [400] },
  { name: "Rozha One", group: "Devanagari", weights: [400] },
  { name: "Baloo 2", group: "Devanagari", weights: [400, 700] },
  { name: "Baloo Bhai 2", group: "Devanagari", weights: [400, 700] },

  // ── Gurmukhi: Punjabi ──
  { name: "Mukta Mahee", group: "Gurmukhi", weights: [400, 700] },
  { name: "Baloo Paaji 2", group: "Gurmukhi", weights: [400, 700] },

  // ── Gujarati ──
  { name: "Mukta Vaani", group: "Gujarati", weights: [400, 700] },
  { name: "Baloo Bhaijaan 2", group: "Gujarati", weights: [400, 700] },

  // ── Bengali ──
  { name: "Baloo Da 2", group: "Bengali", weights: [400, 700] },
  { name: "Noto Serif Bengali", group: "Bengali", weights: [400, 700] },

  // ── Tamil ──
  { name: "Mukta Malar", group: "Tamil", weights: [400, 700] },
  { name: "Catamaran", group: "Tamil", weights: [400, 700] },

  // ── Telugu ──
  { name: "Mallanna", group: "Telugu", weights: [400] },
  { name: "Noto Sans Telugu", group: "Telugu", weights: [400, 700] },

  // ── Malayalam ──
  { name: "Manjari", group: "Malayalam", weights: [400, 700] },
  { name: "Noto Sans Malayalam", group: "Malayalam", weights: [400, 700] },

  // ── Kannada ──
  { name: "Baloo Tamma 2", group: "Kannada", weights: [400, 700] },

  // ── Odia ──
  { name: "Baloo Bhaina 2", group: "Odia", weights: [400, 700] },

  // ── Urdu (right-to-left) ──
  { name: "Noto Nastaliq Urdu", group: "Urdu", weights: [400, 700] },
];

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  FONTS.map((f) => {
    const fam = f.name.replace(/ /g, "+");
    return f.weights.length > 1 ? `family=${fam}:wght@${f.weights.join(";")}` : `family=${fam}`;
  }).join("&") +
  "&display=swap";

export const isLatinFont = (name: string) => {
  const f = FONTS.find((x) => x.name === name);
  return !f || ["Script", "Handwriting", "Serif", "Display", "Sans"].includes(f.group);
};

/** For a given UI language, which fonts should be shown first. */
export const fontsForScript = (script: string) =>
  FONTS.filter((f) => f.group === script || f.group === "Script" || f.group === "Serif" || f.group === "Sans");
