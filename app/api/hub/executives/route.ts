import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/hub-session";
import { getChapterById } from "@/lib/hub-data";
import { setExecutives } from "@/lib/hub-kv";
import { OFFICER_ROLE_LABEL, type ChapterExecutive } from "@/lib/hub-types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EXECUTIVES = 20;

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Saves a chapter's executive team. The Chapter Lead saves their own chapter;
 * an admin may save any chapter (from "View as Chapter Lead"). Deputy and
 * Programs Coordinator are required. Nothing is sent: an admin sees their
 * emails on /hub/admin, generates each one's invite link and sends it by hand.
 */
export async function POST(req: Request) {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  let body: { chapterId?: unknown; executives?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let chapterId: string | undefined;
  if (session.role === "admin") {
    chapterId = typeof body.chapterId === "string" ? body.chapterId : undefined;
  } else if (session.role === "officer" && session.officerRole === "lead") {
    chapterId = session.chapterId;
  } else {
    return NextResponse.json({ error: "Only the Chapter Lead can edit the executive team." }, { status: 403 });
  }
  const chapter = chapterId ? await getChapterById(chapterId) : null;
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
  }

  if (!Array.isArray(body.executives) || body.executives.length > MAX_EXECUTIVES) {
    return NextResponse.json({ error: "Invalid executive list." }, { status: 400 });
  }

  const execs: ChapterExecutive[] = [];
  for (const raw of body.executives as Record<string, unknown>[]) {
    const seat = raw?.seat === "deputy" || raw?.seat === "treasurer" ? raw.seat : "other";
    const exec: ChapterExecutive = {
      seat,
      title: seat === "other" ? clean(raw?.title, 80) : OFFICER_ROLE_LABEL[seat],
      name: clean(raw?.name, 120),
      email: clean(raw?.email, 320).toLowerCase(),
      phone: clean(raw?.phone, 40) || undefined,
    };
    if (!exec.name || !exec.title) {
      return NextResponse.json({ error: "Every executive needs a role and a name." }, { status: 400 });
    }
    if (!EMAIL_RE.test(exec.email)) {
      return NextResponse.json({ error: `Enter a valid email for ${exec.name}.` }, { status: 400 });
    }
    execs.push(exec);
  }

  const deputy = execs.filter((e) => e.seat === "deputy");
  const coordinator = execs.filter((e) => e.seat === "treasurer");
  if (deputy.length !== 1 || coordinator.length !== 1) {
    return NextResponse.json(
      { error: "A Deputy Lead and a Programs Coordinator are both required." },
      { status: 400 }
    );
  }
  if (deputy[0].email === coordinator[0].email) {
    return NextResponse.json(
      { error: "The Deputy Lead and Programs Coordinator need different emails." },
      { status: 400 }
    );
  }

  try {
    await setExecutives(chapter.id, execs);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save the executive team.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
