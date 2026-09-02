"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./RecordRiffle.module.css";

const CARDS = [
  { ref: "MIN/FIN/1984/0417", name: "Ministry of Finance", year: "1984", pages: "128 pages" },
  { ref: "MIN/WKS/1991/2280", name: "Public Works", year: "1991", pages: "64 pages" },
  { ref: "MIN/EDU/1978/0031", name: "Education", year: "1978", pages: "412 pages" },
  { ref: "MIN/HLT/2003/1190", name: "Health", year: "2003", pages: "88 pages" },
  { ref: "MIN/AGR/1969/0004", name: "Agriculture", year: "1969", pages: "1,204 pages" },
];

/** Public sector's one motion piece: a drawer of records riffled one at a time.
    The top card is stamped, then the deck advances under it. */
export default function RecordRiffle() {
  const [idx, setIdx] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [stamped, setStamped] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const next = () => {
    const top = idx % CARDS.length;
    setStamped(top);
    setAccepted((a) => Math.min(CARDS.length, a + 1));
    timer.current = setTimeout(() => {
      setIdx((i) => (i + 1) % CARDS.length);
      setStamped(null);
    }, 240);
  };

  return (
    <div className={styles.grid}>
      <div className={styles.deck}>
        {CARDS.map((card, i) => {
          // Position in the deck relative to the current top card.
          const rel = (i - idx + CARDS.length) % CARDS.length;
          return (
            <div
              key={card.ref}
              className={styles.card}
              style={{
                transform: `translate(${rel * 14}px, ${rel * 16}px) rotate(${((rel - 0.6) * 0.5).toFixed(2)}deg)`,
                zIndex: CARDS.length - rel,
                opacity: rel > 3 ? 0 : 1 - rel * 0.14,
              }}
            >
              <div className={styles.cardHead}>
                <div className={styles.cardRef}>{card.ref}</div>
                <div
                  className={styles.stamp}
                  style={{ opacity: stamped === i ? 1 : 0 }}
                >
                  Indexed
                </div>
              </div>
              <div className={styles.cardName}>{card.name}</div>
              <div className={styles.cardMeta}>
                <div>{card.year}</div>
                <div>{card.pages}</div>
                <div>scanned, unindexed</div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <button type="button" className={styles.button} onClick={next}>
          Index the next record
        </button>
        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <div>Records accepted</div>
            <div className={styles.totalValue}>{accepted}</div>
          </div>
          <div className={styles.totalRow}>
            <div>Left the building</div>
            <div className={styles.totalValue}>0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
