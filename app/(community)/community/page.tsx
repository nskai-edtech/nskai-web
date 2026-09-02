import type { Metadata } from "next";
import Link from "next/link";
import { DISCORD_URL } from "@/lib/nav";
import styles from "./community.module.css";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Paper talks, games night and talks with people who build this work for a living. No application, no fee. Join the Discord and you are in.",
};

/** The flyer wall, in the order the design hangs them. */
const FLYERS = [11, 1, 0, 4, 13, 12, 14, 6, 5, 10, 2, 7, 8, 9, 3];

const formats = [
  {
    flyer: 11,
    when: "Wednesdays",
    title: "Paper talks",
    body: "One paper, one presenter, forty minutes and an argument. Members pick what gets read, and anyone can take a turn presenting.",
  },
  {
    flyer: 1,
    when: "Fridays",
    title: "Games night",
    body: "No agenda and no slides. It is how most of the people who now work here first met everyone else.",
  },
  {
    flyer: 13,
    when: "Through the year",
    title: "Talks with speakers",
    body: "Practitioners from industry and academia walk through work they have shipped, including the parts that failed.",
  },
];

export default function CommunityPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.mono}>Community</div>
        <h1 className={styles.heroTitle}>Open to anyone who turns up.</h1>
        <p className={styles.heroLead}>
          Paper talks, games night and talks with people who build this work for a
          living. No application, no fee, and no requirement to be a computer
          scientist. Join the Discord and you are in.
        </p>
        <div className={styles.heroActions}>
          <a href="#discord" className={styles.buttonSolid}>
            Join the Discord
          </a>
          <a href="#week" className={styles.buttonOutline}>
            What runs each week
          </a>
        </div>
      </section>

      <section className={styles.wall}>
        <div className={styles.wallHead}>
          <h2 className={styles.h2}>Sessions we have run</h2>
        </div>
        <div className={styles.flyers}>
          {FLYERS.map((n) => (
            <div key={n} className={styles.flyer}>
              <div className={styles.flyerFrame}>
                <img
                  src={`/flyers/f${n}.jpg`}
                  alt="NSK AI community flyer"
                  loading="lazy"
                  decoding="async"
                  className={styles.flyerImage}
                />
              </div>
            </div>
          ))}
        </div>
        <p className={styles.wallNote}>
          Every session is announced with a flyer, and every flyer names the
          paper, the speaker and the room. Nothing here was invite-only.
        </p>
      </section>

      <section id="week" className={styles.formats}>
        <div className={styles.formatsHead}>
          <h2 className={styles.h2}>What runs, and how to walk in</h2>
          <p className={styles.formatsLead}>
            Three standing formats. Each one is open to anyone in the Discord,
            whether you speak or just listen.
          </p>
        </div>
        <div className={styles.formatGrid}>
          {formats.map((format) => (
            <div key={format.title} className={styles.format}>
              <div className={styles.formatFrame}>
                <img
                  src={`/flyers/f${format.flyer}.jpg`}
                  alt={`${format.title} flyer`}
                  className={styles.flyerImage}
                />
              </div>
              <div className={styles.formatBody}>
                <div className={styles.monoAccent}>{format.when}</div>
                <h3 className={styles.formatTitle}>{format.title}</h3>
                <p className={styles.formatText}>{format.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="discord" className={styles.discordSection}>
        <div className={styles.discord}>
          <div>
            <div className={styles.monoOnAccent}>Everyone welcome</div>
            <h2 className={styles.discordTitle}>
              You do not need permission to join us.
            </h2>
            <p className={styles.discordLead}>
              Students, doctors, designers, teachers, self-taught engineers. Talks
              are announced on Discord, papers are argued about there, and the
              reading list lives there.
            </p>
          </div>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener"
            className={styles.discordButton}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <path d="M8 6.5c-1.6.3-3.1.9-4.3 1.7C2.4 11.4 2 14.4 2.2 17.4c1.4 1 3 1.7 4.7 2.1l.9-1.5" />
              <path d="M16 6.5c1.6.3 3.1.9 4.3 1.7 1.3 3.2 1.7 6.2 1.5 9.2-1.4 1-3 1.7-4.7 2.1l-.9-1.5" />
              <path d="M7.8 18c2.8.9 5.6.9 8.4 0" />
              <circle cx="9.2" cy="13" r="1.4" />
              <circle cx="14.8" cy="13" r="1.4" />
              <path d="M8.3 6.3 9 4.7c2-.3 4-.3 6 0l.7 1.6" />
            </svg>
            Join the Discord
          </a>
        </div>
      </section>

      <section id="contact" className={styles.closing}>
        <h2 className={styles.closingTitle}>Come to the next one.</h2>
        <p className={styles.closingLead}>
          Paper talks on Wednesdays and games on Fridays. Turn up, listen, and
          present when you feel like it.
        </p>
        <div className={styles.closingActions}>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener"
            className={styles.buttonSolid}
          >
            Join the Discord
          </a>
          <Link href="/foundation" className={styles.buttonOutline}>
            See the Foundation
          </Link>
        </div>
      </section>
    </>
  );
}
