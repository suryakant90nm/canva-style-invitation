import { NextRequest } from "next/server";
import { ADMIN_COOKIE, adminConfigured, checkPassword, cookieOptions, makeToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** POST { password } → sets the admin cookie. */
export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return Response.json(
      { error: "Admin is not configured. Set ADMIN_PASSWORD in environment variables." },
      { status: 503 },
    );
  }
  const body = (await req.json().catch(() => null)) as { password?: string } | null;
  const pw = body?.password ?? "";
  // small constant delay to blunt brute force
  await new Promise((r) => setTimeout(r, 350));
  if (!checkPassword(pw)) return Response.json({ error: "Wrong password" }, { status: 401 });

  const res = Response.json({ ok: true });
  const c = cookieOptions;
  res.headers.append(
    "Set-Cookie",
    `${ADMIN_COOKIE}=${makeToken()}; Path=${c.path}; Max-Age=${c.maxAge}; HttpOnly; SameSite=${c.sameSite}${c.secure ? "; Secure" : ""}`,
  );
  return res;
}

/** DELETE → logout */
export async function DELETE() {
  const res = Response.json({ ok: true });
  res.headers.append("Set-Cookie", `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=lax`);
  return res;
}
