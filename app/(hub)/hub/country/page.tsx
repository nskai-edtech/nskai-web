import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getActiveSession } from "@/lib/hub-session";
import { getChapters } from "@/lib/hub-data";
import { getSlotsForChapter, getExecutives } from "@/lib/hub-kv";
import { OFFICER_ROLE_LABEL } from "@/lib/hub-types";
import CountrySignOut from "@/components/hub/CountrySignOut";
import styles from "../hub.module.css";

export const metadata: Metadata = {
  title: "Country Overview — Chapter Hub",
  robots: { index: false },
};

/** Read-only view of every chapter in one country, for its Country Director
 * and Country Deputy. Admins can open any country with ?country=<name>. */
export default async function CountryPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const session = await getActiveSession();
  if (!session) redirect("/hub/login");

  let country: string | undefined;
  if (session.role === "country") country = session.country;
  else if (session.role === "admin") country = (await searchParams).country;
  else redirect("/hub");
  if (!country) redirect("/hub/admin");

  const allChapters = await getChapters();
  const chapters = allChapters.filter((c) => c.country === country);
  const details = await Promise.all(
    chapters.map(async (c) => ({
      chapter: c,
      slots: await getSlotsForChapter(c.id),
      executives: await getExecutives(c.id),
    }))
  );
  const registeredLeads = details.filter((d) => d.slots.lead.status === "active").length;

  return (
    <div className={styles.page}>
      {session.role === "admin" && (
        <div className={styles.previewBanner}>
          <span>Admin preview: this is what the {country} Country Director and Deputy see.</span>
          <a href="/hub/admin">← Back to admin</a>
        </div>
      )}
      <div className={styles.topBar}>
        <div>
          <div className={styles.schoolEyebrow}>NSK AI Country Overview</div>
          <h1 className={styles.institutionTitle}>{country}</h1>
          <div className={styles.officerMeta}>
            Signed in as <strong>{session.name}</strong> · view only
          </div>
        </div>
        {session.role === "country" && (
          <div className={styles.topBarActions}>
            <CountrySignOut />
          </div>
        )}
      </div>

      <div className={styles.udaraMetricsRow} style={{ marginBottom: 32 }}>
        <div className={styles.metricBadge}>
          <span className={styles.metricNum}>{chapters.length}</span>
          <span className={styles.metricLabel}>Chapters</span>
        </div>
        <div className={styles.metricBadge}>
          <span className={styles.metricNum}>{registeredLeads}</span>
          <span className={styles.metricLabel}>Leads signed in</span>
        </div>
      </div>

      {details.map(({ chapter, slots, executives }) => (
        <div key={chapter.id} className={styles.cardBox} style={{ marginBottom: 24 }}>
          <h2 className={styles.boxTitle}>{chapter.institution}</h2>

          {(["lead", "deputy", "treasurer"] as const).map((role) => {
            const slot = slots[role];
            const entered = executives.find((e) => e.seat === role);
            return (
              <p key={role} style={{ margin: "8px 0", lineHeight: 1.5 }}>
                <strong>{OFFICER_ROLE_LABEL[role]}:</strong>{" "}
                {slot.status === "active" ? (
                  <>
                    {slot.name} · <a href={`mailto:${slot.email}`}>{slot.email}</a>
                  </>
                ) : entered ? (
                  <>
                    {entered.name} · <a href={`mailto:${entered.email}`}>{entered.email}</a>{" "}
                    <span style={{ color: "var(--ink-muted)" }}>(not signed in yet)</span>
                  </>
                ) : (
                  <span style={{ color: "var(--ink-muted)" }}>not registered</span>
                )}
              </p>
            );
          })}
          {executives
            .filter((e) => e.seat === "other")
            .map((e, i) => (
              <p key={i} style={{ margin: "8px 0", lineHeight: 1.5 }}>
                <strong>{e.title}:</strong> {e.name} · <a href={`mailto:${e.email}`}>{e.email}</a>
                {e.phone ? ` · ${e.phone}` : ""}
              </p>
            ))}

        </div>
      ))}
    </div>
  );
}
