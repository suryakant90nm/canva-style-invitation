import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const configured = adminConfigured();
  const authed = configured && (await isAdmin());
  if (!authed) return <AdminLogin configured={configured} />;
  return <AdminPanel />;
}
