import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import RiseIn from "@/components/RiseIn";
import ItemBankBars from "@/components/products/zerra/ItemBankBars";
import ZerraStage from "@/components/products/zerra/ZerraStage";
import styles from "./zerra.module.css";

export const metadata: Metadata = {
  title: "Zerra",
  description:
    "Zerra is an adaptive learning platform for upskilling: it estimates what each person can already do, routes them to the next thing worth learning, and proves the gain.",
};

/** "Five steps, and none of them are a course catalogue." */
const mechanism = [
  {
    step: "01",
    title: "Baseline",
    lead: "A short adaptive sitting, on tasks drawn from your own work.",
    detail:
      "18–24 items. No fixed pass mark; the estimate is a range with a confidence band.",
    tile: "#C9D6F2",
    tileInk: "#0B2A6B",
  },
  {
    step: "02",
    title: "Diagnose",
    lead: "Wrong answers are read for cause, not counted.",
    detail:
      "Misconceptions are tagged against the skill graph, so the same gap is not taught twice.",
    tile: "#A9BDEA",
    tileInk: "#0B2A6B",
  },
  {
    step: "03",
    title: "Route",
    lead: "The next step is chosen after every answer, not at enrolment.",
    detail:
      "Prerequisites are hard edges. Everything else is negotiable and gets skipped when already held.",
    tile: "#6E8FD8",
    tileInk: "#F6F1EF",
  },
  {
    step: "04",
    title: "Practise",
    lead: "Work in the tools they use on Monday, not a simulator.",
    detail:
      "Exercises run against your stack and your data policy, with an engineer reachable in the loop.",
    tile: "#2F52A8",
    tileInk: "#F6F1EF",
  },
  {
    step: "05",
    title: "Verify",
    lead: "Competence is signed off on evidence, not attendance.",
    detail: "Every claim links to the items that support it, exportable for audit.",
    tile: "#0B2A6B",
    tileInk: "#F6F1EF",
  },
];

const assurances = [
  "Unlimited item banks, one per function or role",
  "Calibrated difficulty, published with each item",
  "Reviewer agreement reported for every bank",
  "Results exportable, per person, team and skill",
];

const claims = [
  {
    title: "Adapts per person",
    body: "Two people in the same team can be on completely different paths by the second week, and both finish on your standard.",
    caption: "Adaptive engine",
    bg: "#1E3A8A",
    ink: "#F6F1EF",
  },
  {
    title: "Built on your material",
    body: "Your runbooks, tickets and code become the content. Nothing generic is taught where something specific exists.",
    caption: "Content pipeline",
    bg: "#2F52A8",
    ink: "#F6F1EF",
  },
  {
    title: "Assessment you can defend",
    body: "Calibration, agreement and item history are all visible. A result survives a conversation with legal.",
    caption: "Evidence layer",
    bg: "#6E8FD8",
    ink: "#16100F",
  },
];

const rest = [
  { status: "Private demo", name: "Leri", href: "/products/leri" },
  { status: "Engagements open", name: "Enterprise AI", href: "/products/enterprise-ai" },
  { status: "Live", name: "Data Annotation", href: "/products/data-annotation" },
  { status: "By engagement", name: "Advanced R&D", href: "/products/advanced-rd" },
];

export default function ZerraPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.breadcrumb}>
          <div className={styles.crumbAccent}>Products</div>
          <div className={styles.crumbDot}>&middot;</div>
          <div className={styles.crumbMuted}>Zerra</div>
        </div>

        <h1 className={styles.heroTitle}>
          An AI that learns your people, then teaches them.
        </h1>
        <p className={styles.heroLead}>
          Zerra is an adaptive learning platform for upskilling. It estimates what
          each person can already do, routes them to the next thing worth
          learning, and proves the gain. The same engine runs your in-house
          assessments, curated with our own tools.
        </p>

        {/* The journey, drawn once: ability estimated, held, re-planned, signed off. */}
        <div className={styles.curve}>
          <svg width="1240" height="230" viewBox="0 0 1240 230" fill="none" aria-hidden="true">
            <path
              d="M40 150 C 150 150 150 74 260 74 C 370 74 370 168 480 168 C 590 168 590 62 700 62 C 810 62 810 158 920 158 C 1010 158 1020 104 1100 104 C 1160 104 1180 104 1200 104"
              stroke="#C9D6F2"
              strokeWidth="1.5"
            />
            <path
              d="M40 150 C 150 150 150 74 260 74 C 370 74 370 168 480 168 C 590 168 590 62 700 62"
              stroke="#1E3A8A"
              strokeWidth="1.5"
            />
            <path
              d="M700 62 C 810 62 810 158 920 158"
              stroke="#1E3A8A"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            <g stroke="#8FA8E2" strokeWidth="1" strokeDasharray="2 5">
              <line x1="260" y1="74" x2="260" y2="196" />
              <line x1="480" y1="168" x2="480" y2="196" />
              <line x1="700" y1="62" x2="700" y2="196" />
              <line x1="920" y1="158" x2="920" y2="196" />
            </g>
            <g fill="#1E3A8A">
              <rect x="253" y="67" width="14" height="14" />
              <rect x="473" y="161" width="14" height="14" />
              <rect x="693" y="55" width="14" height="14" />
            </g>
            <rect x="913" y="151" width="14" height="14" fill="#F6F1EF" stroke="#1E3A8A" strokeWidth="1.5" />
            <circle cx="40" cy="150" r="4" fill="#0B2A6B" />
            <g fill="#5C4F4C" fontFamily="Author, Helvetica, sans-serif" fontSize="13">
              <text x="253" y="215">arrives</text>
              <text x="473" y="215">estimate holds</text>
              <text x="693" y="215">route re-planned</text>
              <text x="913" y="215">signed off</text>
            </g>
            <g fill="#8E827E" fontFamily="Author, Helvetica, sans-serif" fontSize="12">
              <text x="1120" y="108">&theta; &rarr; &theta;&#770;</text>
            </g>
          </svg>
        </div>

        <div className={styles.stageIntro}>
          <p className={styles.stageIntroText}>
            Four things happen between a person arriving and a skill being signed
            off.
          </p>
          <div className={styles.stageIntroCue}>
            <div>Scroll to follow them</div>
            <div className={styles.cueRule} />
          </div>
        </div>
      </section>

      <ZerraStage />

      <section id="mechanism" className={styles.mechanism}>
        <div className={styles.eyebrowAccent}>The mechanism</div>
        <h2 className={styles.h2Narrow}>
          Five steps, and none of them are a course catalogue.
        </h2>
        <div className={styles.stepGrid}>
          {mechanism.map((step) => (
            <div
              key={step.step}
              className={styles.stepCard}
              style={{ "--step-accent": step.tile } as CSSProperties}
            >
              <div
                className={styles.stepBadge}
                style={{ background: step.tile, color: step.tileInk }}
              >
                {step.step}
              </div>
              <div className={styles.stepTitle}>{step.title}</div>
              <p className={styles.stepLead}>{step.lead}</p>
              <div className={styles.stepBody}>
                <div className={styles.stepDetail}>{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.assessment}>
        <div>
          <div className={styles.eyebrowAccent}>In-house assessment</div>
          <h2 className={styles.h2}>
            Assess your own workforce, on your own standard.
          </h2>
          <p className={styles.assessmentLead}>
            Build as many item banks as you have functions. Each one is curated
            against your competency framework, calibrated on your cohorts, and
            reported with the agreement rate behind it. Use them for hiring
            screens, internal certification, promotion evidence and regulatory
            sign-off.
          </p>
          <div className={styles.assurances}>
            {assurances.map((line, i) => (
              <RiseIn
                key={line}
                className={
                  i === 0
                    ? styles.assuranceFirst
                    : i === assurances.length - 1
                      ? styles.assuranceLast
                      : styles.assurance
                }
              >
                {line}
              </RiseIn>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.barsHead}>
            <div className={styles.barsLabel}>
              Your item banks &middot; calibrated difficulty
            </div>
            <div className={styles.barsHint}>hover a column</div>
          </div>
          <ItemBankBars />
        </div>
      </section>

      <section className={styles.claims}>
        {claims.map((claim) => (
          <div
            key={claim.title}
            className={styles.claimCard}
            style={
              { "--flood-bg": claim.bg, "--flood-ink": claim.ink } as CSSProperties
            }
          >
            <div className={styles.claimTitle}>{claim.title}</div>
            <p className={styles.claimBody}>{claim.body}</p>
            <div className={styles.claimCaption}>{claim.caption}</div>
          </div>
        ))}
      </section>

      <section className={styles.rest}>
        <h2 className={styles.restTitle}>The rest of the system</h2>
        <div className={styles.restGrid}>
          {rest.map((item) => (
            <Link key={item.name} href={item.href} className={styles.restTile}>
              <div className={styles.restStatus}>{item.status}</div>
              <div className={styles.restName}>{item.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className={styles.closing}>
        <h2 className={styles.closingTitle}>Own your own AI future.</h2>
        <p className={styles.closingLead}>
          Train your people on the system you actually run, and test them on it.
        </p>
        <div className={styles.closingActions}>
          <Link href="/contact" className={styles.closingSolid}>
            Contact
          </Link>
          <Link href="/" className={styles.closingOutline}>
            Back to NSK AI
          </Link>
        </div>
      </section>
    </>
  );
}
