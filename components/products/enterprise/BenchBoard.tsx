"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./BenchBoard.module.css";

const STAGE_H = 790;
const HEADER_H = 72;
const COLS = 6;
const ROWS = 5;
const CELL = 78;
const GAP = 8;
const OX = 200;
const OY = 60;
/** Cells that are gaps, and the seats the engineers take — the same list. */
const SEATS = [7, 10, 15, 20, 23, 26];
const BENCH_X = 30;
const BENCH_Y = 60;
const BENCH_STEP = 74;
const ROLES = ["RES", "PLT", "DAT", "ML", "SRE", "DEL", "—", "—"];

const phases = [
  {
    name: "Assess",
    body: "Two weeks inside the work. We map what your teams already own, what is missing, and which single problem is worth the first build.",
    trace: "30 cells mapped · 6 gaps named",
    read: "gaps found = owned − needed",
  },
  {
    name: "Assemble",
    body: "A team picked for the gaps, not for the invoice. Research, platform, data and delivery, at the seniority the problem actually needs.",
    trace: "6 engineers named · 2 held in reserve",
    read: "team = argmin(gap) over people",
  },
  {
    name: "Embed",
    body: "They join your standups, your repositories and your on-call. No parallel project, no separate roadmap, no translation layer.",
    trace: "seats taken inside your team, not beside it",
    read: "seats inside the team: 6",
  },
  {
    name: "Build",
    body: "Shipped in fortnights, against your data and your constraints. Pairing is the transfer mechanism, and it is deliberate.",
    trace: "in production · owned jointly · reviewed by both",
    read: "shipped every fortnight, paired",
  },
  {
    name: "Hand over",
    body: "We leave. What stays is running software, the runbooks behind it, and your engineers holding the pager by choice.",
    trace: "0 seats retained · capability stays behind",
    read: "capability transferred = build × pairing",
  },
];

const cellPos = (i: number) => ({
  x: OX + (i % COLS) * (CELL + GAP),
  y: OY + Math.floor(i / COLS) * (CELL + GAP),
});

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Enterprise AI's set piece: engineers leave the bench, take seats in the gaps
    on your team's board, work there, and walk back off — driven by scroll. */
export default function BenchBoard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const capsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const board = boardRef.current;
    if (!wrap || !board) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const cells = [...board.querySelectorAll<HTMLElement>("[data-cell]")];
    const engineers = [...board.querySelectorAll<HTMLElement>("[data-eng]")];

    let p = 0;
    let pTarget = 0;

    const paint = () => {
      // Phases overlap deliberately: selection, travel, work, withdrawal.
      const select = ease(clamp01(p - 0.6));
      const travel = ease(clamp01(p - 1.55));
      const work = clamp01(p - 2.6);
      const leave = ease(clamp01(p - 3.55));

      engineers.forEach((el, i) => {
        const embedded = i < 6;
        const bx = BENCH_X + (embedded ? select * 14 : 0);
        const by = BENCH_Y + i * BENCH_STEP;
        let x = bx;
        let y = by;
        if (embedded) {
          const seat = cellPos(SEATS[i]);
          const tt = ease(clamp01(travel * 1.2 - i * 0.05));
          // A small arc, so they travel rather than slide.
          const arc = Math.sin(tt * Math.PI) * -34;
          x = lerp(bx, seat.x + 9, tt);
          y = lerp(by, seat.y + 9, tt) + arc;
          if (leave > 0) {
            const out = ease(clamp01(leave * 1.15 - i * 0.04));
            x = lerp(x, BENCH_X - 190, out);
            y = lerp(y, by, out * 0.6);
            el.style.opacity = String(1 - out * 0.9);
          } else {
            el.style.opacity = "1";
          }
          if (work > 0 && leave < 0.2 && !reduced) {
            y += Math.sin(Date.now() / 520 + i) * 1.6;
          }
        } else {
          el.style.opacity = String(0.32 + 0.2 * select);
        }
        el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      });

      cells.forEach((el, i) => {
        const seatIdx = SEATS.indexOf(i);
        const found = clamp01(p * 2.2);
        if (seatIdx >= 0) {
          const filled = clamp01(work * 1.4 - seatIdx * 0.06);
          el.style.borderColor =
            leave > 0.5
              ? "#E8A317"
              : `rgba(232,163,23,${(0.25 + 0.75 * found).toFixed(2)})`;
          el.style.background =
            leave > 0.5
              ? "rgba(232,163,23,0.26)"
              : filled > 0
                ? `rgba(232,163,23,${(0.1 + 0.16 * filled).toFixed(3)})`
                : "transparent";
        } else {
          el.style.borderColor = "#3A342A";
          el.style.background = p > 2.8 ? "rgba(247,242,234,0.03)" : "transparent";
        }
      });

      const caps = capsRef.current?.children;
      if (caps) {
        for (let k = 0; k < caps.length; k++) {
          const el = caps[k] as HTMLElement;
          const d = p - k;
          const o = Math.max(0, 1 - Math.abs(d) / 0.62);
          el.style.opacity = String(o * o);
          el.style.transform = `translateY(${(d * 22).toFixed(1)}px)`;
          el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        }
      }
      setPhase(Math.max(0, Math.min(4, Math.round(p))));
    };

    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const span = r.height - STAGE_H - HEADER_H;
      const t = span > 0 ? clamp01((-r.top + HEADER_H) / span) : 0;
      pTarget = t * 4;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let raf = 0;
    const loop = () => {
      p += (pTarget - p) * (reduced ? 1 : 0.085);
      paint();
      raf = requestAnimationFrame(loop);
    };
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
        <div className={styles.row}>
          <div className={styles.copy}>
            <div className={styles.phaseRow}>
              <div className={styles.phase}>PHASE 0{phase + 1} / 05</div>
              <div className={styles.ticks}>
                {phases.map((ph, i) => (
                  <div
                    key={ph.name}
                    className={styles.tick}
                    style={{
                      background:
                        i <= phase ? "#E8A317" : "rgba(247,242,234,0.25)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div ref={capsRef} className={styles.captions}>
              {phases.map((ph, i) => (
                <div
                  key={ph.name}
                  className={styles.caption}
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <h2 className={styles.capTitle}>{ph.name}</h2>
                  <p className={styles.capBody}>{ph.body}</p>
                  <div className={styles.capTrace}>{ph.trace}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.boardCol}>
            <div ref={boardRef} className={styles.board}>
              {Array.from({ length: COLS * ROWS }, (_, i) => {
                const pos = cellPos(i);
                return (
                  <div
                    key={i}
                    data-cell=""
                    className={styles.cell}
                    style={{ left: pos.x, top: pos.y }}
                  />
                );
              })}
              {ROLES.map((role, i) => (
                <div
                  key={`${role}-${i}`}
                  data-eng=""
                  className={styles.engineer}
                  style={
                    i < 6
                      ? { background: "#E8A317", color: "#191510" }
                      : { background: "#5A4E33", color: "#B8A98A" }
                  }
                >
                  {role}
                </div>
              ))}
            </div>
            <div className={styles.benchLabel}>BENCH</div>
            <div className={styles.teamLabel}>YOUR TEAM</div>
          </div>
        </div>

        <div className={styles.readout}>
          <div className={styles.readoutRule} />
          <div>{phases[phase].read}</div>
        </div>
      </div>
    </div>
  );
}
