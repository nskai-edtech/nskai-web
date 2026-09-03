"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./ProductRail.module.css";

export type RailItem = {
  /** Fragment id of the product block this tile marks. */
  href: string;
  accent: string;
  icon: ReactNode;
};

/** A fixed rail beside the product blocks: visible only while you are inside
    that region, and lit on the block nearest the middle of the viewport. */
export default function ProductRail({ items }: { items: RailItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;
    const tiles = [...rail.querySelectorAll<HTMLElement>("[data-rail-tile]")];
    const targets = items.map((i) => document.querySelector(i.href));
    if (targets.some((t) => !t)) return;

    const tick = () => {
      const first = targets[0]!.getBoundingClientRect();
      const last = targets[targets.length - 1]!.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      const inRegion = first.top < mid + 80 && last.bottom > mid - 80;
      rail.style.opacity = inRegion ? "1" : "0";
      if (!inRegion) return;

      let active = 0;
      let bestDist = Infinity;
      targets.forEach((t, i) => {
        const r = t!.getBoundingClientRect();
        const d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (r.top < mid && r.bottom > mid) {
          active = i;
          bestDist = -1;
        } else if (bestDist >= 0 && d < bestDist) {
          bestDist = d;
          active = i;
        }
      });
      tiles.forEach((tile, i) => tile.classList.toggle(styles.on, i === active));
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        tick();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      // A frame queued by the last scroll would otherwise run against
      // detached tiles after the rail unmounts.
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <div ref={ref} className={styles.rail} aria-hidden="true">
      {items.map((item) => (
        <div key={item.href} className={styles.item}>
          <div
            data-rail-tile=""
            className={styles.tile}
            style={
              {
                "--rail-accent": item.accent,
                // #FFD60A is the one accent that needs dark ink on it.
                "--rail-accent-ink": item.accent === "#FFD60A" ? "#16100F" : "#F6F1EF",
              } as CSSProperties
            }
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
