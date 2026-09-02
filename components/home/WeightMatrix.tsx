"use client";

import { useState } from "react";
import styles from "./WeightMatrix.module.css";

const ROWS = 10;
const COLS = 16;

/** A fixed, arbitrary-looking layer. Generated from a seeded LCG so the server
    and client render identical markup. */
const WEIGHTS: number[][] = (() => {
  let seed = 0x9e3779b9;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.round(next() * 100) / 100),
  );
})();

export default function WeightMatrix() {
  const [hover, setHover] = useState<[number, number] | null>(null);

  const equation = hover ? (
    <>
      y<sub>{hover[0]}</sub> &larr; W<sub>{hover[0] + "," + hover[1]}</sub> &middot; x
      <sub>{hover[1]}</sub>
      &nbsp;&nbsp;
      <span className={styles.value}>
        {WEIGHTS[hover[0]][hover[1]].toFixed(2)}
      </span>
    </>
  ) : (
    <>
      y<sub>i</sub> = &Sigma;<sub>j</sub> W<sub>ij</sub> x<sub>j</sub>
    </>
  );

  return (
    <div onPointerLeave={() => setHover(null)}>
      <div className={styles.equation}>{equation}</div>

      <div className={styles.frame}>
        <div className={styles.bracketLeft} aria-hidden="true" />
        <div className={styles.grid}>
          {WEIGHTS.map((row, r) =>
            row.map((v, c) => {
              const inLine = hover ? hover[0] === r || hover[1] === c : true;
              const isCell = hover ? hover[0] === r && hover[1] === c : false;
              return (
                <div
                  key={`${r},${c}`}
                  className={styles.cell}
                  onPointerEnter={() => setHover([r, c])}
                  style={{
                    background: `rgba(22,16,15,${(0.06 + v * 0.5).toFixed(3)})`,
                    opacity: inLine ? 1 : 0.35,
                    outlineColor: isCell ? "var(--accent)" : "transparent",
                  }}
                />
              );
            }),
          )}
        </div>
        <div className={styles.bracketRight} aria-hidden="true" />
      </div>

      <div className={styles.note}>
        <div className={styles.noteRule} />
        <div className={styles.noteText}>
          W &isin; &#8477;<sup>10&times;16</sup> &mdash; one layer, every value
          readable
        </div>
      </div>
    </div>
  );
}
