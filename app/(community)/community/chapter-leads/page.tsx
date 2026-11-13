import type { Metadata } from "next";
import Link from "next/link";
import { CHAPTER_LEAD_FORM_URL } from "@/lib/nav";
import styles from "./chapterLeads.module.css";

export const metadata: Metadata = {
  title: "Become a Campus Chapter Lead",
  description:
    "Lead NSK AI and the Udara Project on your campus: build a chapter team, bring students into free AI training, and run events.",
};

const own = [
  {
    title: "Your chapter team",
    body: "You recruit it, run it and keep it active.",
  },
  {
    title: "Registrations on your campus",
    body: "Bringing students at your institution into Udara.",
  },
  {
    title: "Local events",
    body: "Paper talks, labs and meetups your chapter holds.",
  },
  {
    title: "The chapter's presence",
    body: "How visible NSK AI is on campus, from noticeboards to class groups.",
  },
];

const receive = [
  "A signed letter of appointment",
  "A verifiable credential",
  "A recommendation letter for strong performance",
  "Direct access to the NSK AI team",
];

export default function ChapterLeadsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.mono}>Community &middot; Campus chapters</div>
        <h1 className={styles.heroTitle}>Lead NSK AI on your campus.</h1>
        <p className={styles.heroLead}>
          A campus chapter lead runs NSK AI and the Udara Project at their own
          institution. Udara 2026 reached 290 universities in 31 African
          countries because students took it to their campuses. The next one
          could be yours.
        </p>
        <div className={styles.heroActions}>
          <a href={CHAPTER_LEAD_FORM_URL} target="_blank" rel="noopener" className={styles.buttonSolid}>
            Apply to lead a chapter ↗
          </a>
          <Link href="/hub" className={styles.buttonOutline}>
            Already a lead? Chapter Hub
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>The chapter is yours.</h2>
        </div>
        <div className={styles.ownGrid}>
          {own.map((item, i) => (
            <div key={item.title} className={styles.ownCell}>
              <div className={styles.mono}>0{i + 1}</div>
              <h3 className={styles.ownTitle}>{item.title}</h3>
              <p className={styles.ownBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <div>
          <div className={styles.monoOnDark}>What you get</div>
          <ul className={styles.receiveList}>
            {receive.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={styles.closingCta}>
          <h2 className={styles.closingTitle}>Ready to start one?</h2>
          <p className={styles.closingLead}>
            Apply through the form. Shortlisted candidates are invited to a
            conversation with the team.
          </p>
          <a href={CHAPTER_LEAD_FORM_URL} target="_blank" rel="noopener" className={styles.buttonSolid}>
            Apply to lead a chapter ↗
          </a>
        </div>
      </section>
    </>
  );
}
