import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/hub-session";
import { getChapterById } from "@/lib/hub-data";
import { getInvite, getSlot } from "@/lib/hub-kv";
import { sendInviteEmail } from "@/lib/hub-mail";
import { COUNTRY_ROLE_LABEL, OFFICER_ROLE_LABEL, countryFromScope, type OfficerRole } from "@/lib/hub-types";

const ROLES: OfficerRole[] = ["lead", "deputy", "treasurer"];

/** Admin-only: email a seat's pending invite link to one address. */
export async function POST(req: Request) {
  const session = await getActiveSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 403 });
  }

  const { chapterId, role, to } = await req.json().catch(() => ({}));
  if (typeof chapterId !== "string" || !ROLES.includes(role) || typeof to !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const email = to.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const slot = await getSlot(chapterId, role);
  if (slot.status !== "invited") {
    return NextResponse.json({ error: "This seat has no pending invite link." }, { status: 400 });
  }
  const invite = await getInvite(slot.token);
  if (invite?.email && invite.email !== email) {
    return NextResponse.json(
      { error: `This link only works for ${invite.email}.` },
      { status: 400 }
    );
  }

  const country = countryFromScope(chapterId);
  const chapter = country ? null : await getChapterById(chapterId);
  const place = country ?? chapter?.institution;
  if (!place) return NextResponse.json({ error: "Chapter not found." }, { status: 404 });

  const result = await sendInviteEmail({
    to: email,
    roleLabel: (country ? COUNTRY_ROLE_LABEL[role as OfficerRole] : OFFICER_ROLE_LABEL[role as OfficerRole]) ?? "a member",
    place,
    path: `/hub/invite/${slot.token}`,
  });
  if (!result.sent) return NextResponse.json({ error: result.error }, { status: 503 });
  return NextResponse.json({ success: true });
}
