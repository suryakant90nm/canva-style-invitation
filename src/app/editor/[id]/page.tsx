import { notFound } from "next/navigation";
import { getDesign } from "@/lib/data";
import Editor from "@/components/editor/Editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Card Editor",
  robots: { index: false, follow: false },
};

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{6,40}$/i.test(id)) notFound();
  const row = await getDesign(id);
  if (!row) notFound();
  return <Editor id={row.id} initialTitle={row.title} category={row.category} initialDoc={row.data} />;
}
