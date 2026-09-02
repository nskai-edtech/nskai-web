"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FocusRack.module.css";

const rules = [
  {
    n: "01",
    title: "Your documents are indexed where they sit.",
    body: "Rudani reads from the systems you already run. Nothing is copied into an index you do not control.",
  },
  {
    n: "02",
    title: "Retrieval is ranked, then re-read.",
    body: "Candidate passages are read in full before a single word is written, so a ranking mistake does not become an answer mistake.",
  },
  {
    n: "03",
    title: "Every sentence is written against a passage.",
    body: "A claim with no passage behind it does not reach the page. The model is allowed to say that the documents do not answer the question.",
  },
  {
    n: "04",
    title: "A citation points at the paragraph, not the file.",
    body: "Open any number in the answer and you land on the sentence it came from.",
  },
];

/** The four rules, greyed until one reaches the viewport's focus line. */
export default function FocusRack() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const rows = [...host.querySelectorAll<HTMLElement>("[data-row]")];

    const paint = () => {
      const line = window.innerHeight * 0.4;
      let best = 0;
      let bestD = Infinity;
      rows.forEach((row, i) => {
        const r = row.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const d = Math.abs(r.top + r.height / 2 - line);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    paint();
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
    return () => {
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
    };
  }, []);

  return (
    <div ref={ref} className={styles.rack}>
      {rules.map((rule, i) => (
        <div key={rule.n} data-row="" className={styles.row}>
          <div className={i === active ? styles.numOn : styles.num}>{rule.n}</div>
          <h3 className={i === active ? styles.titleOn : styles.title}>
            {rule.title}
          </h3>
          <p className={i === active ? styles.bodyOn : styles.body}>{rule.body}</p>
        </div>
      ))}
    </div>
  );
}
