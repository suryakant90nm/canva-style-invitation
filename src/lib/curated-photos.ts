/**
 * Curated stock photo library for Indian celebration cards.
 *
 * These are direct CDN URLs from Pexels' public image host (free to use, no API key
 * required to hot-link). They act as a reliable, always-available library so the
 * editor's Photos tab never shows an empty state — even if the Wikimedia/Openverse
 * APIs are rate limited and no PEXELS_API_KEY is configured.
 *
 * Swap to the live Pexels/Unsplash search API by setting PEXELS_API_KEY or
 * UNSPLASH_ACCESS_KEY in the environment.
 */

export type CuratedPhoto = {
  id: number;
  /** keyword groups this photo matches */
  keys: string[];
  credit: string;
  alt: string;
};

const img = (id: number) => ({
  full: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1000`,
  thumb: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=240&w=320`,
});

export const CURATED: CuratedPhoto[] = [
  // ── Indian wedding decor & flowers ──────────────────────────────
  { id: 11255470, keys: ["wedding", "marriage", "flower", "marigold", "gajra", "decor", "shaadi", "vivah", "haldi", "mehendi"], credit: "Sharath G. / Pexels", alt: "Marigold garland wrapped around a ceremonial column" },
  { id: 12718058, keys: ["wedding", "marriage", "flower", "decor", "shaadi", "vivah", "mandap"], credit: "BANU FILM ADS / Pexels", alt: "Flower arrangement with banana leaves for a wedding ceremony" },
  { id: 12087682, keys: ["wedding", "marriage", "marigold", "flower", "genda", "festival", "diwali"], credit: "Stuti / Pexels", alt: "Colourful marigold garlands hanging at a market" },
  { id: 39820649, keys: ["wedding", "marriage", "stage", "decor", "mandap", "shaadi", "vivah"], credit: "Perry / Pexels", alt: "Wedding stage decorated with marigolds and lanterns" },
  { id: 33508474, keys: ["wedding", "marriage", "gate", "entrance", "decor", "shaadi", "baraat"], credit: "The Visionary Vows / Pexels", alt: "Marigold archway at an Indian wedding venue" },
  { id: 8886982, keys: ["wedding", "marriage", "flower", "garland", "haldi", "hands"], credit: "Lara Jameson / Pexels", alt: "Hands holding vibrant flower garlands" },

  // ── Mehendi / henna & wedding rituals ───────────────────────────
  { id: 33557605, keys: ["mehendi", "mehndi", "henna", "wedding", "marriage", "hand", "bride"], credit: "Amreet Pandey / Pexels", alt: "Henna design on a bride's hand" },
  { id: 40195835, keys: ["wedding", "marriage", "ritual", "ceremony", "phera", "mandap", "havan"], credit: "Uday Ahir / Pexels", alt: "Couple's hands during a traditional wedding ritual" },
  { id: 14694820, keys: ["mehendi", "mehndi", "henna", "wedding", "hand"], credit: "Mushtaq Hussain / Pexels", alt: "Mehendi adorned hands at a traditional ceremony" },
  { id: 29623186, keys: ["wedding", "marriage", "ritual", "jewellery", "henna", "bride"], credit: "Darshan Dave / Pexels", alt: "Bride and groom's hands with jewellery and henna" },
  { id: 14825258, keys: ["mehendi", "mehndi", "henna", "bangles", "hand"], credit: "SR.Allabakash / Pexels", alt: "Intricate mehendi patterns with traditional bangles" },
  { id: 35399382, keys: ["mehendi", "mehndi", "henna", "wedding", "hand"], credit: "Ashraf Nadaf / Pexels", alt: "Detailed henna on hands with bangles" },

  // ── Couple / engagement ─────────────────────────────────────────
  { id: 10689262, keys: ["ring", "engagement", "couple", "wedding", "marriage", "hands", "sagai"], credit: "Deanna Arroyo / Pexels", alt: "Couple's hands showing wedding rings" },
  { id: 34303998, keys: ["couple", "love", "engagement", "wedding", "hands", "romantic"], credit: "Airam Dato-on / Pexels", alt: "Couple's hands intertwined" },
  { id: 34439637, keys: ["couple", "wedding", "marriage", "engagement", "formal"], credit: "Aydın Photography / Pexels", alt: "Elegant couple holding hands" },
  { id: 31439885, keys: ["couple", "love", "romantic", "wedding", "monochrome"], credit: "Anastasia Nagibina / Pexels", alt: "Black and white photograph of a couple" },
  { id: 29508407, keys: ["couple", "wedding", "marriage", "kiss", "newlywed", "love"], credit: "Benjamin Santiago / Pexels", alt: "Newlywed couple sharing a kiss outdoors" },
  { id: 4714622, keys: ["ring", "engagement", "couple", "proposal", "sagai", "wedding"], credit: "Leeloo The First / Pexels", alt: "Bride's hand with engagement ring held by groom" },

  // ── Birthday ────────────────────────────────────────────────────
  { id: 36704158, keys: ["birthday", "cake", "balloon", "party", "celebration", "bday"], credit: "Alexander Mass / Pexels", alt: "Decorated birthday cake with pink balloons" },
  { id: 36704186, keys: ["birthday", "cake", "balloon", "party", "celebration", "bday"], credit: "Alexander Mass / Pexels", alt: "Woman cutting a birthday cake with balloons" },
  { id: 34663044, keys: ["birthday", "balloon", "party", "hat", "celebration", "kids"], credit: "Merve BOZ / Pexels", alt: "Birthday setup with balloons, cake and party hats" },
  { id: 7221131, keys: ["birthday", "cake", "party", "woman", "celebration"], credit: "Pavel Danilyuk / Pexels", alt: "Smiling woman holding a pink birthday cake" },
  { id: 16220866, keys: ["birthday", "cake", "balloon", "kids", "party", "children"], credit: "Alejandra Montenegro / Pexels", alt: "Birthday party with cake and decorations for children" },
  { id: 8014699, keys: ["birthday", "cake", "candle", "party", "celebration"], credit: "Cup of Couple / Pexels", alt: "Slice of birthday cake with lit candles" },

  // ── Baby shower ─────────────────────────────────────────────────
  { id: 11883322, keys: ["baby", "shower", "balloon", "pink", "girl", "godh", "bharai"], credit: "Boys in Bristol Photography / Pexels", alt: "Pink baby shower decor with balloons" },
  { id: 18703117, keys: ["baby", "shower", "balloon", "mother", "maternity", "godh", "bharai"], credit: "Dhemer Gonçalves / Pexels", alt: "Woman at a baby shower with pastel balloons" },
  { id: 35204102, keys: ["baby", "shower", "gender", "reveal", "balloon", "party"], credit: "Laura Oliveira / Pexels", alt: "Pastel balloons set up for a gender reveal" },
  { id: 30907041, keys: ["baby", "shower", "maternity", "balloon", "outdoor", "godh", "bharai"], credit: "Mesut Yalçın / Pexels", alt: "Outdoor maternity party with decorative balloons" },
  { id: 3905850, keys: ["balloon", "pastel", "baby", "party", "celebration", "decoration"], credit: "Polina Tankilevitch / Pexels", alt: "Cluster of pastel balloons" },
  { id: 5610373, keys: ["cake", "dessert", "balloon", "party", "wedding", "sweet"], credit: "Jonathan Borba / Pexels", alt: "Cake and desserts with pink balloons" },

  // ── Festival / Diwali ───────────────────────────────────────────
  { id: 10178166, keys: ["diwali", "diya", "lamp", "festival", "deepavali", "puja", "light"], credit: "Mrigen Das / Pexels", alt: "Traditional diya lamps glowing in the dark" },
  { id: 34431714, keys: ["diwali", "diya", "lamp", "festival", "deepavali", "light"], credit: "Suhas Hanjar / Pexels", alt: "Diwali oil lamps illuminating the night" },
  { id: 14150455, keys: ["diwali", "diya", "candle", "lamp", "festival", "light"], credit: "Sresth Pachisia / Pexels", alt: "Burning oil lamps with a warm glow" },
  { id: 37650548, keys: ["diwali", "diya", "altar", "festival", "puja", "flower"], credit: "Nishant Vyas / Pexels", alt: "Lit diyas on an altar with flowers" },
  { id: 38549243, keys: ["diya", "lamp", "festival", "puja", "diwali", "aarti"], credit: "Sahil Mahale / Pexels", alt: "Clay diya lamp lit for celebration" },
  { id: 31104752, keys: ["diwali", "diya", "lamp", "festival", "light", "deepavali"], credit: "Meet Dhameliya / Pexels", alt: "Clay diyas with flickering flames" },

  // ── Generic celebration fillers ─────────────────────────────────
  { id: 267885, keys: ["party", "celebration", "event", "gathering"], credit: "Pexels", alt: "People celebrating at a party" },
  { id: 1190298, keys: ["flower", "bouquet", "floral", "bloom", "rose"], credit: "Pexels", alt: "Bouquet of fresh flowers" },
  { id: 931177, keys: ["flower", "floral", "bloom", "rose", "pink"], credit: "Pexels", alt: "Close up of blooming flowers" },
  { id: 1729931, keys: ["confetti", "party", "celebration", "gold"], credit: "Pexels", alt: "Golden confetti falling" },
];

/** Score a query against the curated library and return the closest matches. */
export function searchCurated(q: string, limit = 24) {
  const terms = q
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((t) => t.length > 2);
  const scored = CURATED.map((p) => {
    let score = 0;
    for (const t of terms) {
      for (const k of p.keys) {
        if (k === t) score += 3;
        else if (k.includes(t) || t.includes(k)) score += 2;
      }
    }
    return { p, score };
  }).filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, limit).map(({ p }) => p);
  // top up with generic celebration shots so the grid never looks empty
  if (picked.length < limit) {
    for (const p of CURATED) {
      if (picked.length >= limit) break;
      if (!picked.includes(p)) picked.push(p);
    }
  }
  return picked.map((p) => ({ ...p, ...img(p.id) }));
}
