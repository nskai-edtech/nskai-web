import type { Metadata } from "next";
import Link from "next/link";
import styles from "./company.module.css";

export const metadata: Metadata = {
  title: "Company",
  description:
    "We build artificial intelligence to work on the largest problems there are, and hand the systems over to the institutions that run them.",
};

/** Names are set as written in the design, and capitalised by the stylesheet. */
const leadership = [
  { name: "ifeanyi okala", role: "Founder and Chief Executive Officer", file: "lead-1.jpg" },
  { name: "sumeya hussein", role: "Chief Operating Officer", file: "lead-2.jpg" },
  { name: "fidel isaboke", role: "Chief Technology Officer", file: "lead-3.jpg" },
  { name: "mainya munyambu", role: "Chief Business Officer", file: "lead-4.jpg" },
];

export default function CompanyPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`eyebrow ${styles.heroEyebrow}`}>Company</div>
        <h1 className={styles.heroTitle}>
          Engineers, in the room, on the problem.
        </h1>
      </section>

      <section className={styles.mission}>
        <div className={styles.missionGrid}>
          <div className={styles.label}>Mission</div>
          <p className={styles.missionText}>
            We build artificial intelligence to work on the largest problems there
            are: how people are treated when they are ill, how justice is
            recorded, how energy reaches a grid, how money moves. Those problems
            are not solved by renting a model. They are solved by institutions
            that own their systems outright &mdash; models compressed to run on
            hardware they already have, architecture and runbooks handed over at
            the end, and results reported whether or not they flatter us.
          </p>
        </div>
      </section>

      <section className={styles.leadership}>
        <div className={styles.leadershipHead}>
          <h2 className={styles.h2}>Leadership</h2>
          <div className={styles.label}>Lagos and London</div>
        </div>
        <div className={styles.people}>
          {leadership.map((person) => (
            <div key={person.name} className={styles.person}>
              <div className={styles.portrait}>
                {/* Portraits are not in the repo; see public/portraits/README.md. */}
                <img
                  src={`/portraits/${person.file}`}
                  alt=""
                  className={styles.portraitImage}
                />
              </div>
              {/* The rule draws itself across on hover. */}
              <div className={styles.rule} />
              <div className={styles.divider} />
              <h3 className={styles.name}>{person.name}</h3>
              <div className={styles.role}>{person.role}</div>
            </div>
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
