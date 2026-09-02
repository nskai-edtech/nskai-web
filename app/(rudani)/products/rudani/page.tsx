import type { Metadata } from "next";
import Link from "next/link";
import AnswerStage from "@/components/products/rudani/AnswerStage";
import FocusRack from "@/components/products/rudani/FocusRack";
import styles from "./rudani.module.css";

export const metadata: Metadata = {
  title: "Rudani",
  description:
    "Rudani searches your own documents and writes the answer. Every sentence carries the passage it came from, and anything the documents cannot support, it declines to say.",
};

const deployment = [
  {
    title: "In your cloud or ours",
    body: "Self-hosted, in your VPC, or operated by us. Your keys, your logs, your retention policy.",
  },
  {
    title: "Indexes what you already have",
    body: "SharePoint, S3, Drive, Confluence, Postgres, and flat scans out of the archive.",
  },
  {
    title: "Answers in the language asked",
    body: "The languages your archive is written in, with the passage quoted in its original.",
  },
];

const production = [
  ["Median answer", "1.9s"],
  ["Largest index in production", "41.6M documents"],
  ["Citations checked against source text", "before display"],
  ["Answers refused for want of evidence", "logged, not hidden"],
];

const rest = [
  { status: "Live", name: "Zerra", href: "/products/zerra" },
  { status: "Private demo", name: "Leri", href: "/products/leri" },
  { status: "Engagements open", name: "Enterprise AI", href: "/products/enterprise-ai" },
  { status: "Live", name: "Data Annotation", href: "/products/data-annotation" },
  { status: "By engagement", name: "Advanced R&D", href: "/products/advanced-rd" },
];

export default function RudaniPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.breadcrumb}>Products &middot; Rudani</div>
        <h1 className={styles.heroTitle}>
          Ask once. Read the answer, with its sources attached.
        </h1>
        <p className={styles.heroLead}>
          Rudani searches your own documents and writes the answer. Every sentence
          carries the passage it came from, and anything the documents cannot
          support, it declines to say.
        </p>
        <div className={styles.heroActions}>
          <a href="#stage" className={styles.buttonSolid}>
            See it answer
          </a>
          <Link href="/contact" className={styles.buttonOutline}>
            Talk to us
          </Link>
        </div>
      </section>

      <section id="stage" className={styles.stage}>
        <div className={styles.stageHead}>
          <div>
            <div className={styles.stageEyebrow}>One question at a time</div>
            <h2 className={styles.stageTitle}>Watch an answer being assembled.</h2>
          </div>
          <p className={styles.stageNote}>
            Pick a question. Rudani retrieves, re-reads, then writes, threading
            each claim back to the document underneath it.
          </p>
        </div>
        <AnswerStage />
      </section>

      <section className={styles.rules}>
        <div className={styles.rulesHead}>
          <div className={styles.rulesLabel}>How the answer is made</div>
          <div className={styles.rulesCount}>Four rules</div>
        </div>
        <FocusRack />
      </section>

      <section className={styles.deployment}>
        <h2 className={styles.h2}>It runs where your documents already are.</h2>
        <div className={styles.deployGrid}>
          {deployment.map((item) => (
            <div key={item.title}>
              <h3 className={styles.deployTitle}>{item.title}</h3>
              <p className={styles.deployBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <div className={styles.productionGrid}>
          <div className={styles.productionLabel}>In production</div>
          <div className={styles.productionList}>
            {production.map(([label, value]) => (
              <div key={label} className={styles.productionRow}>
                <div className={styles.productionName}>{label}</div>
                <div className={styles.productionValue}>{value}</div>
              </div>
            ))}
          </div>
        </div>
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
        <h2 className={styles.closingTitle}>Point it at your own archive.</h2>
        <p className={styles.closingLead}>
          We index a sample of your documents and hand you the questions it can
          already answer.
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
