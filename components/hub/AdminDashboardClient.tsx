"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChapterExecutive } from "@/lib/hub-types";
import type { Chapter, ClearanceRequest, HubSession, HubSlot, OfficerRole } from "@/lib/hub-types";
import { OFFICER_ROLE_LABEL, COUNTRY_ROLE_LABEL, countryScopeId, countryFromScope } from "@/lib/hub-types";
import styles from "@/app/(hub)/hub/admin/admin.module.css";

interface Props {
  session: HubSession;
  chapters: Chapter[];
  requests: ClearanceRequest[];
  slotsByChapter: Record<string, Record<OfficerRole, HubSlot>>;
  executivesByChapter: Record<string, ChapterExecutive[]>;
}

const OFFICER_ROLES: OfficerRole[] = ["lead", "deputy", "treasurer"];
const COUNTRY_ROLES: OfficerRole[] = ["lead", "deputy"];

export default function AdminDashboardClient({
  session,
  chapters,
  requests,
  slotsByChapter,
  executivesByChapter,
}: Props) {
  const countries = Array.from(new Set(chapters.map((c) => c.country))).sort();
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const [slots, setSlots] = useState(slotsByChapter);
  const [pendingSlot, setPendingSlot] = useState<string | null>(null);
  const [slotErrors, setSlotErrors] = useState<Record<string, string>>({});
  const [generatedLinks, setGeneratedLinks] = useState<Record<string, string>>({});

  const slotKey = (chapterId: string, role: OfficerRole) => `${chapterId}:${role}`;

  const handleGenerateInvite = async (chapterId: string, role: OfficerRole) => {
    const key = slotKey(chapterId, role);
    setPendingSlot(key);
    setSlotErrors((prev) => ({ ...prev, [key]: "" }));
    try {
      const res = await fetch("/api/hub/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, role }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSlotErrors((prev) => ({ ...prev, [key]: data.error || "Failed to create invite." }));
        return;
      }
      setGeneratedLinks((prev) => ({ ...prev, [key]: `${window.location.origin}${data.path}` }));
      setSlots((prev) => ({
        ...prev,
        [chapterId]: {
          ...prev[chapterId],
          [role]: { status: "invited", token: data.token, createdAt: new Date().toISOString(), createdBy: session.email },
        },
      }));
    } catch {
      setSlotErrors((prev) => ({ ...prev, [key]: "Network error creating invite." }));
    } finally {
      setPendingSlot(null);
    }
  };

  const handleRevoke = async (chapterId: string, role: OfficerRole) => {
    const key = slotKey(chapterId, role);
    setPendingSlot(key);
    setSlotErrors((prev) => ({ ...prev, [key]: "" }));
    try {
      const res = await fetch("/api/hub/invites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, role }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSlotErrors((prev) => ({ ...prev, [key]: data.error || "Failed to revoke access." }));
        return;
      }
      setGeneratedLinks((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setSlots((prev) => ({
        ...prev,
        [chapterId]: { ...prev[chapterId], [role]: { status: "empty" } },
      }));
    } catch {
      setSlotErrors((prev) => ({ ...prev, [key]: "Network error revoking access." }));
    } finally {
      setPendingSlot(null);
    }
  };

  const charteredCount = chapters.filter((c) => c.status === "chartered").length;
  const interimCount = chapters.filter((c) => c.status === "interim").length;

  const filteredChapters = chapters.filter((c) => {
    const q = filterQuery.toLowerCase();
    return (
      c.institution.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.leadName.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  });

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/hub/revalidate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncMessage("Cache successfully refreshed from Master Google Sheet.");
        router.refresh();
      } else {
        setSyncMessage(data.error || "Sync failed.");
      }
    } catch {
      setSyncMessage("Network error during cache revalidation.");
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/hub/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      router.push("/hub/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const renderSeat = (scopeId: string, role: OfficerRole, label: string) => {
              const key = slotKey(scopeId, role);
              const slot = slots[scopeId]?.[role] ?? { status: "empty" as const };
              const isPending = pendingSlot === key;
              const error = slotErrors[key];
              const link = generatedLinks[key];

              return (
                <div
                  key={role}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "10px 0",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: "13px", color: "var(--ink)" }}>
                      <strong>{label}</strong>
                      {slot.status === "empty" && (
                        <span style={{ color: "var(--ink-muted)" }}> — no invite issued</span>
                      )}
                      {slot.status === "invited" && (
                        <span style={{ color: "#D97706" }}> — invite sent, awaiting activation</span>
                      )}
                      {slot.status === "active" && (
                        <span style={{ color: "#059669" }}>
                          {" "}
                          — {slot.name} ({slot.email}), expires {new Date(slot.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {role !== "lead" && !countryFromScope(scopeId) && (() => {
                      const entered = executivesByChapter[scopeId]?.find((e) => e.seat === role);
                      return (
                        <div style={{ fontFamily: "var(--sans)", fontSize: "13px", color: "var(--ink-muted)", marginTop: "4px" }}>
                          {entered ? (
                            <>
                              Entered by lead: {entered.name} ·{" "}
                              <a href={`mailto:${entered.email}`}>{entered.email}</a>
                              {entered.phone ? ` · ${entered.phone}` : ""}
                              {slot.status === "empty" && " — generate a link and send it to this email."}
                            </>
                          ) : (
                            "Not entered by the lead yet."
                          )}
                        </div>
                      );
                    })()}
                    {link && (
                      <div style={{ marginTop: "6px", display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          readOnly
                          value={link}
                          onFocus={(e) => e.currentTarget.select()}
                          style={{
                            flex: 1,
                            maxWidth: "420px",
                            height: "32px",
                            padding: "0 8px",
                            fontFamily: "var(--mono)",
                            fontSize: "12px",
                            border: "1px solid var(--hairline)",
                            background: "#FAF8F7",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(link)}
                          style={{
                            fontSize: "12px",
                            fontFamily: "var(--mono)",
                            color: "var(--accent)",
                            background: "none",
                            border: "1px solid var(--hairline)",
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    )}
                    {slot.status === "invited" && (
                      <EmailLinkRow
                        scopeId={scopeId}
                        role={role}
                        defaultTo={executivesByChapter[scopeId]?.find((e) => e.seat === role)?.email ?? ""}
                        locked={role !== "lead" && Boolean(executivesByChapter[scopeId]?.find((e) => e.seat === role))}
                        hasLink={Boolean(link)}
                      />
                    )}
                    {error && (
                      <div style={{ marginTop: "6px", fontSize: "12px", color: "#9F1239" }}>{error}</div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    {slot.status === "empty" && (
                      <button
                        type="button"
                        onClick={() => handleGenerateInvite(scopeId, role)}
                        disabled={isPending}
                        className={styles.syncBtn}
                        style={{ fontSize: "12px", padding: "8px 14px" }}
                      >
                        {isPending ? "Generating…" : "Generate Invite Link"}
                      </button>
                    )}
                    {(slot.status === "invited" || slot.status === "active") && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(scopeId, role)}
                        disabled={isPending}
                        style={{
                          fontSize: "12px",
                          padding: "8px 14px",
                          fontFamily: "var(--sans)",
                          color: "#9F1239",
                          background: "none",
                          border: "1px solid #FECDD3",
                          cursor: "pointer",
                        }}
                      >
                        {isPending ? "Revoking…" : slot.status === "active" ? "Revoke Access" : "Revoke Invite"}
                      </button>
                    )}
                  </div>
                </div>
              );
  };

  return (
    <div className={styles.page}>
      {/* Top Header */}
      <div className={styles.topBar}>
        <div>
          <div className={styles.adminEyebrow}>NSK AI // Super Admin Console</div>
          <h1 className={styles.title}>Global Chapter Governance</h1>
          <div className={styles.adminMeta}>
            Signed in as <strong>{session.email}</strong> • Role: <strong>Global Administrator</strong>
          </div>
        </div>

        <div className={styles.topBarRight}>
          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
            disabled={loggingOut}
          >
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricVal}>{chapters.length}</span>
          <span className={styles.metricLabel}>Total Campus Chapters</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricVal} style={{ color: "#059669" }}>
            {charteredCount}
          </span>
          <span className={styles.metricLabel}>Chartered (Official) Chapters</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricVal} style={{ color: "#D97706" }}>
            {interimCount}
          </span>
          <span className={styles.metricLabel}>Interim Campus Chapters</span>
        </div>
      </div>

      {/* Cache & Sync Status Box */}
      <div className={styles.syncBox}>
        <div>
          <div style={{ fontFamily: "var(--sans)", fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
            Google Sheet Ledger Synchronization
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: "13px", color: "var(--ink-muted)" }}>
            Next.js App Router caches the master sheet for <strong>1 week (604,800s)</strong> via ISR.
            {syncMessage && <span style={{ color: "var(--accent)", marginLeft: "8px" }}>— {syncMessage}</span>}
          </div>
        </div>
        <button
          onClick={handleSyncNow}
          className={styles.syncBtn}
          disabled={syncing}
        >
          {syncing ? "Refreshing..." : "🔄 Sync Now (Revalidate Cache)"}
        </button>
      </div>

      {/* Chapter Access & Invite Links */}
      <div className={styles.cardBox} style={{ marginTop: "32px" }}>
        <h2 className={styles.boxTitle}>Chapter Access &amp; Invite Links</h2>
        <div className={styles.boxSubtitle} style={{ marginBottom: "20px" }}>
          Issue a one-time invite link for the Lead, Deputy, and Programs Coordinator seat on each chapter.
          Activated accounts expire automatically after one year, or revoke a seat here at any time.
        </div>

        {chapters.map((ch) => (
          <div key={ch.id} style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--hairline)" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginBottom: "12px" }}>
              {ch.institution} <span style={{ color: "var(--ink-muted)", fontWeight: 400 }}>({ch.country})</span>
              {" · "}
              <a href={`/hub/admin/view/${ch.id}`} style={{ fontWeight: 400 }}>
                View as Chapter Lead →
              </a>
            </div>
            {(executivesByChapter[ch.id] ?? []).some((e) => e.seat === "other") && (
              <div style={{ fontFamily: "var(--sans)", fontSize: "13px", color: "var(--ink-muted)", marginBottom: "8px" }}>
                Other executives:{" "}
                {(executivesByChapter[ch.id] ?? [])
                  .filter((e) => e.seat === "other")
                  .map((e) => `${e.title}: ${e.name} (${e.email}${e.phone ? `, ${e.phone}` : ""})`)
                  .join(" · ")}
              </div>
            )}

            {OFFICER_ROLES.map((role) => renderSeat(ch.id, role, OFFICER_ROLE_LABEL[role]))}
          </div>
        ))}
      </div>

      {/* Country Directors & Deputies */}
      <div className={styles.cardBox} style={{ marginTop: "32px" }}>
        <h2 className={styles.boxTitle}>Country Directors &amp; Deputies</h2>
        <div className={styles.boxSubtitle} style={{ marginBottom: "20px" }}>
          A Country Director or Deputy can view every chapter in their country (teams and contacts)
          but cannot change anything.
        </div>
        {countries.map((country) => (
          <div key={country} style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--hairline)" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginBottom: "12px" }}>
              {country}
              {" · "}
              <a href={`/hub/country?country=${encodeURIComponent(country)}`} style={{ fontWeight: 400 }}>
                View country →
              </a>
            </div>
            {COUNTRY_ROLES.map((role) => renderSeat(countryScopeId(country), role, COUNTRY_ROLE_LABEL[role] ?? role))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Sends a pending invite link by email (Resend free tier). For a Deputy or
 * Programs Coordinator the address is the one the lead entered and is locked. */
function EmailLinkRow({
  scopeId,
  role,
  defaultTo,
  locked,
  hasLink,
}: {
  scopeId: string;
  role: OfficerRole;
  defaultTo: string;
  locked: boolean;
  hasLink: boolean;
}) {
  const [to, setTo] = useState(defaultTo);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  if (!hasLink) {
    return (
      <div style={{ marginTop: "6px", fontSize: "12px", color: "var(--ink-muted)", fontFamily: "var(--sans)" }}>
        To email this person a link, revoke this invite and generate a new one.
      </div>
    );
  }
  return (
    <div style={{ marginTop: "6px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
      <input
        type="email"
        value={to}
        readOnly={locked}
        onChange={(e) => setTo(e.target.value)}
        placeholder="their@email.com"
        aria-label="Email the link to"
        style={{ height: "32px", padding: "0 8px", fontSize: "12px", border: "1px solid var(--hairline)", minWidth: "220px" }}
      />
      <button
        type="button"
        disabled={busy || !to}
        onClick={async () => {
          setBusy(true);
          setMsg(null);
          try {
            const res = await fetch("/api/hub/invites/email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chapterId: scopeId, role, to }),
            });
            const data = await res.json();
            setMsg(res.ok ? `Sent to ${to}.` : data.error || "Could not send.");
          } catch {
            setMsg("Network error.");
          }
          setBusy(false);
        }}
        style={{ fontSize: "12px", padding: "6px 10px", border: "1px solid var(--hairline)", background: "none", cursor: "pointer" }}
      >
        {busy ? "Sending…" : "Email link"}
      </button>
      {msg && <span style={{ fontSize: "12px", fontFamily: "var(--sans)" }}>{msg}</span>}
    </div>
  );
}
