"use client";

import { useState } from "react";
import styles from "./RoleFan.module.css";

const roles = [
  ["Research engineer", "Chooses the method, and proves it on your data."],
  ["Platform engineer", "Makes it run where your systems already run."],
  ["Data engineer", "Gets the pipeline honest before anything is trained."],
  ["Delivery lead", "Accountable for the fortnight, and for the handover."],
  ["Your engineers", "In every decision, holding the pager at the end."],
];

const BASE = 60;
const OPEN = 128;
const GAP = 5;

/** The roles as a fanned stack of title bands. Pointing at the stack
    straightens it; pointing at a card opens that one. */
export default function RoleFan() {
  const [open, setOpen] = useState<number | null>(null);
  const [inside, setInside] = useState(false);

  // Cards stack downward, so each card's offset depends on the ones above it.
  let y = 0;
  const offsets = roles.map((_, i) => {
    const top = y;
    y += (open === i ? OPEN : BASE) + GAP;
    return top;
  });

  return (
    <div
      className={styles.fan}
      onPointerEnter={() => {
        setInside(true);
        setOpen(0);
      }}
      onPointerLeave={() => {
        setInside(false);
        setOpen(null);
      }}
    >
      {roles.map(([name, note], i) => {
        const last = i === roles.length - 1;
        return (
          <div
            key={name}
            className={last ? styles.cardDark : styles.card}
            onPointerEnter={() => setOpen(i)}
            style={{
              zIndex: 10 + i,
              height: open === i ? OPEN : BASE,
              transform: `rotate(${inside ? 0 : -2.2 + i * 1.1}deg) translateY(${offsets[i]}px)`,
              boxShadow:
                open === i
                  ? "0 18px 40px rgba(25,21,16,0.12)"
                  : "0 8px 20px rgba(25,21,16,0.06)",
            }}
          >
            <div className={styles.head}>
              <div className={last ? styles.dotAccent : styles.dot} />
              <div className={styles.name}>{name}</div>
            </div>
            <div className={last ? styles.noteDark : styles.note}>{note}</div>
          </div>
        );
      })}
    </div>
  );
}
