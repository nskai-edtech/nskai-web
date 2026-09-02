import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import ServiceGrid from "@/components/ServiceGrid";
import { plates } from "@/lib/industries";
import styles from "./solutions.module.css";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Every engagement starts from a number you already report — a resolution rate, a handling time, a backlog — and ends with a system your own team runs.",
};

/** The overview card for each industry, in the order the plates are numbered.
    The blurb here is the overview's own, not the plate's lead. */
const cards: { slug: string; body: string; products: string; flood: string; ink: string }[] = [
  {
    slug: "financial-services",
    body: "Failed transfers reconciled and resolved without a human touching the ledger, and analysts who can read the model that flagged the case.",
    products: "Leri · Enterprise AI",
    flood: "#FF5A1F",
    ink: "#F6F1EF",
  },
  {
    slug: "telecommunications",
    body: "Support that answers in the customer’s language, on the channel they used, with billing state already reconciled.",
    products: "Leri · Data Annotation",
    flood: "#E01A0D",
    ink: "#F6F1EF",
  },
  {
    slug: "public-sector",
    body: "Retrieval over records that cannot leave the building, deployed air-gapped and operated by your own staff.",
    products: "Enterprise AI · Zerra",
    flood: "#1E3A8A",
    ink: "#F6F1EF",
  },
  {
    slug: "retail-and-commerce",
    body: "Order, payment and delivery state read together, so a refund decision takes one exchange instead of five.",
    products: "Leri · Enterprise AI",
    flood: "#0E7C66",
    ink: "#F6F1EF",
  },
  {
    slug: "health-and-insurance",
    body: "Clinical and claims documents labelled by specialists, with agreement rates you can put in front of a regulator.",
    products: "Data Annotation · Advanced R&D",
    flood: "#E8A317",
    ink: "#16100F",
  },
  {
    slug: "energy-and-industry",
    body: "Field data annotated and models quantized to run on the bandwidth and hardware you actually have on site.",
    products: "Advanced R&D · Enterprise AI",
    flood: "#8E1108",
    ink: "#F6F1EF",
  },
];

const engagement = [
  {
    n: "01",
    title: "Scope",
    body: "Two weeks. We read your architecture, pick the failure worth fixing, and write the cost ceiling down.",
  },
  {
    n: "02",
    title: "Build",
    body: "Six to twelve weeks with your engineers in the room, against your data and your constraints.",
  },
  {
    n: "03",
    title: "Prove",
    body: "Evaluated on your own tasks, not benchmarks. If it does not clear the bar, we say so.",
  },
  {
    n: "04",
    title: "Hand over",
    body: "Architecture, runbooks and training. Your team operates it; we stay on call for the term you choose.",
  },
];

const nameOf = (slug: string) => plates.find((p) => p.slug === slug)!.name;

export default function SolutionsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`eyebrow ${styles.heroEyebrow}`}>Solutions</div>
        <h1 className={styles.heroTitle}>
          Start from the failure you already measure.
        </h1>
        <p className={styles.heroLead}>
          We do not sell a platform and hope you find a use for it. Every
          engagement starts from a number you already report &mdash; a resolution
          rate, a handling time, a backlog &mdash; and ends with a system your own
          team runs.
        </p>
      </section>

      <section className={styles.plateSection}>
        <figure className={styles.plate}>
          <div className={styles.plateFrame}>
            {/* See public/plates/README.md for the source of this photograph. */}
            <img src="/plates/sol-band.jpg" alt="" className={styles.plateImage} />
          </div>
          <figcaption className={styles.plateCaption}>
            <div className={styles.captionText}>
              Fig. 1 &mdash; The administration room, Amsterdam, 1930s. Nationaal
              Archief, public domain.
            </div>
            <div className={styles.captionStamp}>
              Plate I
              <br />
              NSK&middot;SOL&middot;01
            </div>
          </figcaption>
        </figure>

        <div className={styles.cards}>
          {cards.map((card) => (
            <Link
              key={card.slug}
              href={`/solutions/${card.slug}`}
              className={styles.card}
              style={
                { "--flood-bg": card.flood, "--flood-ink": card.ink } as CSSProperties
              }
            >
              <h3 className={styles.cardTitle}>{nameOf(card.slug)}</h3>
              <p className={styles.cardBody}>{card.body}</p>
              <div className={styles.cardProducts}>{card.products}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.engagement}>
        <h2 className={styles.h2}>How an engagement runs</h2>
        <div className={styles.steps}>
          {engagement.map((step) => (
            <div key={step.n} className={styles.step}>
              <div className={styles.stepIndex}>{step.n}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.services}>
        <h2 className={styles.h2}>Supported by expert partnership</h2>
        <p className={styles.servicesLead}>
          Work with world-class AI scientists and engineers to enable
          transformation that drives impact.
        </p>
        <div className={styles.servicesLabel}>Our services</div>
        <ServiceGrid numbered />
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
