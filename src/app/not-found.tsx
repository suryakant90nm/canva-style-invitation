import Link from "next/link";
import { Footer, Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto grid min-h-[50vh] max-w-xl place-items-center px-6 text-center">
        <div>
          <p className="text-6xl">💌</p>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink">Page not found</h1>
          <p className="mt-2 text-slate-500">This design or template doesn&apos;t exist (or was deleted).</p>
          <Link href="/templates" className="btn-shine mt-6 inline-block rounded-full bg-maroon-700 px-6 py-3 font-semibold text-white">
            Browse templates
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
