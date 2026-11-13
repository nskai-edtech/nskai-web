import { cookies } from "next/headers";
import type { HubSession } from "./hub-types";
import { isAdminEmail, getChapterById } from "./hub-data";
import { getAccountByEmail } from "./hub-kv";

const COOKIE_NAME = "nskai_hub_session";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is not set. Refusing to sign or verify Chapter Hub sessions with a guessable default in production."
    );
  }
  console.warn(
    "SESSION_SECRET is not set — using an insecure development-only fallback. Set SESSION_SECRET before deploying."
  );
  return "nskai-chapter-hub-dev-only-secret";
}

/** Lightweight HMAC signature using native Web Crypto */
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSession(session: HubSession): Promise<string> {
  const enc = new TextEncoder();
  const data = JSON.stringify(session);
  const dataB64 = Buffer.from(data).toString("base64url");
  const key = await getCryptoKey();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(dataB64));
  const sigB64 = Buffer.from(sig).toString("base64url");
  return `${dataB64}.${sigB64}`;
}

export async function verifySessionToken(token: string): Promise<HubSession | null> {
  try {
    const [dataB64, sigB64] = token.split(".");
    if (!dataB64 || !sigB64) return null;

    const enc = new TextEncoder();
    const key = await getCryptoKey();
    const sig = Buffer.from(sigB64, "base64url");
    const valid = await crypto.subtle.verify("HMAC", key, sig, enc.encode(dataB64));
    if (!valid) return null;

    const json = Buffer.from(dataB64, "base64url").toString("utf8");
    return JSON.parse(json) as HubSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<HubSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(session: HubSession): Promise<void> {
  const token = await signSession(session);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Authenticate an email against the admin allowlist and KV-backed officer accounts
 * created through chapter invite links. */
export async function authenticateEmail(email: string): Promise<HubSession | null> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check if Super Admin
  if (isAdminEmail(cleanEmail)) {
    return {
      email: cleanEmail,
      role: "admin",
      name: cleanEmail.includes("director") ? "Country Director Admin" : "Global Admin",
    };
  }

  // 2. Check if the email holds an active officer seat (created via an invite link)
  const account = await getAccountByEmail(cleanEmail);
  if (account) {
    const chapter = await getChapterById(account.chapterId);
    return {
      email: cleanEmail,
      role: "officer",
      chapterId: account.chapterId,
      officerRole: account.role,
      name: chapter ? `${account.name} (${chapter.institution})` : account.name,
    };
  }

  return null;
}

/** Re-checks an officer's session against the live KV account on every hub page load,
 * so an admin revoking access takes effect immediately rather than waiting out the
 * session cookie. Admin sessions are not KV-backed and pass through unchanged. */
export async function getActiveSession(): Promise<HubSession | null> {
  const session = await getSession();
  if (!session || session.role !== "officer") return session;

  const account = await getAccountByEmail(session.email);
  if (!account || account.chapterId !== session.chapterId) {
    await clearSessionCookie();
    return null;
  }
  return session;
}
