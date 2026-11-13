import { NextResponse } from "next/server";
import { authenticateEmail, getActiveSession, setSessionCookie, clearSessionCookie } from "@/lib/hub-session";
import {
  clearFailedLogins,
  getAdminPasswordHash,
  setAdminPassword,
  getAccountByEmail,
  isLoginLocked,
  recordFailedLogin,
} from "@/lib/hub-kv";
import { isAdminEmail } from "@/lib/hub-data";
import { MIN_PASSWORD_LENGTH, verifyAdminPassword, verifyPassword } from "@/lib/hub-password";

// One message for "no such account" and "wrong password", so the form never
// confirms which emails are registered.
const BAD_CREDENTIALS = "That email or password is incorrect.";

/** A password changed from the admin page wins over the ADMIN_PASSWORD default. */
async function checkAdminPassword(password: string): Promise<boolean> {
  const changed = await getAdminPasswordHash();
  return changed ? verifyPassword(password, changed) : verifyAdminPassword(password);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password } = body;

    if (action === "logout") {
      await clearSessionCookie();
      return NextResponse.json({ success: true, redirect: "/hub/login" });
    }

    if (action === "login") {
      if (!email || typeof email !== "string" || !password || typeof password !== "string") {
        return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
      }
      const cleanEmail = email.trim().toLowerCase();

      if (await isLoginLocked(cleanEmail)) {
        return NextResponse.json(
          { error: "Too many wrong attempts. Wait 15 minutes and try again." },
          { status: 429 }
        );
      }

      let ok: boolean;
      if (isAdminEmail(cleanEmail)) {
        ok = await checkAdminPassword(password);
      } else {
        const account = await getAccountByEmail(cleanEmail);
        ok = verifyPassword(password, account?.passwordHash);
      }

      const session = ok ? await authenticateEmail(cleanEmail) : null;
      if (!session) {
        await recordFailedLogin(cleanEmail);
        return NextResponse.json({ error: BAD_CREDENTIALS }, { status: 401 });
      }

      await clearFailedLogins(cleanEmail);
      await setSessionCookie(session);
      const redirect = session.role === "admin" ? "/hub/admin" : "/hub";
      return NextResponse.json({
        success: true,
        redirect,
        user: { name: session.name, role: session.role },
      });
    }

    if (action === "change-admin-password") {
      const session = await getActiveSession();
      if (!session || session.role !== "admin") {
        return NextResponse.json({ error: "Admin sign-in required." }, { status: 403 });
      }
      const { newPassword } = body;
      if (typeof password !== "string" || !(await checkAdminPassword(password))) {
        return NextResponse.json({ error: "The current password is incorrect." }, { status: 401 });
      }
      if (typeof newPassword !== "string" || newPassword.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json(
          { error: `The new password needs at least ${MIN_PASSWORD_LENGTH} characters.` },
          { status: 400 }
        );
      }
      await setAdminPassword(newPassword);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Auth route error:", err);
    return NextResponse.json({ error: "Sign-in failed. Please try again." }, { status: 500 });
  }
}
