"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Chapter, ClearanceRequest, HubSession, HubSlot, OfficerRole } from "@/lib/hub-types";
import { OFFICER_ROLE_LABEL } from "@/lib/hub-types";
import styles from "@/app/(hub)/hub/admin/admin.module.css";

interface Props {
  session: HubSession;
  chapters: Chapter[];
  requests: ClearanceRequest[];
  slotsByChapter: Record<string, Record<OfficerRole, HubSlot>>;
}

const OFFICER_ROLES: OfficerRole[] = ["lead", "deputy", "treasurer"];

export default function AdminDashboardClient({
  session,
  chapters,
  requests,
  slotsByChapter,
}: Props) {
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
  const pendingRequests = requests.filter((r) => r.status === "pending");

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
        <div className={styles.metricCard}>
          <span className={styles.metricVal} style={{ color: "#DC2626" }}>
            {pendingRequests.length}
          </span>
          <span className={styles.metricLabel}>Requests Awaiting Clearance</span>
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

      {/* Pending Triage Queue */}
      <div className={styles.cardBox} style={{ marginBottom: "32px" }}>
        <div className={styles.boxHeader}>
          <h2 className={styles.boxTitle}>Pending Clearance Triage Queue ({pendingRequests.length})</h2>
          <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Approval SLA: 48 Hours
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div style={{ padding: "16px", background: "#FAF8F7", fontSize: "14px", color: "var(--ink-muted)" }}>
            ✓ No pending requests. All chapter events, finances, and partnerships are up to date.
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Campus</th>
                  <th>Type</th>
                  <th>Request Title</th>
                  <th>Date Filed</th>
                  <th>Budget / Attendance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req.id}>
                    <td><strong>{req.institution}</strong></td>
                    <td>
                      <span className={styles.badgePendingReq}>{req.type}</span>
                    </td>
                    <td>{req.title}</td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: "12px" }}>{req.dateFiled}</td>
                    <td>{req.amount || (req.attendeesEstimate ? `${req.attendeesEstimate} pax` : "—")}</td>
                    <td>
                      <a
                        href="https://docs.google.com/spreadsheets"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "12px",
                          fontFamily: "var(--mono)",
                          color: "var(--accent)",
                          textDecoration: "underline",
                        }}
                      >
                        Review in Google Sheet ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Global Chapters Table */}
      <div className={styles.cardBox}>
        <div className={styles.boxHeader}>
          <div>
            <h2 className={styles.boxTitle}>Master Chapter Directory</h2>
            <div style={{ fontFamily: "var(--sans)", fontSize: "13px", color: "var(--ink-muted)", marginTop: "4px" }}>
              Filter and audit campus chapters across all active countries.
            </div>
          </div>
          <a
            href="https://docs.google.com/spreadsheets"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sheetLinkBtn}
          >
            📊 Open Master Google Sheet ↗
          </a>
        </div>

        {/* Filter input */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by campus, country, lead name, or status..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "40px",
              padding: "0 12px",
              fontFamily: "var(--sans)",
              fontSize: "14px",
              border: "1px solid var(--hairline)",
              outline: "none",
            }}
          />
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Campus &amp; Country</th>
                <th>Status</th>
                <th>Chapter Lead</th>
                <th>Faculty Rep</th>
                <th>Udara MOU</th>
                <th>Members</th>
                <th>Reporting</th>
              </tr>
            </thead>
            <tbody>
              {filteredChapters.map((ch) => (
                <tr key={ch.id}>
                  <td>
                    <strong>{ch.institution}</strong>
                    <div style={{ fontSize: "12px", color: "var(--ink-muted)" }}>{ch.country}</div>
                  </td>
                  <td>
                    {ch.status === "chartered" ? (
                      <span className={styles.badgeChartered}>Chartered</span>
                    ) : (
                      <span className={styles.badgeInterim}>Interim</span>
                    )}
                  </td>
                  <td>
                    <div>{ch.leadName}</div>
                    <div style={{ fontSize: "12px", color: "var(--ink-muted)", fontFamily: "var(--mono)" }}>
                      {ch.leadEmail}
                    </div>
                  </td>
                  <td>
                    {ch.facultyRepConfirmed ? (
                      <span style={{ color: "#059669", fontSize: "13px" }}>
                        ✓ {ch.facultyRepName || "Confirmed"}
                      </span>
                    ) : (
                      <span style={{ color: "#D97706", fontSize: "13px" }}>⏳ Pending</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "11px", textTransform: "uppercase" }}>
                      {ch.udaraMouStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: "13px" }}>{ch.totalMembers}</td>
                  <td>
                    <span style={{ fontSize: "13px" }}>
                      {ch.lastReportSubmittedMonth ? `✓ ${ch.lastReportSubmittedMonth}` : "⚠️ Overdue"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            </div>

            {OFFICER_ROLES.map((role) => {
              const key = slotKey(ch.id, role);
              const slot = slots[ch.id]?.[role] ?? { status: "empty" as const };
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
                      <strong>{OFFICER_ROLE_LABEL[role]}</strong>
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
                    {error && (
                      <div style={{ marginTop: "6px", fontSize: "12px", color: "#9F1239" }}>{error}</div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    {slot.status === "empty" && (
                      <button
                        type="button"
                        onClick={() => handleGenerateInvite(ch.id, role)}
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
                        onClick={() => handleRevoke(ch.id, role)}
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
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
