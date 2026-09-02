"use client";

import { useState } from "react";
import styles from "./CaseStrip.module.css";

const CASES = [
  { title: "Damaged in transit", outcome: "Refund in full", time: "decided in 2.1s" },
  { title: "Wrong size, worn", outcome: "Exchange offered", time: "decided in 1.8s" },
  { title: "Outside window", outcome: "Refused, reason cited", time: "decided in 1.4s" },
  { title: "Item not received", outcome: "Refund in full", time: "decided in 2.4s" },
  { title: "Change of mind, sealed", outcome: "Refund in full", time: "decided in 1.6s" },
  { title: "Faulty after 40 days", outcome: "Repair or replace", time: "decided in 2.9s" },
  { title: "Duplicate order", outcome: "Refund in full", time: "decided in 1.2s" },
  { title: "Missing part", outcome: "Part dispatched", time: "decided in 2.2s" },
];

/** Retail's one motion piece: a strip of decided cases drifting past. Pointing
    at the strip holds it; pointing at a case opens the decision. */
export default function CaseStrip() {
  const [held, setHeld] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div
      className={styles.wrap}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => {
        setHeld(false);
        setOpen(null);
      }}
    >
      {/* The list is repeated once so the -50% drift loops seamlessly. */}
      <div
        className={styles.track}
        style={{ animationPlayState: held ? "paused" : "running" }}
      >
        {[...CASES, ...CASES].map((item, i) => (
          <div
            key={i}
            className={open === i ? styles.caseOpen : styles.case}
            onPointerEnter={() => setOpen(i)}
            onPointerLeave={() => setOpen((o) => (o === i ? null : o))}
          >
            <div className={styles.label}>Case</div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.body}>
              <div className={styles.outcome}>{item.outcome}</div>
              <div className={styles.time}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
