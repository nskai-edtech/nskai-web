import { redirect } from "next/navigation";
import AdminPasswordForm from "@/components/hub/AdminPasswordForm";
import type { Metadata } from "next";
import { getActiveSession } from "@/lib/hub-session";
import { getChapters, getAllRequests } from "@/lib/hub-data";
import { getSlotsForChapter } from "@/lib/hub-kv";
import type { OfficerRole, HubSlot } from "@/lib/hub-types";
import AdminDashboardClient from "@/components/hub/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Global Chapter Oversight — Admin",
  description: "Centralized governance, request approvals, and compliance ledger for NSK AI campus chapters.",
};

export default async function AdminPage() {
  const session = await getActiveSession();

  // If not logged in, redirect to login
  if (!session) {
    redirect("/hub/login");
  }

  // If not an admin, redirect to normal officer hub
  if (session.role !== "admin") {
    redirect("/hub");
  }

  const [chapters, requests] = await Promise.all([
    getChapters(),
    getAllRequests(),
  ]);

  const slotEntries = await Promise.all(
    chapters.map(async (c) => [c.id, await getSlotsForChapter(c.id)] as [string, Record<OfficerRole, HubSlot>])
  );
  const slotsByChapter = Object.fromEntries(slotEntries);

  return (
    <>
      <AdminDashboardClient
        session={session}
        chapters={chapters}
        requests={requests}
        slotsByChapter={slotsByChapter}
      />
      <AdminPasswordForm />
    </>
  );
}
