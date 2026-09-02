"use client";

import { useState } from "react";
import styles from "./ConfusionMatrix.module.css";

const labels = ["Failed", "Reversed", "Pending", "Duplicate", "Settled", "Disputed"];

/** Disagreements per label pair, batch NB-24. Symmetric; the diagonal is unused. */
const matrix = [
  [0, 14, 9, 2, 0, 3],
  [14, 0, 21, 1, 4, 2],
  [9, 21, 0, 0, 11, 1],
  [2, 1, 0, 0, 0, 17],
  [0, 4, 11, 0, 0, 1],
  [3, 2, 1, 17, 1, 0],
];

/** Why those pairs collide, keyed by the ordered pair. */
const notes: Record<string, string> = {
  "1,2": "Reversal instructed but not settled. The spec now decides on settlement state, not the flag.",
  "0,2": "A transfer still inside its value date reads as failure to the customer and as pending to the ledger.",
  "3,5": "Repeat debits from a retried request look identical to a disputed charge until the mandate is checked.",
  "2,4": "Settlement that lands after the batch cut-off is captured as pending in the source extract.",
  "0,1": "Both states end with the customer out of funds, so the wording of the guideline decides the label.",
};

const DEFAULT_READ =
  "Disagreements per label pair, batch NB-24. Darker means the pair collides more often.";

export default function ConfusionMatrix() {
  const [hover, setHover] = useState<[number, number] | null>(null);

  return (
    <div>
      <div className={styles.head}>
        <div />
        {labels.map((label) => (
          <div key={label} className={styles.headCell}>
            {label}
          </div>
        ))}
      </div>

      <div className={styles.grid} onPointerLeave={() => setHover(null)}>
        {matrix.map((row, r) => (
          <div key={labels[r]} className={styles.rowContents}>
            <div className={styles.rowLabel}>{labels[r]}</div>
            {row.map((v, c) => {
              const share = v / 21;
              const diagonal = r === c;
              const on = hover?.[0] === r && hover?.[1] === c;
              return (
                <div
                  key={`${r},${c}`}
                  className={styles.cell}
                  onPointerEnter={() => !diagonal && setHover([r, c])}
                  style={{
                    background: diagonal
                      ? "#E0E8E1"
                      : v === 0
                        ? "#EAF0EA"
                        : `rgba(14,124,102,${(0.1 + share * 0.78).toFixed(3)})`,
                    color: share > 0.45 ? "#EEF2EE" : "#0F1512",
                    opacity: hover === null || on ? 1 : 0.32,
                    outlineColor: on ? "#0F1512" : "transparent",
                  }}
                >
                  {diagonal ? "—" : v}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.readout}>
        {hover ? (
          <>
            <span className={styles.count}>{matrix[hover[0]][hover[1]]} items</span>{" "}
            split between <span className={styles.pair}>{labels[hover[0]]}</span> and{" "}
            <span className={styles.pair}>{labels[hover[1]]}</span>.{" "}
            {notes[
              `${Math.min(hover[0], hover[1])},${Math.max(hover[0], hover[1])}`
            ] ?? "Each was adjudicated and the ruling is in the log."}
          </>
        ) : (
          DEFAULT_READ
        )}
      </div>
    </div>
  );
}
