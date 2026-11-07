"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Small "Admin" shortcut in the header — rendered only for a signed-in super admin. */
export default function AdminLink() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((j: { admin: boolean }) => setOn(!!j.admin))
      .catch(() => undefined);
  }, []);
  if (!on) return null;
  return (
    <Link
      href="/admin"
      className="hidden items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 sm:flex"
      title="Super admin panel"
    >
      🔐 Admin
    </Link>
  );
}
