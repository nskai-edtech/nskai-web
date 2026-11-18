import { NextResponse } from "next/server";
import { activateInvite } from "@/lib/hub-kv";
import { authenticateEmail, setSessionCookie } from "@/lib/hub-session";
import { MIN_PASSWORD_LENGTH } from "@/lib/hub-password";

export async function POST(req: Request) {
  try {
    const { token, name, email, password } = await req.json();
    if (typeof token !== "string" || !token) {
      return NextResponse.json({ error: "Missing invite token." }, { status: 400 });
    }
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.` },
        { status: 400 }
      );
    }

    await activateInvite(token, name, email, password);
    const session = await authenticateEmail(email);
    if (!session) throw new Error("Could not sign you in. Try signing in from the login page.");
    await setSessionCookie(session);

    return NextResponse.json({ success: true, redirect: session.role === "country" ? "/hub/country" : "/hub" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not activate this invite.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
