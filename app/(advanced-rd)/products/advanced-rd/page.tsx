import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import CounterRow from "@/components/products/advanced-rd/CounterRow";
import ProximityField from "@/components/products/advanced-rd/ProximityField";
import TrialTree from "@/components/products/advanced-rd/TrialTree";
import styles from "./advanced-rd.module.css";

export const metadata: Metadata = {
  title: "Advanced R&D",
  description:
    "Joint programmes on problems your industry has not solved yet: run as real research against your data, reported either way, and published where it can be.",
};

const Line = ({ children }: { children: ReactNode }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="square"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Small = ({ children }: { children: ReactNode }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="square"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const commitments = [
  {
    n: "01",
    accent: "#E01A0D",
    title: "Start from the unknown",
    body: "Engagements open on something unproven. If the answer could be bought, you would not need a programme.",
    icon: (
      <Line>
        <path d="M6 6h18" />
        <path d="M6 6v28" />
        <path d="M6 34h28" />
        <path d="M34 34V16" />
      </Line>
    ),
  },
  {
    n: "02",
    accent: "#F26B5E",
    title: "Measure on your corpus",
    body: "Evaluation is built on your data, so the finding transfers to your production system and not to a benchmark.",
    icon: (
      <Line>
        <path d="M8 7v26" />
        <path d="M8 13h9" />
        <path d="M8 20h19" />
        <path d="M8 27h13" />
      </Line>
    ),
  },
  {
    n: "03",
    accent: "#8E1108",
    title: "Publish either result",
    body: "Negative results are written up as carefully as positive ones. Whatever is not commercially sensitive goes out.",
    icon: (
      <Line>
        <path d="M8 8h14v24H8z" />
        <path d="M20 20h12" />
        <path d="M28 16l4 4-4 4" />
      </Line>
    ),
  },
];

const lines = [
  {
    n: "01",
    title: "Precision budgets",
    body: "How far quantization goes before the errors move.",
    value: 4.2,
    dp: 1,
    live: true,
    unit: " bits",
    icon: (
      <Small>
        <path d="M5 10h9v24" />
        <path d="M14 18h9v16" />
        <path d="M23 26h9v8" />
        <path d="M5 34h30" />
      </Small>
    ),
  },
  {
    n: "02",
    title: "Unindexed corpora",
    body: "Retrieval and evaluation over records that were never searchable.",
    value: 41.6,
    dp: 1,
    live: false,
    unit: "M docs",
    icon: (
      <Small>
        <path d="M6 9h16" />
        <path d="M6 16h22" />
        <path d="M6 23h11" />
        <circle cx="26" cy="26" r="7" />
        <path d="M31 31l5 5" />
      </Small>
    ),
  },
  {
    n: "03",
    title: "Agentic failure modes",
    body: "What holds, and what does not, when a system is allowed to write.",
    value: 7,
    dp: 0,
    live: false,
    unit: " classes",
    icon: (
      <Small>
        <path d="M4 20h24" />
        <path d="M21 13l7 7-7 7" />
        <path d="M32 6v28" />
      </Small>
    ),
  },
  {
    n: "04",
    title: "Low-bandwidth inference",
    body: "Serving useful models where connectivity, not compute, is the constraint.",
    value: 3.2,
    dp: 1,
    live: true,
    unit: "× faster",
    icon: (
      <Small>
        <path d="M8 30a12 12 0 0 1 24 0" />
        <path d="M13 30a7 7 0 0 1 14 0" />
        <circle cx="20" cy="30" r="1.6" fill="currentColor" stroke="none" />
        <path d="M4 30a16 16 0 0 1 32 0" opacity="0.35" />
      </Small>
    ),
  },
];

const field = [
  {
    accent: "#E01A0D",
    title: "Use case acceleration",
    body: "Prioritise high-value use cases and take them to production fast.",
    note: "Week 1 scoping workshop",
    index: "01",
    icon: (
      <Small>
        <path d="M6 6h12v12H6z" />
        <path d="M22 6h12v12H22z" />
        <path d="M6 22h12v12H6z" />
        <circle cx="28" cy="28" r="6" />
      </Small>
    ),
  },
  {
    accent: "#F26B5E",
    title: "Elite AI expertise",
    body: "A cross-functional team that carries an initiative from kickoff to scale.",
    note: "Named team, not a queue",
    index: "02",
    icon: (
      <Small>
        <circle cx="20" cy="9" r="5" />
        <circle cx="9" cy="29" r="5" />
        <circle cx="31" cy="29" r="5" />
        <path d="M17 13L12 24" />
        <path d="M23 13l5 11" />
        <path d="M14 29h12" />
      </Small>
    ),
  },
  {
    accent: "#8E1108",
    title: "Deep customisation",
    body: "Models tuned for your domain, down to the precision budget.",
    note: "Evaluated on your own tasks",
    index: "03",
    icon: (
      <Small>
        <path d="M6 12h28" />
        <path d="M6 20h28" />
        <path d="M6 28h28" />
        <circle cx="14" cy="12" r="3.2" />
        <circle cx="26" cy="20" r="3.2" />
        <circle cx="18" cy="28" r="3.2" />
      </Small>
    ),
  },
  {
    accent: "#240605",
    title: "Enterprise activation",
    body: "Deployed in your environment, with your keys and your policy.",
    note: "Runbooks handed over",
    index: "04",
    icon: (
      <Small>
        <path d="M10 6H6v28h4" />
        <path d="M30 6h4v28h-4" />
        <path d="M14 14h12v12H14z" />
        <path d="M20 10v4" />
      </Small>
    ),
  },
];

const rest = [
  { status: "Live", name: "Zerra", href: "/products/zerra" },
  { status: "Private demo", name: "Leri", href: "/products/leri" },
  { status: "Engagements open", name: "Enterprise AI", href: "/products/enterprise-ai" },
  { status: "Live", name: "Data Annotation", href: "/products/data-annotation" },
];

export default function AdvancedRdPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.breadcrumb}>
          <div className={styles.crumbAccent}>Products &middot; Advanced R&amp;D</div>
          <div className={styles.crumbMuted}>By engagement</div>
        </div>
        <h1 className={styles.heroTitle}>
          Research on the questions you cannot buy an answer to.
        </h1>
        <p className={styles.heroLead}>
          Joint programmes on problems your industry has not solved yet. We take
          the question, run it as real research against your data, report what we
          find either way, and publish what can be published.
        </p>
        <div className={styles.heroActions}>
          <Link href="/contact" className={styles.buttonSolid}>
            Talk to us about Advanced R&amp;D
          </Link>
          <Link href="/#products" className={styles.buttonOutline}>
            All products
          </Link>
        </div>
      </section>

      <TrialTree />

      <section className={styles.method}>
        <div className={styles.sectionLabels}>
          <div className={styles.labelAccent}>Method</div>
          <div className={styles.labelMuted}>Three commitments</div>
        </div>
        <div className={styles.commitments}>
          {commitments.map((c) => (
            <div
              key={c.n}
              className={styles.commitment}
              style={{ "--panel-accent": c.accent } as CSSProperties}
            >
              <div className={styles.sweep} />
              <div style={{ color: c.accent }}>{c.icon}</div>
              <h3 className={styles.commitmentTitle}>{c.title}</h3>
              <p className={styles.commitmentBody}>{c.body}</p>
              <div className={styles.commitmentIndex}>{c.n}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.lines}>
        <div className={styles.linesHead}>
          <div>
            <div className={styles.labelAccent}>Open lines of work</div>
            <h2 className={styles.h2}>Four questions currently under measurement.</h2>
          </div>
          <p className={styles.linesNote}>
            A programme usually starts inside one of these, then leaves it once
            the answer is written down. The figures on the right are where each
            one stands today.
          </p>
        </div>

        <div className={styles.lineRows}>
          {lines.map((line, i) => (
            <div key={line.n} className={styles.lineRow}>
              <div className={styles.lineIndex}>{line.n}</div>
              <div className={styles.lineIcon}>{line.icon}</div>
              <div className={styles.lineTitle}>{line.title}</div>
              <p className={styles.lineBody}>{line.body}</p>
              <div className={styles.lineFigure}>
                <span className={styles.lineValue}>
                  <CounterRow
                    target={line.value}
                    dp={line.dp}
                    live={line.live}
                    index={i}
                  />
                </span>
                <span className={styles.lineUnit}>{line.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.people}>
        <div className={styles.peopleHead}>
          <div>
            <div className={styles.labelDark}>Who you work with</div>
            <h2 className={styles.h2}>Scientists and engineers, on your problem.</h2>
          </div>
          <p className={styles.peopleNote}>
            Move the cursor across the four. The nearest one leans toward you.
          </p>
        </div>
        <ProximityField cards={field} />
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
          Build, customize, and deploy tailored AI solutions with complete control.
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
