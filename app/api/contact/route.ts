import { NextResponse } from "next/server";

const TO = "contact@nskai.org";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  org?: unknown;
  message?: unknown;
  company?: unknown;
};

const asString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot. Bots fill every field they find; humans never see this one.
  // Answer 200 so the sender learns nothing from the response.
  if (asString(payload.company)) {
    return NextResponse.json({ ok: true });
  }

  const name = asString(payload.name);
  const email = asString(payload.email);
  const org = asString(payload.org);
  const message = asString(payload.message);

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please fill in your name, a valid email and your request." },
      { status: 400 },
    );
  }

  if (name.length > 200 || email.length > 320 || org.length > 200 || message.length > 10_000) {
    return NextResponse.json({ error: "That message is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_ADDRESS;

  // No provider wired up yet — say so plainly rather than silently dropping
  // the message. The mailto: link in the aside stays available meanwhile.
  if (!apiKey || !from) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_FROM_ADDRESS is not set.");
    return NextResponse.json(
      { error: "The form is not connected yet." },
      { status: 503 },
    );
  }

  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Organisation: ${org || "—"}`,
    "",
    message,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [TO],
      reply_to: email,
      subject: `Request from ${name}`,
      text: body,
    }),
  });

  if (!response.ok) {
    console.error("Contact form: send failed", response.status, await response.text());
    return NextResponse.json({ error: "We could not send that." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
