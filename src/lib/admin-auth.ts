import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Super-admin authentication.
 *
 * Single shared secret from env (ADMIN_PASSWORD). On login we set a signed,
 * HttpOnly cookie (HMAC of a fixed payload with ADMIN_PASSWORD as the key),
 * valid for 7 days. No database, works on serverless.
 *
 * Set in Vercel → Settings → Environment Variables:
 *   ADMIN_PASSWORD = a-long-random-secret
 */

export const ADMIN_COOKIE = "shubh_admin";
const TTL_SEC = 60 * 60 * 24 * 7;

function secret(): string | null {
  const s = process.env.ADMIN_PASSWORD?.trim();
  return s && s.length >= 6 ? s : null;
}

export const adminConfigured = () => secret() !== null;

function sign(payload: string): string {
  return createHmac("sha256", secret() ?? "unset").update(payload).digest("hex");
}

export function makeToken(): string {
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [who, expStr, sig] = parts;
  if (who !== "admin") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(`${who}.${expStr}`);
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function checkPassword(input: string): boolean {
  const s = secret();
  if (!s) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(s);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Server-side helper for pages / route handlers. */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: TTL_SEC,
};
