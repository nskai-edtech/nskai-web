"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { questions, tokenize, type Token } from "./questions";
import styles from "./AnswerStage.module.css";

type Phase = {
  qi: number;
  typed: number;
  srcOn: number;
  tok: number;
  cited: number[];
  elapsed: string;
  running: boolean;
};

const INITIAL: Phase = {
  qi: 0,
  typed: 0,
  srcOn: 0,
  tok: 0,
  cited: [],
  elapsed: "—",
  running: false,
};

/** Rudani's set piece: the query types, sources stream in, the answer is written
    a token at a time, and each citation marker draws a thread to its source. */
export default function AnswerStage() {
  const [s, setS] = useState<Phase>(INITIAL);
  const gridRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  /** Every pending timer and interval, so a new run can cancel the last one. */
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const loops = useRef<ReturnType<typeof setInterval>[]>([]);
  const runId = useRef(0);
  /** Held so the buttons can restart the sequence after mount. */
  const runRef = useRef<(i: number) => void>(() => {});

  const tokens = useMemo<Token[][]>(
    () => questions.map((q) => tokenize(q.answer)),
    [],
  );

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      loops.current.forEach(clearInterval);
      loops.current = [];
    };
    const later = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    const thread = (mk: string, n: number) => {
      const ov = overlayRef.current;
      const grid = gridRef.current;
      if (!ov || !grid) return;
      const marker = grid.querySelector(`[data-marker="${mk}"]`);
      const card = grid.querySelector(`[data-src="${n}"]`);
      if (!marker || !card) return;
      const g = grid.getBoundingClientRect();
      const m = marker.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const x1 = m.right - g.left + 2;
      const y1 = m.top - g.top + m.height / 2;
      const x2 = c.left - g.left - 2;
      const y2 = c.top - g.top + c.height / 2;
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute(
        "d",
        `M ${x1} ${y1} C ${x1 + 90} ${y1}, ${x2 - 90} ${y2}, ${x2} ${y2}`,
      );
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", "rgba(242,242,240,0.32)");
      p.setAttribute("stroke-width", "1");
      const len = Math.hypot(x2 - x1, y2 - y1) * 1.6;
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
      if (!reduced) {
        p.style.transition = "stroke-dashoffset 620ms cubic-bezier(0.25,0.8,0.3,1)";
      }
      ov.appendChild(p);
      later(() => {
        p.style.strokeDashoffset = "0";
      }, 30);
    };

    const run = (i: number) => {
      clearAll();
      const id = ++runId.current;
      const ov = overlayRef.current;
      if (ov) ov.innerHTML = "";
      const q = questions[i];
      const toks = tokens[i];

      if (reduced) {
        // No typing or threads: show the finished answer.
        setS({
          qi: i,
          typed: q.query.length,
          srcOn: q.sources.length,
          tok: toks.length,
          cited: q.sources.map((src) => src.n),
          elapsed: "1.9s",
          running: false,
        });
        return;
      }

      setS({ ...INITIAL, qi: i, running: true });
      const t0 = Date.now();

      const type = setInterval(() => {
        if (runId.current !== id) return;
        setS((prev) => {
          if (prev.typed >= q.query.length) {
            clearInterval(type);
            later(() => retrieve(i, id, t0), 300);
            return prev;
          }
          return { ...prev, typed: prev.typed + 1 };
        });
      }, 20);
      loops.current.push(type);
    };

    const retrieve = (i: number, id: number, t0: number) => {
      const q = questions[i];
      const pull = setInterval(() => {
        if (runId.current !== id) return;
        setS((prev) => {
          if (prev.srcOn >= q.sources.length) {
            clearInterval(pull);
            later(() => write(i, id, t0), 260);
            return prev;
          }
          return { ...prev, srcOn: prev.srcOn + 1 };
        });
      }, 130);
      loops.current.push(pull);
    };

    const write = (i: number, id: number, t0: number) => {
      const toks = tokens[i];
      const step = (k: number) => {
        if (runId.current !== id) return;
        if (k >= toks.length) {
          setS((prev) => ({
            ...prev,
            running: false,
            elapsed: `${((Date.now() - t0) / 1000).toFixed(1)}s`,
          }));
          return;
        }
        const t = toks[k];
        setS((prev) => ({
          ...prev,
          tok: k + 1,
          cited:
            t.src && prev.cited.indexOf(t.src) === -1
              ? prev.cited.concat([t.src])
              : prev.cited,
        }));
        // The thread is drawn once the marker has actually rendered.
        if (t.src) later(() => thread(`${k}-${t.src}`, t.src!), 60);
        later(() => step(k + 1), t.src ? 170 : 26);
      };
      step(0);
    };

    runRef.current = run;
    later(() => run(0), 600);

    return clearAll;
  }, [tokens]);

  const q = questions[s.qi];
  const toks = tokens[s.qi];

  return (
    <>
      <div className={styles.picker}>
        {questions.map((item, i) => (
          <button
            key={item.label}
            type="button"
            className={i === s.qi ? styles.pickOn : styles.pick}
            onClick={() => runRef.current(i)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div ref={gridRef} className={styles.grid}>
        <svg ref={overlayRef} aria-hidden="true" className={styles.overlay} />

        <div className={styles.answerCard}>
          <div className={styles.queryRow}>
            <div className={styles.queryLabel}>Query</div>
            <div className={styles.query}>
              {q.query.slice(0, s.typed)}
              <span
                className={styles.caret}
                style={{ opacity: s.running ? 1 : 0.25 }}
              />
            </div>
          </div>

          <div className={styles.answer}>
            {toks.map((t, k) =>
              t.src ? (
                <span
                  key={k}
                  data-marker={`${k}-${t.src}`}
                  className={styles.marker}
                  style={{ opacity: k < s.tok ? 1 : 0 }}
                >
                  {t.w}
                </span>
              ) : (
                <span key={k} style={{ opacity: k < s.tok ? 1 : 0.1 }}>
                  {t.w}
                </span>
              ),
            )}
          </div>

          <div className={styles.stats}>
            <div>
              Sources cited <span className={styles.stat}>{s.cited.length}</span>
            </div>
            <div>
              Assembled in <span className={styles.stat}>{s.elapsed}</span>
            </div>
            <div>
              Claims without a source <span className={styles.stat}>0</span>
            </div>
          </div>
        </div>

        <div className={styles.sources}>
          <div className={styles.sourcesLabel}>Retrieved</div>
          {q.sources.map((src, i) => {
            const on = i < s.srcOn;
            const cited = s.cited.indexOf(src.n) > -1;
            return (
              <div
                key={src.n}
                data-src={src.n}
                className={cited ? styles.sourceCited : styles.source}
                style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 10}px)` }}
              >
                <div className={styles.sourceHead}>
                  <div className={styles.sourceDomain}>{src.domain}</div>
                  <div className={styles.sourceState}>
                    {cited ? "cited" : on ? "read" : ""}
                  </div>
                </div>
                <div className={styles.sourceTitle}>{src.title}</div>
                <div className={styles.sourceNum}>0{src.n}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
