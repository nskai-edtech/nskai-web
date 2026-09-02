import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import CaseLedger from "@/components/products/leri/CaseLedger";
import LeriDial from "@/components/products/leri/LeriDial";
import styles from "./leri.module.css";

export const metadata: Metadata = {
  title: "Leri",
  description:
    "Leri takes a request the whole way: reads it, finds the record, decides, writes the change back into your systems, and leaves the receipt.",
};

/** Where Leri sits, left to right. Each panel opens on hover. */
const stack = [
  {
    label: "Channels",
    title: "WhatsApp, voice, email, in-app",
    bg: "#E6D3BC",
    hoverBg: "#7A4A28",
  },
  {
    label: "Systems of record",
    title: "CRM, core banking, ERP, ticketing",
    bg: "#D8C0A2",
    hoverBg: "#6B4423",
  },
  {
    label: "Policy",
    title: "Your rules, versioned and cited",
    bg: "#C9A57E",
    hoverBg: "#4A2E1A",
  },
  {
    label: "Oversight",
    title: "Receipts, replays and limits",
    bg: "#B08355",
    hoverBg: "#221309",
    /** The last panel already sits on a dark enough tint to need paper ink. */
    ink: "#F1E9E2",
  },
];

const claims = [
  {
    title: "Scoped",
    body: "Every action the agent can take is declared in advance, with limits, and nothing else is reachable.",
    caption: "Authority",
    bg: "#7A4A28",
  },
  {
    title: "Reversible",
    body: "Anything written can be replayed and undone from the receipt, without reconstructing what happened.",
    caption: "Recovery",
    bg: "#6B4423",
  },
  {
    title: "Measured",
    body: "Resolution rate, escalation rate and time to close are reported per queue, not as one headline number.",
    caption: "Evidence",
    bg: "#4A2E1A",
  },
];

const rest = [
  { status: "Live", name: "Zerra", href: "/products/zerra" },
  { status: "Engagements open", name: "Enterprise AI", href: "/products/enterprise-ai" },
  { status: "Live", name: "Data Annotation", href: "/products/data-annotation" },
  { status: "By engagement", name: "Advanced R&D", href: "/products/advanced-rd" },
];

export default function LeriPage() {
  return (
    <>
      <section className={styles.hero}>
        {/* Three octagons turning at their own rates, bled off the right edge. */}
        <div className={styles.orbit} aria-hidden="true">
          <div className={styles.ringOuter}>
            <svg viewBox="0 0 720 720" width="720" height="720" fill="none">
              <polygon
                points="360,60 572,148 660,360 572,572 360,660 148,572 60,360 148,148"
                stroke="#D8C7B6"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className={styles.ringMiddle}>
            <svg viewBox="0 0 580 580" width="580" height="580" fill="none">
              <polygon
                points="290,48 461,119 532,290 461,461 290,532 119,461 48,290 119,119"
                stroke="#C9A57E"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className={styles.ringInner}>
            <svg viewBox="0 0 420 420" width="420" height="420" fill="none">
              <polygon
                points="210,34 334,86 386,210 334,334 210,386 86,334 34,210 86,86"
                stroke="#B08355"
                strokeWidth="1"
              />
              <circle cx="210" cy="34" r="5" fill="#7A4A28" />
            </svg>
          </div>
        </div>

        <div className={styles.heroBody}>
          <div className={styles.breadcrumb}>
            <div className={styles.crumbAccent}>Products</div>
            <div className={styles.crumbDot}>&middot;</div>
            <div className={styles.crumbMuted}>Leri</div>
          </div>

          <h1 className={styles.heroTitle}>Agents that close the case.</h1>
          <p className={styles.heroLead}>
            Leri takes a request the whole way: reads it, finds the record,
            decides, writes the change back into your systems, and leaves the
            receipt. Eight faces, one loop, no handover unless it earns one.
          </p>

          <div className={styles.compare}>
            <div className={styles.compareReply}>
              <div className={styles.compareLabelMuted}>Reply</div>
              <div className={styles.compareTextMuted}>
                Answers, then waits for a human.
              </div>
            </div>
            <div className={styles.compareResolve}>
              <div className={styles.compareLabelAccent}>Resolve</div>
              <div className={styles.compareText}>
                Acts inside the system of record, then reports what it did.
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeriDial />

      <section className={styles.ledgerSection}>
        <div className={styles.ledgerHead}>
          <h2 className={styles.h2}>
            One case, end to end, with the receipt attached.
          </h2>
          <div className={styles.hint}>hover a step</div>
        </div>
        <CaseLedger />
      </section>

      <section className={styles.stackSection}>
        <h2 className={styles.h2Small}>Where it sits in your stack</h2>
        <div className={styles.stack}>
          {stack.map((panel) => (
            <div
              key={panel.label}
              className={styles.panel}
              style={
                {
                  "--panel-bg": panel.bg,
                  "--panel-hover-bg": panel.hoverBg,
                  color: panel.ink,
                } as CSSProperties
              }
            >
              <div className={styles.panelLabel}>{panel.label}</div>
              <div className={styles.panelTitle}>{panel.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.claims}>
        {claims.map((claim) => (
          <div
            key={claim.title}
            className={styles.claimCard}
            style={{ "--flood-bg": claim.bg } as CSSProperties}
          >
            <div className={styles.claimTitle}>{claim.title}</div>
            <p className={styles.claimBody}>{claim.body}</p>
            <div className={styles.claimCaption}>{claim.caption}</div>
          </div>
        ))}
      </section>

      <section className={styles.rest}>
        <h2 className={styles.h2Small}>The rest of the system</h2>
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
          Put an agent on one queue, with limits you set, and read the receipts.
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
