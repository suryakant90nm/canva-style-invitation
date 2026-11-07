import type { Metadata } from "next";
import { Footer, Header } from "@/components/Header";
import { RevealObserver } from "@/components/Motion";
import StoryBuilder from "./StoryBuilder";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Story Invite — Haldi, Mehendi, Shaadi & Reception cards in one",
  description:
    "Create a multi-event wedding invitation in your language — Haldi, Mehendi, Sangeet, Shaadi and Reception pages together. Hindi, Marathi, Punjabi, Gujarati, Tamil, Telugu, Bengali and more. Download or share on WhatsApp.",
  keywords: [
    "multi event wedding invitation",
    "haldi mehendi shaadi card",
    "hindi wedding invitation card maker",
    "marathi lagna patrika maker",
    "punjabi wedding card online",
    "wedding invitation video maker india",
    ...SITE.keywords,
  ],
  alternates: { canonical: "/story" },
  openGraph: { title: `Story Invite | ${SITE.name}`, description: "All wedding events, one beautiful invite.", url: `${SITE.url}/story` },
};

export default function StoryPage() {
  return (
    <>
      <Header />
      <RevealObserver />
      <StoryBuilder />
      <Footer />
    </>
  );
}
