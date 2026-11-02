/**
 * Brand + SEO configuration for the Indian market.
 * Primary keywords targeted: invitation card maker, wedding/marriage card design,
 * baby shower invitation, birthday invitation card with name and photo, shubh vivah card.
 */
export const SITE = {
  name: "ShubhInvite",
  legalName: "ShubhInvite – Free Invitation Card Maker",
  domain: "shubhinvite.com",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000",
  tagline: "Free Invitation Card Maker Online with Name & Photo",
  description:
    "Create beautiful invitation, marriage, baby shower and birthday cards online for free. Choose a shubh vivah card design, add your name, date and photos, then download in HD or share on WhatsApp.",
  keywords: [
    "invitation card maker",
    "free invitation card maker online",
    "wedding card design",
    "marriage card maker",
    "shadi card design",
    "shubh vivah card",
    "baby shower invitation card",
    "godh bharai invitation",
    "birthday invitation card maker with name and photo",
    "invitation card maker with photo",
    "hindi wedding card",
    "e invitation maker india",
    "whatsapp invitation card",
  ],
  locale: "en_IN",
  social: { twitter: "@shubhinvite" },
} as const;

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
