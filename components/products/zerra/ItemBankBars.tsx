"use client";

import { useMemo, useState } from "react";
import { seeded, shade } from "./scale";
import styles from "./ItemBankBars.module.css";

const COUNT = 32;

/** One item bank, drawn as calibrated difficulty. Hovering a column reads it out. */
export default function ItemBankBars() {
  const bars = useMemo(() => {
    const rnd = seeded(31);
    return Array.from({ length: COUNT }, (_, i) => {
      const difficulty = -2.4 + (i / (COUNT - 1)) * 4.8;
      const height = 0.35 + rnd() * 0.6;
      return {
        difficulty,
        height,
        colour: shade(0.15 + (i / (COUNT - 1)) * 0.55),
      };
    });
  }, []);

  const [active, setActive] = useState<number | null>(null);

  const readout =
    active === null ? (
      <>b &isin; [&minus;2.4, 2.4]</>
    ) : (
      <>
        {`item ${active + 1} · b = ${bars[active].difficulty.toFixed(1)} · n = ${Math.round(
          bars[active].height * 640,
        )}`}
      </>
    );

  return (
    <div className={styles.plate}>
      <div className={styles.bars} onPointerLeave={() => setActive(null)}>
        {bars.map((bar, i) => (
          <div
            key={i}
            className={styles.bar}
            onPointerEnter={() => setActive(i)}
            style={{
              height: `${Math.round(bar.height * 100)}%`,
              background: bar.colour,
              opacity: active === null || active === i ? 1 : 0.4,
              transform: active === i ? "scaleY(1.06)" : "none",
            }}
          />
        ))}
      </div>
      <div className={styles.axis}>
        <div>easier</div>
        <div className={styles.readout}>{readout}</div>
        <div>harder</div>
      </div>
    </div>
  );
}
