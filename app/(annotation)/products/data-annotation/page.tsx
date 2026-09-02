import type { Metadata } from "next";
import Link from "next/link";
import ConfusionMatrix from "@/components/products/annotation/ConfusionMatrix";
import ResolveStage from "@/components/products/annotation/ResolveStage";
import TraceRack from "@/components/products/annotation/TraceRack";
import RiseIn from "@/components/RiseIn";
import styles from "./annotation.module.css";

export const metadata: Metadata = {
  title: "Data Annotation",
  description:
    "Human annotation for systems that have to be right: domain specialists working to a written spec, disputes adjudicated rather than averaged, agreement reported per batch.",
};

const promises = [
  {
    title: "Specialists, screened on your task",
    body: "Annotators qualify on your data with your guidelines, and we publish who labelled what.",
  },
  {
    title: "Adjudicated, not averaged",
    body: "Multi-pass review with a named adjudicator on disagreements, so the label has a reason behind it.",
  },
  {
    title: "Reported, batch by batch",
    body: "Agreement rate, throughput and the edge cases that forced a spec change, in writing.",
  },
];

const included = [
  "Text, speech, documents and images",
  "Guidelines written with your domain experts",
  "Low-resource and West African languages",
  "Labelling inside your environment where required",
];

const batchFacts = [
  ["Batch", "NB-24"],
  ["Items", "12,480"],
  ["Adjudicated", "431"],
  ["Closed", "14 Aug 2026"],
];

const handover = [
  {
    n: "01",
    title: "Agreement report",
    body: "Cohen’s κ per class and per annotator pair, the confusion pairs ranked by volume, and drift against the previous batch. The weakest class is named rather than averaged away.",
    files: ["agreement.csv", "agreement.pdf"],
  },
  {
    n: "02",
    title: "Adjudication log",
    body: "Every overturned label with the original three passes kept intact, the named adjudicator, and the reasoning. Re-labelled items stay flagged in place.",
    files: ["rulings.jsonl"],
  },
  {
    n: "03",
    title: "Edge-case register",
    body: "The items that forced a spec amendment, dated, with worked examples. Held back from training and handed over as an evaluation set.",
    files: ["edge-cases/", "spec-history.md"],
  },
  {
    n: "04",
    title: "Chain of custody",
    body: "Who labelled what and when, the access granted to each annotator, and the environment the data never left. Signed off before the batch closes.",
    files: ["custody.pdf"],
  },
];

const rest = [
  { status: "Live", name: "Zerra", href: "/products/zerra" },
  { status: "Private demo", name: "Leri", href: "/products/leri" },
  { status: "Engagements open", name: "Enterprise AI", href: "/products/enterprise-ai" },
  { status: "By engagement", name: "Advanced R&D", href: "/products/advanced-rd" },
];

export default function DataAnnotationPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.breadcrumb}>
          <div className={styles.crumbAccent}>Products</div>
          <div className={styles.crumbDot}>&middot;</div>
          <div className={styles.crumbMuted}>Data Annotation</div>
        </div>
        <h1 className={styles.heroTitle}>
          Labelled data you can defend in a review.
        </h1>
        <p className={styles.heroLead}>
          Human annotation for systems that have to be right. Domain specialists
          work to a written spec, disputed items are adjudicated rather than
          averaged, and every batch ships with its agreement rate and its edge
          cases named.
        </p>
        <div className={styles.heroActions}>
          <Link href="/contact" className={styles.buttonSolid}>
            Talk to us about Data Annotation
          </Link>
          <Link href="/#products" className={styles.buttonOutline}>
            All products
          </Link>
        </div>
      </section>

      <ResolveStage />

      <section className={styles.promises}>
        {promises.map((promise) => (
          <RiseIn key={promise.title}>
            <h3 className={styles.promiseTitle}>{promise.title}</h3>
            <p className={styles.promiseBody}>{promise.body}</p>
          </RiseIn>
        ))}
      </section>

      <section className={styles.included}>
        <h2 className={styles.h2Small}>What comes with it</h2>
        <div className={styles.includedList}>
          {included.map((line, i) => (
            <RiseIn
              key={line}
              className={
                i === included.length - 1 ? styles.includedLast : styles.includedRow
              }
            >
              {line}
            </RiseIn>
          ))}
        </div>
      </section>

      <section className={styles.traceSection}>
        <TraceRack />
      </section>

      <section className={styles.collide}>
        <div>
          <div className={styles.eyebrowAccent}>Where labels collide</div>
          <h2 className={styles.h2}>
            One agreement number hides the class that will break you.
          </h2>
          <p className={styles.collideLead}>
            We report agreement per class, and the pairs that annotators confuse
            most. Those pairs are where a model fails in production, and they are
            the pairs your reviewers should read first.
          </p>
          <div className={styles.kappas}>
            <div>
              <div className={styles.kappaValue}>0.91</div>
              <div className={styles.kappaLabel}>Cohen&rsquo;s &kappa;, batch mean</div>
            </div>
            <div>
              <div className={styles.kappaValue}>0.62</div>
              <div className={styles.kappaLabel}>&kappa; on the weakest class</div>
            </div>
          </div>
          <div className={styles.hint}>hover a cell</div>
        </div>
        <ConfusionMatrix />
      </section>

      <section className={styles.handover}>
        <h2 className={styles.h2}>What ships with every batch</h2>
        <p className={styles.handoverLead}>
          Labels are the smallest part of the delivery. The rest is the evidence
          that lets your model risk team sign them off.
        </p>

        <div className={styles.handoverLabel}>In the handover</div>
        <div className={styles.manifest}>
          <div className={styles.batchRow}>
            {batchFacts.map(([label, value]) => (
              <div key={label} className={styles.batchCell}>
                <div className={styles.batchLabel}>{label}</div>
                <div className={styles.batchValue}>{value}</div>
              </div>
            ))}
          </div>

          {handover.map((row) => (
            <div key={row.n} className={styles.manifestRow}>
              <div className={styles.manifestIndex}>{row.n}</div>
              <div className={styles.manifestTitle}>{row.title}</div>
              <p className={styles.manifestBody}>{row.body}</p>
              <div className={styles.manifestFiles}>
                {row.files.map((file) => (
                  <div key={file}>{file}</div>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.manifestFoot}>
            <div>&kappa; 0.91 &middot; 431 rulings &middot; 3 spec amendments</div>
            <div>signed &mdash; O. Bassey, batch lead</div>
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
        <h2 className={styles.closingTitle}>Own your own AI future.</h2>
        <p className={styles.closingLead}>
          Label the data your model will be judged on, with the evidence attached.
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
