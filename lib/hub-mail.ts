/**
 * Sends a Chapter Hub invite link by email, when an admin clicks "Email link"
 * on /hub/admin. Uses Resend (free plan: 3,000 emails/month, 100/day), the same
 * provider as the contact form. Needs RESEND_API_KEY and HUB_FROM_ADDRESS
 * (falls back to CONTACT_FROM_ADDRESS) with nskai.org verified in Resend.
 */
import { SITE_URL } from "./nav";

export async function sendInviteEmail(opts: {
  to: string;
  roleLabel: string;
  place: string;
  path: string;
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.HUB_FROM_ADDRESS || process.env.CONTACT_FROM_ADDRESS;
  if (!apiKey || !from) {
    return { sent: false, error: "Email is not connected yet (RESEND_API_KEY / HUB_FROM_ADDRESS). Copy the link instead." };
  }

  const text = [
    "Hello,",
    "",
    `You have been added as ${opts.roleLabel} for ${opts.place} on the NSK AI Chapter Hub.`,
    "",
    "Open this link to set your password and sign in:",
    `${SITE_URL}${opts.path}`,
    "",
    `The link works once. After that, sign in at ${SITE_URL}/hub/login with this email and your password.`,
    "",
    "NSK AI",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: `Your NSK AI Chapter Hub access (${opts.place})`,
        text,
      }),
    });
    if (!res.ok) {
      console.error("Hub invite email failed", res.status, await res.text());
      return { sent: false, error: "The email could not be sent. Copy the link instead." };
    }
    return { sent: true };
  } catch (err) {
    console.error("Hub invite email failed", err);
    return { sent: false, error: "The email could not be sent. Copy the link instead." };
  }
}
