"use client";

import { useState } from "react";
import { faces, inkOn } from "./faces";
import styles from "./CaseLedger.module.css";

/** The same eight faces as one case's receipt. Hovering a row floods it in that
    face's tint and steps it in from the left. */
export default function CaseLedger() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className={styles.ledger}>
      {faces.map((face, i) => {
        const on = hover === i;
        const ink = inkOn(i);
        return (
          <div
            key={face.name}
            className={styles.row}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover((h) => (h === i ? null : h))}
            style={{
              background: on ? face.tint : "var(--paper)",
              color: on ? ink : "var(--ink)",
              paddingLeft: on ? 40 : 20,
            }}
          >
            <div className={styles.index} style={on ? { color: ink, opacity: 0.8 } : undefined}>
              0{i + 1}
            </div>
            <div className={styles.name}>{face.name}</div>
            <div className={styles.event} style={on ? { color: ink, opacity: 0.8 } : undefined}>
              {face.event}
            </div>
            <div className={styles.detail} style={on ? { color: ink, opacity: 0.8 } : undefined}>
              {face.detail}
            </div>
            <div
              className={styles.token}
              style={{
                background: on ? ink : face.tint,
                transform: on ? "rotate(45deg) scale(1.4)" : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
