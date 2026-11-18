import { redirect } from "next/navigation";
import AdminPasswordForm from "@/components/hub/AdminPasswordForm";
import type { Metadata } from "next";
import { getActiveSession } from "@/lib/hub-session";
import { getChapters, getAllRequests } from "@/lib/hub-data";
import { getSlotsForChapter, getExecutives } from "@/lib/hub-kv";
import { countryScopeId, type OfficerRole, type HubSlot } from "@/lib/hub-types";
import AdminViewPicker from "@/components/hub/AdminViewPicker";
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

  const countries = Array.from(new Set(chapters.map((c) => c.country))).sort();
  const scopeIds = [...chapters.map((c) => c.id), ...countries.map(countryScopeId)];
  const slotEntries = await Promise.all(
    scopeIds.map(async (id) => [id, await getSlotsForChapter(id)] as [string, Record<OfficerRole, HubSlot>])
  );
  const slotsByChapter = Object.fromEntries(slotEntries);
  const executivesByChapter = Object.fromEntries(
    await Promise.all(chapters.map(async (c) => [c.id, await getExecutives(c.id)] as const))
  );

  return (
    <>
      <AdminViewPicker
        chapters={chapters.map((c) => ({ id: c.id, label: `${c.institution} (${c.country})` }))}
        countries={countries}
      />
      <AdminDashboardClient
        session={session}
        chapters={chapters}
        requests={requests}
        slotsByChapter={slotsByChapter}
        executivesByChapter={executivesByChapter}
      />
      <AdminPasswordForm />
    </>
  );
}
