"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ResolveStage.module.css";

const STAGE_H = 768;
const HEADER_H = 72;

const captions = [
  {
    eyebrow: "Pass 00 — raw",
    title: "Unlabelled",
    body: "A batch arrives as items with no structure: transactions, calls, notes, photographs. Nothing here is wrong yet, and nothing here can train anything.",
  },
  {
    eyebrow: "Pass 01–03 — independent",
    title: "Three passes",
    body: "Every item is labelled three times, by specialists who cannot see each other’s work. A coarse shape appears. Most of the batch settles immediately.",
  },
  {
    eyebrow: "Contested",
    title: "Disagreement",
    body: "The items that split the passes are not noise. They sit on the boundary between classes, which is precisely where a model in production gets things wrong.",
  },
  {
    eyebrow: "Ruled",
    title: "Adjudicated",
    body: "A named specialist rules on each contested item and the spec is amended underneath it. The boundary stops moving, and it stays where it is for the rest of the batch.",
  },
];

/** Deterministic value noise, so the same cells contest on every load. */
const hash = (n: number) => {
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
};

/** Data Annotation's set piece: the batch resolving as you scroll — coarse
    unlabelled blocks, three passes, the contested boundary flickering, then a
    settled ruling. Block size shrinks 32px → 6px across the scrub. */
export default function ResolveStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capsRef = useRef<HTMLDivElement>(null);
  const [readout, setReadout] = useState("κ 0.00 · block 32 px · contested —");
  const [dot, setDot] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = canvasRef.current;
    if (!wrap || !cv) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let p = 0;
    let pTarget = 0;

    const paint = (time: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = cv.clientWidth || 1440;
      const h = cv.clientHeight || STAGE_H;
      if (cv.width !== Math.round(w * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      const ctx = cv.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // The field sits right of the caption column.
      const x0 = 604;
      const y0 = 96;
      const x1 = w - 100;
      const y1 = h - 116;
      const fw = x1 - x0;
      const fh = y1 - y0;
      const seeds: [number, number, number][] = [
        [0.22, 0.24, 0],
        [0.72, 0.16, 1],
        [0.44, 0.7, 2],
        [0.9, 0.6, 1],
        [0.1, 0.82, 2],
      ];
      const cols = ["#0E7C66", "#8FCBBB", "#3E9C86"];
      const bs = Math.max(
        6,
        Math.round((32 * Math.pow(0.56, Math.min(3, Math.max(0, p)))) / 2) * 2,
      );
      const reveal = Math.min(1, Math.max(0, p));
      const settle = Math.min(1, Math.max(0, p - 2));
      // The contested margin closes as the ruling settles.
      const margin = 0.17 * (1 - settle);
      const flags =
        Math.min(1, Math.max(0, (p - 1.3) / 0.5)) *
        (1 - Math.min(1, Math.max(0, (p - 2.55) / 0.45)));
      let contested = 0;

      for (let y = y0; y < y1; y += bs) {
        for (let x = x0; x < x1; x += bs) {
          const nx = (x - x0 + bs / 2) / fw;
          const ny = (y - y0 + bs / 2) / fh;
          let d1 = 1e9;
          let d2 = 1e9;
          let c1 = 0;
          let c2 = 0;
          for (let i = 0; i < seeds.length; i++) {
            const dx = nx - seeds[i][0];
            const dy = (ny - seeds[i][1]) * 0.86;
            const d = dx * dx + dy * dy;
            if (d < d1) {
              d2 = d1;
              c2 = c1;
              d1 = d;
              c1 = seeds[i][2];
            } else if (d < d2) {
              d2 = d;
              c2 = seeds[i][2];
            }
          }
          const r = hash(x * 0.137 + y * 0.911);
          const near = (Math.sqrt(d2) - Math.sqrt(d1)) / Math.max(1e-4, Math.sqrt(d2));
          const split = near < margin && c1 !== c2;
          let cls = c1;
          if (split) {
            contested++;
            if (settle < 1) {
              // Contested cells flick between the two candidate labels.
              const flick = Math.sin(time / 240 + r * 11) > 0;
              if (r > 0.45 ? flick : !flick) cls = c2;
            }
          }
          ctx.fillStyle = r < reveal ? cols[cls] : "#17332C";
          ctx.fillRect(x, y, bs - 1, bs - 1);
          if (split && flags > 0.02 && r < reveal) {
            ctx.globalAlpha = flags;
            ctx.strokeStyle = "#EEF2EE";
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, bs - 2, bs - 2);
            ctx.globalAlpha = 1;
          }
        }
      }

      const kappa = p < 0.7 ? 0 : 0.62 + 0.29 * Math.min(1, Math.max(0, (p - 1) / 2));
      setReadout(
        `κ ${kappa.toFixed(2)} · block ${bs} px · contested ${p < 1 ? "—" : contested}`,
      );
    };

    const sync = () => {
      const caps = capsRef.current?.children;
      if (caps) {
        for (let i = 0; i < caps.length; i++) {
          const el = caps[i] as HTMLElement;
          const d = Math.abs(p - i);
          el.style.opacity = String(Math.max(0, 1 - d * 1.7));
          el.style.transform = `translateY(${((p - i) * -20).toFixed(1)}px)`;
        }
      }
      setDot(Math.max(0, Math.min(3, Math.round(p))));
    };

    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const span = r.height - STAGE_H - HEADER_H;
      const t = span > 0 ? Math.min(1, Math.max(0, (-r.top + HEADER_H) / span)) : 0;
      pTarget = t * 3;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let raf = 0;
    const loop = (ts: number) => {
      p += (pTarget - p) * (reduced ? 1 : 0.09);
      const vr = wrap.getBoundingClientRect();
      if (vr.top < window.innerHeight + 200 && vr.bottom > -200) {
        paint(reduced ? 0 : ts);
        sync();
      }
      raf = requestAnimationFrame(loop);
    };
    paint(0);
    sync();
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.sticky}>
        <canvas ref={canvasRef} aria-hidden="true" className={styles.canvas} />

        <div ref={capsRef} className={styles.captions}>
          {captions.map((cap, i) => (
            <div
              key={cap.title}
              className={styles.caption}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <div className={styles.capEyebrow}>{cap.eyebrow}</div>
              <h2 className={styles.capTitle}>{cap.title}</h2>
              <p className={styles.capBody}>{cap.body}</p>
            </div>
          ))}
        </div>

        <div className={styles.readout}>
          <div className={styles.readoutRule} />
          <div>{readout}</div>
        </div>

        <div className={styles.dots}>
          {captions.map((cap, i) => (
            <div
              key={cap.title}
              className={styles.dot}
              style={{
                background: i === dot ? "#EEF2EE" : "rgba(238,242,238,0.28)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
