"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./ProximityField.module.css";

export type FieldCard = {
  accent: string;
  icon: ReactNode;
  title: string;
  body: string;
  note: string;
  index: string;
};

const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Cards that lean toward the cursor: the nearer one takes more of the weight. */
export default function ProximityField({ cards }: { cards: FieldCard[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const els = [...grid.querySelectorAll<HTMLElement>("[data-field]")];

    const apply = (card: HTMLElement, w: number) => {
      const c = card.dataset.accent || "#E01A0D";
      const icon = card.querySelector<HTMLElement>("[data-field-icon]");
      const rule = card.querySelector<HTMLElement>("[data-field-rule]");
      const note = card.querySelector<HTMLElement>("[data-field-note]");
      card.style.transform = `translateY(${(-12 * w).toFixed(2)}px)`;
      card.style.borderColor = w > 0.02 ? rgba(c, 0.25 + 0.75 * w) : "#E7DEDC";
      card.style.boxShadow =
        w > 0.02
          ? `0 ${(10 + 26 * w).toFixed(0)}px ${(24 + 40 * w).toFixed(0)}px ${rgba("#8E1108", 0.12 * w)}`
          : "none";
      if (icon) {
        icon.style.opacity = (0.5 + 0.5 * w).toFixed(2);
        icon.style.transform = `scale(${(1 + 0.16 * w).toFixed(3)}) rotate(${(-4 * w).toFixed(2)}deg)`;
      }
      if (rule) rule.style.width = `${(14 + 58 * w).toFixed(0)}px`;
      if (note) note.style.color = w > 0.5 ? c : "#6A6260";
    };

    const onMove = (e: PointerEvent) => {
      els.forEach((card) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width * 1.5);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height * 1.5);
        const d = Math.sqrt(dx * dx + dy * dy);
        apply(card, Math.max(0, 1 - Math.min(1, d)));
      });
    };
    const onLeave = () => els.forEach((card) => apply(card, 0));

    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);
    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={gridRef} className={styles.grid}>
      {cards.map((card) => (
        <div
          key={card.title}
          data-field=""
          data-accent={card.accent}
          className={styles.card}
        >
          <div
            data-field-icon=""
            className={styles.icon}
            style={{ color: card.accent }}
          >
            {card.icon}
          </div>
          <div className={styles.title}>{card.title}</div>
          <div
            data-field-rule=""
            className={styles.rule}
            style={{ background: card.accent }}
          />
          <p className={styles.body}>{card.body}</p>
          <div className={styles.foot}>
            <div data-field-note="" className={styles.note}>
              {card.note}
            </div>
            <div className={styles.index}>{card.index}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
