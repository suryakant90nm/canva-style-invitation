import { getDesign } from "@/lib/data";
import Editor from "@/components/editor/Editor";
import EditorFallback from "./EditorFallback";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Card Editor",
  robots: { index: false, follow: false },
};

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const valid = /^[0-9a-f-]{6,40}$/i.test(id);
  const row = valid ? await getDesign(id) : null;

  if (row) {
    return <Editor id={row.id} initialTitle={row.title} category={row.category} initialDoc={row.data} />;
  }

  // Not on this server instance (serverless without a database) → the browser
  // keeps a mirror of every design it created; load from there.
  return <EditorFallback id={id} />;
}
