"use client";

import { useState } from "react";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (r.ok) {
      window.location.reload();
      return;
    }
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    setErr(j.error ?? "Login failed");
    setBusy(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-2xl text-white">
            🔐
          </span>
          <h1 className="mt-3 text-xl font-extrabold">Super Admin</h1>
          <p className="text-xs text-slate-500">ShubhInvite control panel</p>
        </div>

        {!configured ? (
          <div className="rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            <b>Admin not set up yet.</b>
            <p className="mt-1">
              Add an environment variable <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code> (min 6
              characters) in Vercel → Settings → Environment Variables, then redeploy.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            {err && <p className="text-sm text-rose-600">{err}</p>}
            <button
              disabled={busy || !pw}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {busy ? "Checking…" : "Sign in"}
            </button>
          </form>
        )}
        <a href="/" className="mt-5 block text-center text-xs text-slate-400 hover:text-slate-600">
          ← Back to site
        </a>
      </div>
    </main>
  );
}
