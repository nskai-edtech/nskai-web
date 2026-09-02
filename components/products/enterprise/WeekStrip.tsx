"use client";

import { useState } from "react";
import styles from "./WeekStrip.module.css";

const weeks = [
  ["01", "Access, data walk, first interviews"],
  ["02", "Problem chosen and written down"],
  ["03", "Baseline measured, evaluation set built"],
  ["04", "Thin slice running end to end"],
  ["05", "First slice in staging with your team"],
  ["06", "Evaluation harness in your CI"],
  ["07", "Second slice, pairing sessions daily"],
  ["08", "Load and failure behaviour tested"],
  ["09", "In production behind a limit"],
  ["10", "Runbooks written by your engineers"],
  ["11", "On-call moves to your team"],
  ["12", "We step out; review scheduled at 90 days"],
];

/** Twelve weeks as a rising strip; hovering one reads out what lands in it. */
export default function WeekStrip() {
  const [active, setActive] = useState<number | null>(null);
  const shown = active ?? 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.strip} onPointerLeave={() => setActive(null)}>
        {weeks.map(([label], i) => (
          <div
            key={label}
            className={styles.bar}
            onPointerEnter={() => setActive(i)}
            style={{
              height: 42 + Math.round(Math.pow(i / 11, 0.85) * 118),
              background: i < 3 ? "#EBD49B" : i < 8 ? "#E8A317" : "#C08706",
              filter:
                active === null || active === i
                  ? "none"
                  : "saturate(0.25) opacity(0.55)",
              transform: active === i ? "scaleY(1.07)" : "none",
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div className={styles.readout}>
        <div className={styles.week}>
          Week {weeks[shown][0]} &middot; {weeks[shown][1]}
        </div>
        <div className={styles.range}>weeks 1&ndash;12</div>
      </div>
    </div>
  );
}
