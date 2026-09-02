"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ReachSwarm.module.css";

const COLS = 29;
const ROWS = 10;
const TOTAL = COLS * ROWS;

type Dot = { x: number; y: number; ox: number; oy: number; size: number; colour: string; delay: number };

/** One mark per institution, dispersing outward from the single campus Udara
    started on. Boustrophedon ranking puts the biggest campuses at the origin. */
function build(w: number, h: number): Dot[] {
  const padX = 34;
  const padY = 30;
  const stepX = (w - padX * 2) / (COLS - 1);
  const stepY = (h - padY * 2) / (ROWS - 1);
  const originX = padX + stepX * 6;
  const originY = padY + stepY * 4;

  const dots: Omit<Dot, "delay">[] = [];
  let maxD = 1;
  for (let i = 0; i < TOTAL; i++) {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    const x = padX + c * stepX;
    const y = padY + r * stepY;
    // Alternate rows run backwards, so rank spirals out rather than banding.
    const rank = r * COLS + (r % 2 ? COLS - 1 - c : c);
    let colour = "#DEC98F";
    let size = 7;
    if (rank < 23) {
      colour = "#1A1408";
      size = 11;
    } else if (rank < 85) {
      colour = "#C79A0B";
      size = 9;
    }
    const ox = originX - x;
    const oy = originY - y;
    maxD = Math.max(maxD, Math.hypot(ox, oy));
    dots.push({ x, y, ox, oy, size, colour });
  }

  // The further a mark travels, the later it sets off.
  return dots.map((dot) => ({
    ...dot,
    delay: 120 + (Math.hypot(dot.ox, dot.oy) / maxD) * 1100,
  }));
}

export default function ReachSwarm() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);
  const [dispersed, setDispersed] = useState(false);
  const played = useRef(false);

  const measure = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    setDots(build(host.clientWidth || 900, host.clientHeight || 300));
  }, []);

  useEffect(() => {
    measure();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(measure, 180);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  // Plays once, when the figure first comes into view.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDispersed(true);
      played.current = true;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played.current) return;
          played.current = true;
          setDispersed(true);
          io.disconnect();
        });
      },
      { threshold: 0.15 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  const replay = () => {
    setDispersed(false);
    setTimeout(() => setDispersed(true), 60);
  };

  return (
    <>
      <div ref={hostRef} className={styles.field} aria-hidden="true">
        {dots.map((dot, i) => (
          <div
            key={i}
            className={styles.dot}
            style={{
              width: dot.size,
              height: dot.size,
              left: dot.x - dot.size / 2,
              top: dot.y - dot.size / 2,
              background: dot.colour,
              opacity: dispersed ? 1 : 0,
              transform: dispersed
                ? "translate(0,0) scale(1)"
                : `translate(${dot.ox}px, ${dot.oy}px) scale(0.4)`,
              transition: dispersed
                ? `transform 900ms cubic-bezier(0.16,0.9,0.24,1) ${dot.delay}ms, opacity 500ms ease ${dot.delay}ms`
                : "none",
            }}
          />
        ))}
      </div>

      <div className={styles.legend}>
        <div className={styles.key}>
          <span className={styles.swatchDeep} />
          100+ accounts (23)
        </div>
        <div className={styles.key}>
          <span className={styles.swatchMid} />
          20+ accounts (85)
        </div>
        <div className={styles.key}>
          <span className={styles.swatchPale} />
          5+ accounts (290)
        </div>
        <button type="button" className={styles.replay} onClick={replay}>
          Replay
        </button>
      </div>
    </>
  );
}
