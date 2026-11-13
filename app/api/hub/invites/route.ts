import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/hub-session";
import { createInvite, revokeSlot } from "@/lib/hub-kv";
import type { OfficerRole } from "@/lib/hub-types";

const VALID_ROLES: OfficerRole[] = ["lead", "deputy", "treasurer"];

function isValidRole(role: unknown): role is OfficerRole {
  return typeof role === "string" && VALID_ROLES.includes(role as OfficerRole);
}

export async function POST(req: Request) {
  const session = await getActiveSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  try {
    const { chapterId, role } = await req.json();
    if (typeof chapterId !== "string" || !chapterId || !isValidRole(role)) {
      return NextResponse.json({ error: "A chapterId and a valid role are required." }, { status: 400 });
    }

    const token = await createInvite(chapterId, role, session.email);
    return NextResponse.json({ success: true, token, path: `/hub/invite/${token}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create invite.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await getActiveSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  try {
    const { chapterId, role } = await req.json();
    if (typeof chapterId !== "string" || !chapterId || !isValidRole(role)) {
      return NextResponse.json({ error: "A chapterId and a valid role are required." }, { status: 400 });
    }

    await revokeSlot(chapterId, role);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to revoke access.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
