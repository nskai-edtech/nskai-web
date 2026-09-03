"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ReconciliationLedger.module.css";

type Row = {
  date: string;
  reference: string;
  statement: string;
  ledger: string;
  /** Statement and ledger disagree, so the rule leaves it behind as an exception. */
  exception: boolean;
};

const ROWS: Row[] = [
  { date: "04 AUG", reference: "40182", statement: "128,400.00", ledger: "128,400.00", exception: false },
  { date: "04 AUG", reference: "40183", statement: "96,220.15", ledger: "96,220.15", exception: false },
  { date: "04 AUG", reference: "40184", statement: "41,000.00", ledger: "41,000.00", exception: false },
  { date: "04 AUG", reference: "40185", statement: "7,318.40", ledger: "7,318.40", exception: false },
  { date: "04 AUG", reference: "40186", statement: "512,900.00", ledger: "512,900.00", exception: false },
  { date: "04 AUG", reference: "40187", statement: "23,004.65", ledger: "23,004.65", exception: false },
  { date: "04 AUG", reference: "40188", statement: "88,150.00", ledger: "88,150.00", exception: false },
  { date: "04 AUG", reference: "40189", statement: "64,720.00", ledger: "64,270.00", exception: true },
  { date: "04 AUG", reference: "40190", statement: "9,940.00", ledger: "—", exception: true },
];

/** Financial services' one motion piece: drag the rule down the day. Lines pair
    as it passes them; what is left below is the exception list. */
export default function ReconciliationLedger() {
  const listRef = useRef<HTMLDivElement>(null);
  /** How far down the list the rule sits, in pixels. */
  const [y, setY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const moveTo = useCallback((clientY: number) => {
    const list = listRef.current;
    if (!list) return;
    const r = list.getBoundingClientRect();
    setY(Math.max(0, Math.min(r.height, clientY - r.top)));
  }, []);

  // Start part-way down, so the piece reads as interactive before it is touched.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const t = setTimeout(
      () => setY(list.getBoundingClientRect().height * 0.22),
      260,
    );
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, [dragging]);

  /** A row is passed once the rule is below 60% of its height. */
  const rowHeight = listRef.current
    ? listRef.current.getBoundingClientRect().height / ROWS.length
    : 0;
  const passedCount = rowHeight
    ? ROWS.filter((_, i) => i * rowHeight + rowHeight * 0.6 < y).length
    : 0;
  const passed = ROWS.slice(0, passedCount);
  const paired = passed.filter((r) => !r.exception).length;
  const exceptions = passed.filter((r) => r.exception).length;

  return (
    <div
      className={styles.wrap}
      onPointerDown={(e) => {
        // Capture, so the rule keeps following once the pointer leaves the
        // table — otherwise a quick drag past the edge strands it mid-list.
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        moveTo(e.clientY);
      }}
      onPointerMove={(e) => {
        if (dragging) moveTo(e.clientY);
      }}
      onPointerUp={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      }}
    >
      <div className={styles.header}>
        <div>Date</div>
        <div>Reference</div>
        <div>Statement</div>
        <div>Ledger</div>
        <div>State</div>
      </div>

      <div ref={listRef} className={styles.list}>
        {ROWS.map((row, i) => {
          const isPassed = i < passedCount;
          const state = !isPassed ? "" : row.exception ? "Exception" : "Paired";
          return (
            <div
              key={row.reference}
              className={
                isPassed && row.exception
                  ? styles.rowException
                  : isPassed
                    ? styles.rowPaired
                    : styles.row
              }
            >
              <div className={styles.date}>{row.date}</div>
              <div className={styles.reference}>{row.reference}</div>
              <div className={styles.amount}>{row.statement}</div>
              <div className={styles.amount}>{row.ledger}</div>
              <div className={styles.state}>{state || " "}</div>
            </div>
          );
        })}

        <div className={styles.handle} style={{ top: y }} aria-hidden="true">
          <div className={styles.handleTag}>Drag</div>
        </div>
      </div>

      <div className={styles.totals}>
        <div>
          Paired <span className={styles.total}>{paired}</span>
        </div>
        <div>
          Exceptions <span className={styles.total}>{exceptions}</span>
        </div>
        <div>
          Remaining <span className={styles.total}>{ROWS.length - passedCount}</span>
        </div>
      </div>
    </div>
  );
}
