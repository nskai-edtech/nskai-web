"use client";

import { useEffect, useRef, useState } from "react";
import { faces, inkOn } from "./faces";
import styles from "./LeriDial.module.css";

const STAGE_H = 780;
const HEADER_H = 72;
const CX = 310;
const CY = 310;
const R = 260;

/** A point on the octagon's rim, k counted from the top-left vertex. */
function vertex(k: number) {
  const a = ((-112.5 + 45 * k) * Math.PI) / 180;
  return [CX + Math.cos(a) * R, CY + Math.sin(a) * R] as const;
}

/** Leri's one motion set piece: an eight-face dial under a fixed needle.
    Scrolling the tall wrapper turns the ring one face at a time; the caption,
    the wedge and the readout all follow the same index. */
export default function LeriDial() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGGElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let rot = 0;
    let rotTarget = 0;

    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const span = r.height - STAGE_H - HEADER_H;
      const t = span > 0 ? Math.min(1, Math.max(0, (-r.top + HEADER_H) / span)) : 0;
      const f = t * 7.999;
      rotTarget = -45 * f;
      if (progRef.current) progRef.current.style.width = `${12 + t * 88}%`;
      setActive(Math.round(f));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let raf = 0;
    const loop = () => {
      rot += (rotTarget - rot) * (reduced ? 1 : 0.09);
      if (ringRef.current) {
        ringRef.current.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      }
      if (needleRef.current) {
        // A slow wobble, so the needle reads as live rather than painted on.
        const wob = reduced ? 0 : Math.sin(Date.now() / 900) * 1.2;
        needleRef.current.setAttribute("transform", `rotate(${wob.toFixed(2)} 310 310)`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const face = faces[active];

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.sticky}>
        <div className={styles.row}>
          <div className={styles.copy}>
            <div className={styles.stepRow}>
              <div className={styles.step}>
                FACE 0{active + 1} / 08
              </div>
              <div className={styles.track}>
                <div ref={progRef} className={styles.progress} />
              </div>
            </div>

            <div className={styles.captions}>
              {faces.map((f, i) => (
                <div
                  key={f.name}
                  className={styles.caption}
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform:
                      i === active
                        ? "none"
                        : `translateY(${i < active ? -14 : 14}px)`,
                  }}
                >
                  <h2 className={styles.capTitle}>{f.name}</h2>
                  <p className={styles.capBody}>{f.body}</p>
                  <div className={styles.capTrace}>{f.trace}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.dialCol}>
            <svg viewBox="0 0 620 620" width="620" height="620" fill="none" aria-hidden="true" className={styles.dial}>
              <g ref={ringRef} className={styles.ring}>
                <g>
                  {faces.map((f, i) => {
                    const a = vertex(i);
                    const b = vertex(i + 1);
                    const mid = ((-90 + 45 * i) * Math.PI) / 180;
                    const lx = CX + Math.cos(mid) * (R * 0.78);
                    const ly = CY + Math.sin(mid) * (R * 0.78);
                    return (
                      <g key={f.name}>
                        <polygon
                          points={`${CX},${CY} ${a[0].toFixed(1)},${a[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`}
                          fill={f.tint}
                          stroke="#221309"
                          strokeWidth="1"
                          opacity={i === active ? 1 : 0.3}
                          className={styles.wedge}
                        />
                        {/* The label rides its own wedge round. */}
                        <text
                          x={lx.toFixed(1)}
                          y={ly.toFixed(1)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontFamily="Author, Helvetica, sans-serif"
                          fontSize="13"
                          letterSpacing="2"
                          fill={inkOn(i) === "#F1E9E2" ? "#E6D3BC" : "#40230F"}
                          opacity={i === active ? 1 : 0.45}
                          transform={`rotate(${45 * i} ${lx.toFixed(1)} ${ly.toFixed(1)})`}
                        >
                          {f.name.toUpperCase()}
                        </text>
                      </g>
                    );
                  })}
                </g>
                <polygon
                  points="310,50 494,126 570,310 494,494 310,570 126,494 50,310 126,126"
                  stroke="#6B4423"
                  strokeWidth="1"
                />
              </g>

              <polygon
                points="310,150 423,197 470,310 423,423 310,470 197,423 150,310 197,197"
                stroke="#4A2E1A"
                strokeWidth="1"
                fill="#221309"
              />

              <g ref={needleRef}>
                <line x1="310" y1="120" x2="310" y2="42" stroke="#F1E9E2" strokeWidth="1.5" />
                <polygon points="310,30 318,44 302,44" fill="#F1E9E2" />
              </g>

              <text
                x="310"
                y="300"
                textAnchor="middle"
                fill="#F1E9E2"
                fontFamily="Author, Helvetica, sans-serif"
                fontSize="72"
                fontWeight="500"
              >
                0{active + 1}
              </text>
              <text
                x="310"
                y="336"
                textAnchor="middle"
                fill="#B08355"
                fontFamily="Author, Helvetica, sans-serif"
                fontSize="13"
                letterSpacing="3"
              >
                {face.name.toUpperCase()}
              </text>
            </svg>
          </div>
        </div>

        <div className={styles.formula}>
          <div className={styles.formulaRule} />
          <div>close = act &and; verify &and; log</div>
        </div>
      </div>
    </div>
  );
}
