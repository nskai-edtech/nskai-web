"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ProgrammeTabs.module.css";

type Programme = {
  id: string;
  year: string;
  name: string;
  lead: string;
  stats: { value: string; label: string }[];
  body: string;
  links: { label: string; href: string; external?: boolean }[];
  // src is optional: the design leaves these as drop slots, and a programme
  // with no photograph yet shows the empty frame rather than a broken image.
  figure: { src?: string; caption: string };
};

const PROGRAMMES: Programme[] = [
  {
    id: "udara",
    year: "2026",
    name: "The Udara Project",
    lead: "A free artificial-intelligence training programme run across African universities, delivered with volunteer instructors and no fee to participants.",
    stats: [
      { value: "21,000+", label: "People signed up" },
      { value: "290", label: "Institutions reached" },
      { value: "31", label: "African countries" },
      { value: "1,497", label: "From one university alone" },
    ],
    body: "Udara runs as a cohort programme: five days of live teaching, hands-on exercises and then a 48-day hackathon, all delivered remotely so that a student in Kano and a student in Kigali sit the same course. The 2026 edition reached 290 universities, and 23 of them registered more than a hundred learners each.",
    links: [{ label: "See the Udara Project in full →", href: "/foundation/udara" }],
    figure: {
      src: "/udara/participants.png",
      caption: "Fig. 1 — An Udara cohort session.",
    },
  },
  {
    id: "rag",
    year: "2025",
    name: "RAG and AI Agents Bootcamp",
    lead: "A six-week virtual bootcamp on retrieval-augmented generation and agent systems, taught free of charge and open to anyone who registered.",
    stats: [
      { value: "1,370", label: "Participants" },
      { value: "50", label: "Countries" },
      { value: "14", label: "Speakers" },
      { value: "7", label: "Live sessions" },
      { value: "18", label: "Projects shipped" },
      { value: "0", label: "Cost to attend" },
    ],
    body: "Six weeks, live sessions with practitioners, and a build requirement rather than a certificate of attendance. Participants formed their own teams — each drawing members from at least three different countries — and shipped eighteen working retrieval systems into the closing hackathon, across twelve sectors from national curricula to poultry farming. Every session was recorded and left public.",
    links: [
      { label: "See the full programme and speakers →", href: "/foundation/rag-bootcamp-2025" },
      {
        label: "Recordings on YouTube →",
        href: "https://www.youtube.com/@Nskaicommunity",
        external: true,
      },
    ],
    figure: {
      caption: "Fig. 2 — The 2025 bootcamp.",
    },
  },
];

/** The two programmes the Foundation has run, one panel at a time. Switching
    re-runs the figures so the numbers land rather than simply appear. */
export default function ProgrammeTabs() {
  const [active, setActive] = useState(0);
  const programme = PROGRAMMES[active];

  return (
    <div>
      <div className={styles.tabs}>
        {PROGRAMMES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={i === active ? styles.tabOn : styles.tab}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
          >
            <div className={i === active ? styles.tabYearOn : styles.tabYear}>
              {p.year}
            </div>
            <div className={i === active ? styles.tabNameOn : styles.tabName}>
              {p.name}
            </div>
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        <div>
          <p className={styles.lead}>{programme.lead}</p>

          <div
            className={
              programme.stats.length > 4 ? styles.statsThree : styles.statsTwo
            }
          >
            {programme.stats.map((stat, i) => (
              <div
                /* Keyed on the programme so switching remounts the figures and
                   the stagger replays rather than sitting already-finished. */
                key={`${programme.id}-${stat.label}`}
                className={styles.stat}
                style={{ animationDelay: `${40 + i * 70}ms` }}
              >
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          <p className={styles.body}>{programme.body}</p>

          <div className={styles.links}>
            {programme.links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener"
                  className={styles.link}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>

        <figure className={styles.figure}>
          <div className={styles.figureFrame}>
            {programme.figure.src && (
              <img
                src={programme.figure.src}
                alt=""
                loading="lazy"
                className={styles.figureImage}
              />
            )}
          </div>
          <figcaption className={styles.figureCaption}>
            {programme.figure.caption}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
