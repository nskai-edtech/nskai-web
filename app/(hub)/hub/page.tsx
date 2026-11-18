import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getActiveSession } from "@/lib/hub-session";
import { getChapterById, getUdaraAmbassadors, getRequestsForChapter } from "@/lib/hub-data";
import { getSlot, getSlotsForChapter, getExecutives } from "@/lib/hub-kv";
import { countryScopeId } from "@/lib/hub-types";
import OfficerDashboardClient from "@/components/hub/OfficerDashboardClient";

export const metadata: Metadata = {
  title: "Chapter Operations Hub",
  description: "Internal operations, clearance requests, and chapter governance for NSK AI campus leads.",
};

export default async function HubPage() {
  const session = await getActiveSession();

  // Not logged in, or an admin revoked this account since the cookie was issued
  if (!session) {
    redirect("/hub/login");
  }

  // If super admin, redirect to admin console
  if (session.role === "admin") {
    redirect("/hub/admin");
  }
  if (session.role === "country") {
    redirect("/hub/country");
  }

  const chapter = session.chapterId ? await getChapterById(session.chapterId) : null;
  if (!chapter) {
    redirect("/hub/login");
  }

  const [ambassadors, requests, executives] = await Promise.all([
    getUdaraAmbassadors(chapter.id),
    getRequestsForChapter(chapter.id),
    getExecutives(chapter.id),
  ]);

  const director = await getSlot(countryScopeId(chapter.country), "lead");

  return (
    <OfficerDashboardClient
      session={session}
      chapter={chapter}
      ambassadors={ambassadors}
      slots={await getSlotsForChapter(chapter.id)}
      requests={requests}
      executives={executives}
      countryDirectorName={director.status === "active" ? director.name : undefined}
    />
  );
}
