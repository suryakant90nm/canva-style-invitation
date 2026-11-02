/**
 * Languages supported across the app (UI + template copy).
 * Every language maps to a script, which drives font selection.
 */

export type LangCode =
  | "en"
  | "hi"
  | "mr"
  | "pa"
  | "gu"
  | "bn"
  | "ta"
  | "te"
  | "ml"
  | "kn"
  | "or"
  | "raj"
  | "ur";

export type Language = {
  code: LangCode;
  /** native name, shown in the switcher */
  native: string;
  /** english name for tooltips / seo */
  english: string;
  /** font group from lib/fonts.ts */
  script: string;
  /** default display font for this language */
  font: string;
  /** body font for this language */
  bodyFont: string;
  /** primary search keyword used in India */
  seo: string;
  /** true for right-to-left */
  rtl?: boolean;
  flag: string;
};

export const LANGUAGES: Language[] = [
  { code: "en", native: "English", english: "English", script: "Sans", font: "Playfair Display", bodyFont: "Montserrat", seo: "invitation card maker", flag: "🇮🇳" },
  { code: "hi", native: "हिंदी", english: "Hindi", script: "Devanagari", font: "Yatra One", bodyFont: "Tiro Devanagari Hindi", seo: "shaadi card design hindi", flag: "🇮🇳" },
  { code: "mr", native: "मराठी", english: "Marathi", script: "Devanagari", font: "Rozha One", bodyFont: "Tiro Devanagari Marathi", seo: "लग्न पत्रिका मराठी", flag: "🇮🇳" },
  { code: "raj", native: "राजस्थानी", english: "Rajasthani", script: "Devanagari", font: "Yatra One", bodyFont: "Tiro Devanagari Hindi", seo: "rajasthani wedding card", flag: "🇮🇳" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", script: "Gurmukhi", font: "Baloo Paaji 2", bodyFont: "Mukta Mahee", seo: "punjabi wedding card design", flag: "🇮🇳" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", script: "Gujarati", font: "Baloo Bhaijaan 2", bodyFont: "Mukta Vaani", seo: "લગ્ન કાર્ડ ગુજરાતી", flag: "🇮🇳" },
  { code: "bn", native: "বাংলা", english: "Bengali", script: "Bengali", font: "Baloo Da 2", bodyFont: "Noto Serif Bengali", seo: "bengali wedding card", flag: "🇮🇳" },
  { code: "ta", native: "தமிழ்", english: "Tamil", script: "Tamil", font: "Catamaran", bodyFont: "Mukta Malar", seo: "tamil wedding invitation", flag: "🇮🇳" },
  { code: "te", native: "తెలుగు", english: "Telugu", script: "Telugu", font: "Noto Sans Telugu", bodyFont: "Mallanna", seo: "telugu wedding card", flag: "🇮🇳" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", script: "Malayalam", font: "Noto Sans Malayalam", bodyFont: "Manjari", seo: "malayalam wedding card", flag: "🇮🇳" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", script: "Kannada", font: "Baloo Tamma 2", bodyFont: "Baloo Tamma 2", seo: "kannada wedding card", flag: "🇮🇳" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia", script: "Odia", font: "Baloo Bhaina 2", bodyFont: "Baloo Bhaina 2", seo: "odia wedding card", flag: "🇮🇳" },
  { code: "ur", native: "اردو", english: "Urdu", script: "Urdu", font: "Noto Nastaliq Urdu", bodyFont: "Noto Nastaliq Urdu", seo: "urdu shaadi card", flag: "🇮🇳", rtl: true },
];

export const getLanguage = (code?: string | null): Language =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];

/** Detect script from the text the user typed, so fonts auto-switch. */
export function detectScript(text: string): LangCode | null {
  if (!text) return null;
  if (/[\u0A00-\u0A7F]/.test(text)) return "pa";
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu";
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
  if (/[\u0B00-\u0B7F]/.test(text)) return "or";
  if (/[\u0600-\u06FF]/.test(text)) return "ur";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  return null;
}
