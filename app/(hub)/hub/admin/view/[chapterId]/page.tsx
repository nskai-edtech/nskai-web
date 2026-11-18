import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getActiveSession } from "@/lib/hub-session";
import { getChapterById, getUdaraAmbassadors, getRequestsForChapter } from "@/lib/hub-data";
import { getSlot, getSlotsForChapter, getExecutives } from "@/lib/hub-kv";
import { countryScopeId } from "@/lib/hub-types";
import OfficerDashboardClient from "@/components/hub/OfficerDashboardClient";

export const metadata: Metadata = {
  title: "View as Chapter Lead — Admin",
  robots: { index: false },
};

/** An admin sees one chapter's hub exactly as its Chapter Lead does. */
export default async function AdminViewAsLeadPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const session = await getActiveSession();
  if (!session) redirect("/hub/login");
  if (session.role !== "admin") redirect("/hub");

  const { chapterId } = await params;
  const chapter = await getChapterById(chapterId);
  if (!chapter) notFound();

  const [ambassadors, requests, slots, executives] = await Promise.all([
    getUdaraAmbassadors(chapter.id),
    getRequestsForChapter(chapter.id),
    getSlotsForChapter(chapter.id),
    getExecutives(chapter.id),
  ]);

  const lead = slots.lead;
  const previewSession = {
    ...session,
    role: "officer" as const,
    chapterId: chapter.id,
    officerRole: "lead" as const,
    name: lead.status === "active" ? lead.name : "Chapter Lead (not registered yet)",
  };

  const director = await getSlot(countryScopeId(chapter.country), "lead");

  return (
    <OfficerDashboardClient
      session={previewSession}
      chapter={chapter}
      ambassadors={ambassadors}
      requests={requests}
      slots={slots}
      executives={executives}
      countryDirectorName={director.status === "active" ? director.name : undefined}
      adminPreview
    />
  );
}
