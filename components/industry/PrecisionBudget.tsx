"use client";

import { useState } from "react";
import styles from "./PrecisionBudget.module.css";

/** The steps the slider walks, widest precision first. */
const BITS = [16, 12, 8, 6, 5, 4, 3];

/** Decimal places that survive at each width, and what the trade buys. */
const DECIMALS: Record<number, number> = { 16: 4, 12: 3, 8: 2, 6: 2, 5: 1, 4: 1, 3: 0 };
const ERROR: Record<number, string> = {
  16: "0.0",
  12: "0.0",
  8: "+0.1",
  6: "+0.2",
  5: "+0.3",
  4: "+0.4",
  3: "+2.9",
};
const RUNS_ON: Record<number, string> = {
  16: "server only",
  12: "server only",
  8: "server, gateway",
  6: "gateway",
  5: "gateway, handheld",
  4: "gateway, handheld, control room",
  3: "anything, but wrong more often",
};

const WEIGHTS = [0.4213, -0.1187, 0.9042, 0.3376, -0.7551, 0.0629, 0.5108, -0.2894];

/** Energy and industry's one motion piece: set the precision budget and watch
    which digits survive it, and what the site can then run. */
export default function PrecisionBudget() {
  const [step, setStep] = useState(0);
  const bits = BITS[step];
  const dp = DECIMALS[bits];

  return (
    <div className={styles.grid}>
      <div className={styles.panel}>
        <div className={styles.label}>Weights, as stored</div>
        <div className={styles.weights}>
          {WEIGHTS.map((w) => {
            // Rounding to the surviving decimal places IS the quantization.
            const factor = Math.pow(10, dp);
            const q = Math.round(w * factor) / factor;
            return (
              <div
                key={w}
                className={bits <= 3 ? styles.weightSpent : styles.weight}
              >
                {q.toFixed(dp)}
              </div>
            );
          })}
        </div>

        <div className={styles.control}>
          <div className={styles.label}>Precision budget</div>
          <input
            type="range"
            min={0}
            max={BITS.length - 1}
            step={1}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            className={styles.slider}
            aria-label="Precision budget, in bits"
          />
          <div className={styles.bits}>{bits} bit</div>
        </div>
      </div>

      <div className={styles.readout}>
        <div className={styles.readoutRow}>
          <div>On disk</div>
          <div className={styles.readoutValue}>
            {((7 * bits) / 8).toFixed(1)} GB
          </div>
        </div>
        <div className={styles.readoutRow}>
          <div>Latency, per token</div>
          <div className={styles.readoutValue}>
            {Math.round((38 * bits) / 4)} ms
          </div>
        </div>
        <div className={styles.readoutRow}>
          <div>Error delta</div>
          <div className={styles.readoutValue}>{ERROR[bits]} pts</div>
        </div>
        <div className={styles.readoutRow}>
          <div>Runs on</div>
          <div className={styles.readoutValue}>{RUNS_ON[bits]}</div>
        </div>
      </div>
    </div>
  );
}
