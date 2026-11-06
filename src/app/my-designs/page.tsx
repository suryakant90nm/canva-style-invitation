import { Footer, Header } from "@/components/Header";
import MyDesigns from "./MyDesigns";

export default function MyDesignsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My designs</h1>
        <p className="mt-1 text-slate-500">Everything you create is auto-saved here (on this device).</p>
        <MyDesigns />
      </main>
      <Footer />
    </>
  );
}
