"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Chapter, UdaraAmbassador, ClearanceRequest, HubSession, ChapterExecutive } from "@/lib/hub-types";
import ExecutivesForm from "./ExecutivesForm";
import { MONTH_LABEL, PAPER_TOPICS, PROJECT_DEMOS } from "@/lib/hub-monthly";
import { OFFICER_ROLE_LABEL, type OfficerRole, type HubSlot } from "@/lib/hub-types";
import { GOOGLE_FORM_LINKS, BRAND_ASSET_LINKS, HUB_SUPPORT_EMAIL, CHARTER_DOCUMENT_URL } from "@/lib/hub-data";
import styles from "@/app/(hub)/hub/hub.module.css";

interface Props {
  session: HubSession;
  chapter: Chapter;
  ambassadors: UdaraAmbassador[];
  requests: ClearanceRequest[];
  slots: Record<OfficerRole, HubSlot>;
  executives: ChapterExecutive[];
  /** Set when an admin is viewing this chapter's hub as its lead. */
  adminPreview?: boolean;
  /** The registered Country Director for this chapter's country, if any. */
  countryDirectorName?: string;
}

export default function OfficerDashboardClient({
  session,
  chapter,
  ambassadors,
  requests,
  slots,
  executives,
  adminPreview = false,
  countryDirectorName,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "executives" | "requests" | "guides" | "brand">("overview");
  const [showCertificate, setShowCertificate] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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

  const isChartered = chapter.status === "chartered";
  const canEditExecs = adminPreview || session.officerRole === "lead";
  const execsMissing = executives.filter((e) => e.seat !== "other").length < 2;

  return (
    <div className={styles.page}>
      {adminPreview && (
        <div className={styles.previewBanner}>
          <span>
            Admin preview: you are seeing exactly what this chapter&apos;s lead sees. Changes you save
            here are real.
          </span>
          <a href="/hub/admin">← Back to admin</a>
        </div>
      )}
      {/* Top Bar with Chapter Identity */}
      <div className={styles.topBar}>
        <div>
          <div className={styles.schoolEyebrow}>NSK AI Campus Node // {chapter.country}</div>
          <h1 className={styles.institutionTitle}>{chapter.institution}</h1>
          <div className={styles.officerMeta}>
            Signed in as <strong>{session.name}</strong> •{" "}
            {session.officerRole ? OFFICER_ROLE_LABEL[session.officerRole] : "Chapter Officer"}
          </div>
        </div>

        <div className={styles.topBarActions}>
          <div className={styles.statusBadgeRow}>
            {isChartered ? (
              <span className={styles.statusBadgeChartered}>
                ● Chartered Chapter • {chapter.charterNumber || "Verified"}
              </span>
            ) : (
              <span className={styles.statusBadgeInterim}>
                ● Interim Chapter (Awaiting Charter Requirements)
              </span>
            )}
          </div>
          {!adminPreview && (
            <button
              onClick={handleLogout}
              className={styles.logoutBtn}
              disabled={loggingOut}
            >
              {loggingOut ? "Signing out..." : "Sign Out"}
            </button>
          )}
        </div>
      </div>

      {/* Country Director Direct Contact Card */}
      <div className={styles.cdCard}>
        <div className={styles.cdInfo}>
          <span className={styles.cdLabel}>Assigned Country Director</span>
          <span className={styles.cdName}>{countryDirectorName ?? chapter.countryDirectorName}</span>
          <span style={{ fontSize: "13px", color: "var(--ink-muted)", fontFamily: "var(--mono)" }}>
            {HUB_SUPPORT_EMAIL}
          </span>
        </div>
        <a
          href={`mailto:${HUB_SUPPORT_EMAIL}?subject=${encodeURIComponent(`[NSK AI Chapter] ${chapter.institution}`)}`}
          className={styles.cdLink}
        >
          ✉ Email a Question or Complaint
        </a>
        {CHARTER_DOCUMENT_URL && (
          <a href={CHARTER_DOCUMENT_URL} target="_blank" rel="noopener noreferrer" className={styles.cdLink}>
            Campus Charter Document ↗
          </a>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "overview" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview &amp; Campus Charter
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "executives" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("executives")}
        >
          Executive Team
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "requests" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Request a Session
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "guides" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("guides")}
        >
          Session Guides (Paper Talks &amp; Labs)
        </button>
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW & CAMPUS CHARTER
         ========================================================================= */}
      {activeTab === "executives" && (
        <div className={styles.section}>
          <ExecutivesForm
            chapterId={chapter.id}
            initial={executives}
            slots={{ deputy: slots.deputy, treasurer: slots.treasurer }}
            canEdit={canEditExecs}
          />
        </div>
      )}

      {activeTab === "overview" && (
        <div className={styles.section}>
          {canEditExecs && execsMissing && (
            <div className={styles.reportBanner}>
              <div>
                <div className={styles.bannerTitle}>Add your executive team</div>
                <div className={styles.bannerDesc}>
                  Enter your Deputy Lead and Programs Coordinator so they can get their own sign-in.
                </div>
              </div>
              <button type="button" className={styles.bannerAction} onClick={() => setActiveTab("executives")}>
                Add executives →
              </button>
            </div>
          )}
          {/* Monthly Report Banner */}
          <div className={styles.reportBanner}>
            <div>
              <div className={styles.bannerTitle}>📅 Monthly Reporting Cadence (Guidelines §7)</div>
              <div className={styles.bannerDesc}>
                Monthly reports are strictly due by the <strong>5th of every month</strong>.
                {chapter.lastReportSubmittedMonth
                  ? ` Last recorded submission: ${chapter.lastReportSubmittedMonth}.`
                  : " Please ensure your report is submitted promptly."}
              </div>
            </div>
            <a
              href={GOOGLE_FORM_LINKS.monthlyReport}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bannerAction}
            >
              Submit Monthly Report (English) ↗
            </a>
            <a
              href={GOOGLE_FORM_LINKS.monthlyReportFr}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bannerAction}
            >
              Rapport mensuel (Français) ↗
            </a>
          </div>

          {/* Book a workshop */}
          <div className={styles.cardBox}>
            <h2 className={styles.boxTitle}>Book a Workshop</h2>
            <div className={styles.actionBtnsRow}>
              <a
                href={GOOGLE_FORM_LINKS.bookWorkshop}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtnPrimary}
              >
                + Book a Workshop (English) ↗
              </a>
              <a
                href={GOOGLE_FORM_LINKS.workshopRequestFr}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtnSecondary}
              >
                + Réserver un atelier (Français) ↗
              </a>
            </div>
          </div>

          {/* The three people with access to this chapter's hub */}
          <div className={styles.cardBox}>
            <h2 className={styles.boxTitle}>People in Your Chapter</h2>
            {(["lead", "deputy", "treasurer"] as const).map((role) => {
              const slot = slots[role];
              return (
                <p key={role} style={{ margin: "12px 0", lineHeight: 1.5 }}>
                  <strong>{OFFICER_ROLE_LABEL[role]}:</strong>{" "}
                  {slot.status === "active" ? (
                    <>
                      {slot.name} · <a href={`mailto:${slot.email}`}>{slot.email}</a>
                    </>
                  ) : (
                    <span style={{ color: "var(--ink-muted)" }}>not yet registered</span>
                  )}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "requests" && (
        <div className={styles.section}>
          {/* Action CTAs */}
          <div className={styles.actionBtnsRow}>
            <a
              href={GOOGLE_FORM_LINKS.workshopRequest}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtnPrimary}
            >
              + Request to Host a Workshop (English) ↗
            </a>
            <a
              href={GOOGLE_FORM_LINKS.workshopRequestFr}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtnSecondary}
            >
              + Demande d&apos;atelier (Français) ↗
            </a>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SESSION GUIDES
         ========================================================================= */}
      {activeTab === "guides" && (
        <div className={styles.section}>
          <div className={styles.guideGrid}>
            {/* Paper Talks Guide */}
            <div className={styles.guideCard}>
              <h2 className={styles.guideTitle}>Paper Talk Guide</h2>
              <p className={styles.guideDesc}>
                &ldquo;One paper, forty minutes, and an argument. Members pick what gets read, and anyone can take a turn presenting.&rdquo;
                These are recommendations to guide you; your chapter leadership and members decide what to explore.
              </p>

              <div style={{ marginBottom: "20px", padding: "14px", background: "#FAF8F7", border: "1px solid var(--hairline)" }}>
                <strong style={{ display: "block", marginBottom: "6px", fontSize: "13px" }}>
                  Recommended 40-Minute Structure:
                </strong>
                <ol style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", lineHeight: "1.5", color: "var(--ink-muted)" }}>
                  <li><strong>00–10 min:</strong> The core problem and why previous methods failed.</li>
                  <li><strong>10–25 min:</strong> The architectural innovation (walk through Figure 1 &amp; equations).</li>
                  <li><strong>25–35 min:</strong> Empirical results, benchmarks, and caveats.</li>
                  <li><strong>35–40 min:</strong> Open floor debate &amp; questions.</li>
                </ol>
              </div>

              <h3 style={{ fontFamily: "var(--serif)", fontSize: "18px", margin: "0 0 12px" }}>
                This Month&apos;s Topics ({MONTH_LABEL})
              </h3>
              {PAPER_TOPICS.map((t) => (
                <div key={t.topic} style={{ marginBottom: "24px" }}>
                  <div style={{ fontFamily: "var(--sans)", fontWeight: 600, fontSize: "15px", margin: "0 0 4px" }}>
                    {t.topic}
                  </div>
                  <p className={styles.guideDesc} style={{ margin: "0 0 10px" }}>{t.why}</p>
                  <div className={styles.topicList}>
                    {t.papers.map((p) => (
                      <div key={p.url} className={styles.topicItem}>
                        <div className={styles.topicName}>
                          <a href={p.url} target="_blank" rel="noopener noreferrer">
                            {p.title} ↗
                          </a>
                        </div>
                        <div className={styles.topicDetails}>
                          {p.authors}, {p.year}. {p.discuss}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Sessions & Labs Guide */}
            <div className={styles.guideCard}>
              <h2 className={styles.guideTitle}>Technical Sessions &amp; Labs</h2>
              <p className={styles.guideDesc}>
                Practical, hands-on sessions help members move from theory to shipping real AI projects.
              </p>

              <h3 style={{ fontFamily: "var(--serif)", fontSize: "18px", margin: "0 0 12px" }}>
                Project Demos for {MONTH_LABEL}
              </h3>
              <div className={styles.topicList} style={{ marginBottom: "24px" }}>
                {PROJECT_DEMOS.map((d) => (
                  <div key={d.title} className={styles.topicItem}>
                    <div className={styles.topicName}>{d.title}</div>
                    <div className={styles.topicDetails}>
                      {d.summary}
                      <ol style={{ margin: "8px 0 0", paddingLeft: "18px", lineHeight: 1.5 }}>
                        {d.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: "var(--serif)", fontSize: "18px", margin: "0 0 12px" }}>
                Labs You Can Run Any Month
              </h3>

              <div className={styles.topicList}>
                <div className={styles.topicItem}>
                  <div className={styles.topicName}>Local LLM Lab with Ollama &amp; Python</div>
                  <div className={styles.topicDetails}>
                    Have students run open-weights models (e.g. Llama 3, Mistral, Qwen) on their own laptops. Walk through prompt engineering and streaming responses.
                  </div>
                </div>
                <div className={styles.topicItem}>
                  <div className={styles.topicName}>Building an In-Memory RAG Pipeline</div>
                  <div className={styles.topicDetails}>
                    Write a 50-line Python RAG pipeline using sentence-transformers, simple cosine similarity, and an LLM API.
                  </div>
                </div>
                <div className={styles.topicItem}>
                  <div className={styles.topicName}>African Language Speech &amp; Translation</div>
                  <div className={styles.topicDetails}>
                    Explore speech datasets, audio transcription, and low-resource language modeling aligned with the Udara Project goals.
                  </div>
                </div>
                <div className={styles.topicItem}>
                  <div className={styles.topicName}>AI Games Night &amp; Social Hack</div>
                  <div className={styles.topicDetails}>
                    Informal session with no slides: prompt battles, speed-coding small AI agents, and casual discussion on campus tech initiatives.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: BRAND ASSETS & DOCS
         ========================================================================= */}
      {activeTab === "brand" && (
        <div className={styles.section}>
          <div className={styles.cardBox}>
            <h2 className={styles.boxTitle}>Official Brand Assets &amp; Media Kit</h2>
            <div className={styles.boxSubtitle} style={{ marginBottom: "24px" }}>
              Uniform brand resources to keep your chapter presentations and event announcements professional.
            </div>

            <div className={styles.assetsGrid}>
              <div className={styles.assetCard}>
                <div className={styles.assetHeader}>
                  <span className={styles.assetBadge}>Vector &amp; High-Res</span>
                  <span className={styles.assetName}>NSK AI Logo Pack</span>
                  <p className={styles.assetDesc}>
                    Complete set of official vector SVGs and transparent PNGs in dark mode, light mode, and monochrome.
                  </p>
                </div>
                <a href={BRAND_ASSET_LINKS.logoPackZip} className={styles.downloadLink}>
                  ⬇ Download Logo Pack (.zip)
                </a>
              </div>

              <div className={styles.assetCard}>
                <div className={styles.assetHeader}>
                  <span className={styles.assetBadge}>Community Identity</span>
                  <span className={styles.assetName}>WhatsApp Profile Graphic</span>
                  <p className={styles.assetDesc}>
                    Pre-sized 1:1 square profile template matching the required &ldquo;NSK AI | School | Country&rdquo; naming standard.
                  </p>
                </div>
                <a href={BRAND_ASSET_LINKS.whatsappIconPng} className={styles.downloadLink}>
                  ⬇ Download WhatsApp Graphic (.png)
                </a>
              </div>

              <div className={styles.assetCard}>
                <div className={styles.assetHeader}>
                  <span className={styles.assetBadge}>Editable Flyers</span>
                  <span className={styles.assetName}>Social &amp; Event Flyers (Canva)</span>
                  <p className={styles.assetDesc}>
                    Official Canva &amp; Figma templates: 1:1 Square (Instagram/Post), 9:16 Vertical (Stories), and 16:9 Banner.
                  </p>
                </div>
                <a
                  href={BRAND_ASSET_LINKS.canvaSquareFlyer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadLink}
                >
                  Open Canva Template Pack ↗
                </a>
              </div>

              <div className={styles.assetCard}>
                <div className={styles.assetHeader}>
                  <span className={styles.assetBadge}>Keynote &amp; Slides</span>
                  <span className={styles.assetName}>Presentation Slide Template</span>
                  <p className={styles.assetDesc}>
                    Google Slides and PowerPoint deck pre-styled with NSK AI typography (Author, Gambetta, Spline Sans Mono).
                  </p>
                </div>
                <a
                  href={BRAND_ASSET_LINKS.presentationDeckGoogleSlides}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadLink}
                >
                  Open Google Slides Deck ↗
                </a>
              </div>
            </div>
          </div>

          {/* Institutional Documents */}
          <div className={styles.cardBox}>
            <h2 className={styles.boxTitle}>Institutional Documents &amp; Legal Templates</h2>
            <div className={styles.boxSubtitle} style={{ marginBottom: "24px" }}>
              Official administrative templates for university liaisons, faculty onboarding, and tenure handover.
            </div>

            <div className={styles.assetsGrid}>
              <div className={styles.assetCard}>
                <div className={styles.assetHeader}>
                  <span className={styles.assetBadge}>University Relations</span>
                  <span className={styles.assetName}>Udara 2027 Campus MOU</span>
                  <p className={styles.assetDesc}>
                    Official Memorandum of Understanding template for university legal affairs regarding Udara participation.
                  </p>
                </div>
                <a href={BRAND_ASSET_LINKS.udaraMouTemplateDocx} className={styles.downloadLink}>
                  ⬇ Download MOU Template (.docx)
                </a>
              </div>

              <div className={styles.assetCard}>
                <div className={styles.assetHeader}>
                  <span className={styles.assetBadge}>Faculty Onboarding</span>
                  <span className={styles.assetName}>Faculty Invitation Letter</span>
                  <p className={styles.assetDesc}>
                    Formal letter of appointment to invite a department head or professor to serve as the Faculty Representative.
                  </p>
                </div>
                <a href={BRAND_ASSET_LINKS.facultyInvitationLetterDocx} className={styles.downloadLink}>
                  ⬇ Download Faculty Letter (.docx)
                </a>
              </div>

              <div className={styles.assetCard}>
                <div className={styles.assetHeader}>
                  <span className={styles.assetBadge}>Governance</span>
                  <span className={styles.assetName}>Chapter Lead Guidelines</span>
                  <p className={styles.assetDesc}>
                    The complete official November 2026 guidelines defining community standards, events, and reporting.
                  </p>
                </div>
                <a href={BRAND_ASSET_LINKS.leadGuidelinesDocx} className={styles.downloadLink}>
                  ⬇ Download Guidelines (.docx)
                </a>
              </div>

              <div className={styles.assetCard}>
                <div className={styles.assetHeader}>
                  <span className={styles.assetBadge}>Tenure Transition</span>
                  <span className={styles.assetName}>Succession Handover Checklist</span>
                  <p className={styles.assetDesc}>
                    3-month handover protocol for transferring group ownership, member records, and supervisor sign-off.
                  </p>
                </div>
                <a
                  href={GOOGLE_FORM_LINKS.handoverChecklist}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadLink}
                >
                  Open Handover Form ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
