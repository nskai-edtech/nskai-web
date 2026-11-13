/**
 * Password handling for the Chapter Hub. Officers choose a password when they
 * activate their invite link; it is stored only as a salted scrypt hash on
 * their KV account. Admins share one password held in ADMIN_PASSWORD.
 */
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const MIN_PASSWORD_LENGTH = 8;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string | undefined): boolean {
  if (!stored) return false;
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64url");
  const actual = scryptSync(password, Buffer.from(saltB64, "base64url"), expected.length);
  return timingSafeEqual(actual, expected);
}

/** Admins are an email allowlist (ADMIN_EMAILS) plus this one shared password.
 * There is no fallback: with ADMIN_PASSWORD unset, no one can sign in as admin. */
export function verifyAdminPassword(password: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    console.warn("ADMIN_PASSWORD is not set — no one can sign in as a Chapter Hub admin.");
    return false;
  }
  // Hash both sides so the comparison is constant-time whatever their lengths.
  const a = createHash("sha256").update(password).digest();
  const b = createHash("sha256").update(configured).digest();
  return timingSafeEqual(a, b);
}
