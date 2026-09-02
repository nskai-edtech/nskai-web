"use client";

import { useState } from "react";
import { traces } from "./traces";
import styles from "./TraceRack.module.css";

/** The list picks a trace; the panel shows it. Hover or click both select. */
export default function TraceRack() {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.grid}>
      <div>
        <div className={styles.eyebrow}>Adjudication trace</div>
        <h2 className={styles.title}>
          Three passes, one ruling, and the reason in writing.
        </h2>
        <p className={styles.lead}>
          Where annotators disagree, most vendors take the majority and move on.
          We open the item, rule on it, and record why. Every ruling is
          attributable, and the ones that expose a gap amend the spec for the
          rest of the batch.
        </p>

        <div className={styles.list}>
          {traces.map((trace, i) => (
            <button
              key={trace.sector}
              type="button"
              className={i === active ? styles.itemOn : styles.item}
              onPointerEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              <div className={i === active ? styles.sectorOn : styles.sector}>
                {trace.sector}
              </div>
              <div className={styles.summary}>{trace.summary}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.panelWrap}>
        {traces.map((trace, i) => (
          <div
            key={trace.sector}
            className={styles.panel}
            style={{
              opacity: i === active ? 1 : 0,
              pointerEvents: i === active ? "auto" : "none",
              transform: i === active ? "none" : "translateY(10px)",
            }}
            aria-hidden={i !== active}
          >
            <div className={styles.panelHead}>
              <div>{trace.item}</div>
              <div>{trace.scale}</div>
            </div>

            <div className={styles.quote}>{trace.quote}</div>

            <div className={styles.passes}>
              {trace.passes.map((pass, k) => (
                <div key={`${pass.who}-${k}`} className={styles.pass}>
                  <div className={styles.passWho}>{pass.who}</div>
                  <div className={styles.passLabel}>{pass.label}</div>
                  <div className={styles.passReason}>{pass.reason}</div>
                </div>
              ))}
            </div>

            <div className={styles.splitRow}>
              <div className={styles.splitRule} />
              <div className={styles.splitText}>{trace.split}</div>
              <div className={styles.splitRule} />
            </div>

            <div className={styles.ruling}>
              <div className={styles.rulingHead}>
                <div className={styles.rulingWho}>{trace.adjudicator}</div>
                <div className={styles.rulingVerdict}>{trace.ruling}</div>
              </div>
              <p className={styles.rulingBody}>{trace.reasoning}</p>
              <div className={styles.amendment}>{trace.amendment}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
