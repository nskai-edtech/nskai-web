import type { Metadata } from "next";
import Link from "next/link";
import ProgrammeTabs from "@/components/foundation/ProgrammeTabs";
import { DISCORD_URL } from "@/lib/nav";
import styles from "./foundation.module.css";

export const metadata: Metadata = {
  title: "Foundation",
  description:
    "The NSK AI Foundation runs free training programmes in artificial intelligence, delivered remotely so that where somebody lives does not decide whether they can attend.",
};

const registration = [
  { label: "Registered name", value: "Bambara Artificial Intelligence Foundation" },
  { label: "Operating as", value: "The NSK AI Foundation" },
  { label: "Programmes to date", value: "Two, both delivered free" },
];

const principles = [
  {
    title: "Free at the point of use",
    body: "No fee, no scholarship application, no sponsor deciding who gets in. If a cohort has room, you are in it.",
  },
  {
    title: "Taught by people who build",
    body: "Sessions are run by working engineers and researchers, most of them from the community, all of them unpaid for it.",
  },
  {
    title: "Materials stay public",
    body: "Recordings, notebooks and reading lists remain available after the cohort ends, for people who could not attend live.",
  },
];

const teaching = [
  { label: "Commitment", value: "One session, 90 minutes" },
  { label: "Format", value: "Live, remote, recorded" },
  { label: "Who has taught", value: "14 practitioners to date" },
  { label: "Payment", value: "None, in either direction" },
];

export default function FoundationPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.mono}>Foundation</div>
        <h1 className={styles.heroTitle}>
          Teaching this work to people who were never going to be sold it.
        </h1>
        <p className={styles.heroLead}>
          The NSK AI Foundation is our non-profit arm, registered as the Bambara
          Artificial Intelligence Foundation. It runs free training programmes in
          artificial intelligence, delivered remotely so that where somebody lives
          does not decide whether they can attend.
        </p>
        <div className={styles.registration}>
          {registration.map((row) => (
            <div key={row.label} className={styles.registrationCell}>
              <div className={styles.monoMuted}>{row.label}</div>
              <div className={styles.registrationValue}>{row.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.programmes}>
        <ProgrammeTabs />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>How the Foundation works</h2>
        </div>
        <div className={styles.principles}>
          {principles.map((principle) => (
            <div key={principle.title} className={styles.principle}>
              <div className={styles.principleRule} />
              <h3 className={styles.principleTitle}>{principle.title}</h3>
              <p className={styles.principleBody}>{principle.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <div className={styles.monoMuted}>Mission</div>
          <div>
            <p className={styles.missionLead}>
              To put artificial intelligence within reach of everybody, so that
              more people can use it to build fuller lives.
            </p>
            <p className={styles.missionBody}>
              In practice that means running the training ourselves, at no cost,
              in places where commercial providers see no market. The Foundation
              is directed by NSK AI&rsquo;s founder and advised by a board drawn
              from the community.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.teachGrid}>
          <div>
            <div className={styles.mono}>Teach with us</div>
            <h2 className={styles.h2Wide}>
              Every session in both programmes was taught by a volunteer.
            </h2>
            <p className={styles.teachLead}>
              Instructors commit to one session: ninety minutes, live, recorded,
              on something they work on. No curriculum to write from scratch and
              no fee, on either side.
            </p>
            <Link href="/contact" className={styles.buttonSolid}>
              Offer a session
            </Link>
          </div>
          <div className={styles.teachTable}>
            {teaching.map((row) => (
              <div key={row.label} className={styles.teachRow}>
                <div className={styles.teachLabel}>{row.label}</div>
                <div className={styles.teachValue}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <div className={styles.monoMuted}>Where it comes from</div>
          <div>
            <p className={styles.originText}>
              The Foundation grew out of the community, not the other way round.
              The same people who run Wednesday paper talks teach the cohorts, and
              most of the instructors first arrived as participants.
            </p>
            <Link href="/community" className={styles.originLink}>
              See the community &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className={styles.closing}>
        <h2 className={styles.closingTitle}>Teach a cohort, or join one.</h2>
        <p className={styles.closingLead}>
          Instructors, partner institutions and participants all come through the
          same door.
        </p>
        <div className={styles.closingActions}>
          <Link href="/contact" className={styles.buttonSolid}>
            Get involved
          </Link>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener"
            className={styles.buttonOutline}
          >
            Join the Discord
          </a>
        </div>
      </section>
    </>
  );
}
