"use client";

import { useEffect, useRef } from "react";
import { seeded, shade } from "./scale";
import styles from "./ZerraStage.module.css";

const N = 300;
const STAGE_H = 768;
const HEADER_H = 72;

type Point = { x: number; y: number; v: number; cell?: number };

export const captions = [
  {
    eyebrow: "01  Ability",
    title: "A person is a point, not a level.",
    body: "Every skill in your organisation is an axis. Zerra starts by placing the learner on it, from the work they already do.",
  },
  {
    eyebrow: "02  Estimate",
    title: "Each answer narrows the guess.",
    body: "Items are picked where the answer carries the most information. The band around the estimate tightens as the evidence arrives.",
  },
  {
    eyebrow: "03  Route",
    title: "The path re-plans as they move.",
    body: "Prerequisites hold the graph together. Zerra walks the shortest route through it that still clears your standard.",
  },
  {
    eyebrow: "04  Evidence",
    title: "Mastery you can audit, per person.",
    body: "One cell per learner per skill, with the items behind it. This is the same view your in-house assessments write into.",
  },
];

/** Zerra's one motion set piece: the same 300 points laid out four ways —
    ability lattice, tightening estimate, skill graph, mastery matrix — morphing
    between layouts as you scroll the tall wrapper past the sticky canvas. */
export default function ZerraStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capsRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = canvasRef.current;
    if (!wrap || !cv) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let sets: Point[][] | null = null;
    let nodes: { x: number; y: number; layer: number }[] = [];
    let dims = { w: 0, h: 0, pad: 120, W: 0, H: 0 };
    let p = 0;
    let pTarget = 0;

    const buildSets = (w: number, h: number) => {
      const rnd = seeded(7);
      const pad = 120;
      const W = w - pad * 2;
      const H = h - pad * 2;
      const A: Point[] = [];
      const B: Point[] = [];
      const C: Point[] = [];
      const D: Point[] = [];
      const cols = 25;
      const rows = Math.ceil(N / cols);
      for (let i = 0; i < N; i++) {
        const cx = i % cols;
        const cy = Math.floor(i / cols);

        // A: lattice, weighted by the logistic curve running through it.
        const ax = pad + (cx / (cols - 1)) * W;
        const ay = pad + (cy / (rows - 1)) * H;
        const theta = (cx / (cols - 1)) * 6 - 3;
        const sig = 1 / (1 + Math.exp(-theta * 1.6));
        const curveY = pad + (1 - sig) * H;
        A.push({ x: ax, y: ay, v: Math.max(0, 1 - Math.abs(ay - curveY) / (H * 0.22)) });

        // B: the estimate trajectory, a tightening band around the same curve.
        const t = i / (N - 1);
        const band = (1 - t) * H * 0.42 + 8;
        const bs = 1 / (1 + Math.exp(-(t * 6 - 3) * 1.3));
        B.push({
          x: pad + t * W,
          y: pad + (1 - bs) * H + (rnd() - 0.5) * 2 * band,
          v: 0.25 + 0.75 * t,
        });

        // C: skill graph, points clustered on 14 nodes.
        const ni = i % 14;
        const layer = Math.floor(ni / 3);
        const nx = pad + 40 + (layer / 4) * (W - 80);
        const ny = pad + ((ni % 3) + 0.5 + (layer % 2) * 0.22) * (H / 3.4);
        const ang = rnd() * Math.PI * 2;
        const rad = 6 + rnd() * 26;
        C.push({
          x: nx + Math.cos(ang) * rad,
          y: ny + Math.sin(ang) * rad,
          v: 0.3 + 0.7 * (layer / 4),
        });

        // D: mastery matrix, held clear of the caption column on the left.
        const mc = 20;
        const mr = Math.ceil(N / mc);
        const mLeft = pad + 500;
        const mRight = w - pad;
        const mTop = pad + 40;
        const mBot = h - 130;
        const cell = Math.min((mRight - mLeft) / mc, (mBot - mTop) / mr);
        const ox = mLeft + (mRight - mLeft - cell * mc) / 2;
        const oy = mTop + (mBot - mTop - cell * mr) / 2;
        D.push({
          x: ox + (i % mc) * cell + cell / 2,
          y: oy + Math.floor(i / mc) * cell + cell / 2,
          v: rnd(),
          cell,
        });
      }

      nodes = [];
      for (let ni = 0; ni < 14; ni++) {
        const layer = Math.floor(ni / 3);
        nodes.push({
          x: pad + 40 + (layer / 4) * (W - 80),
          y: pad + ((ni % 3) + 0.5 + (layer % 2) * 0.22) * (H / 3.4),
          layer,
        });
      }
      sets = [A, B, C, D];
      dims = { w, h, pad, W, H };
    };

    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const draw = (time: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      const ctx = cv.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = r.width;
      const h = r.height;
      if (!sets || dims.w !== w || dims.h !== h) buildSets(w, h);
      if (!sets) return;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0B2A6B";
      ctx.fillRect(0, 0, w, h);

      const pc = Math.min(2.999, Math.max(0, p));
      const i0 = Math.floor(pc);
      const i1 = Math.min(3, i0 + 1);
      const f = ease(pc - i0);
      const S0 = sets[i0];
      const S1 = sets[i1];
      const { pad, W, H } = dims;

      // Stage 1: the logistic curve itself.
      const curveA =
        Math.max(0, 1 - Math.abs(pc - 0) / 1.2) * 0.9 +
        Math.max(0, 1 - Math.abs(pc - 1) / 1.2) * 0.9;
      if (curveA > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, curveA);
        ctx.strokeStyle = "rgba(246,241,239,0.55)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let s = 0; s <= 120; s++) {
          const t = s / 120;
          const y =
            pad +
            (1 - 1 / (1 + Math.exp(-((t * 6 - 3) * (pc < 1 ? 1.6 : 1.3))))) * H;
          const x = pad + t * W;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Stage 3: prerequisite edges between graph nodes.
      const edgeA = Math.max(0, 1 - Math.abs(pc - 2) / 0.9);
      if (edgeA > 0.01) {
        ctx.save();
        ctx.globalAlpha = edgeA * 0.7;
        ctx.strokeStyle = "rgba(201,214,242,0.6)";
        ctx.lineWidth = 1;
        nodes.forEach((n, i) => {
          nodes.forEach((m, j) => {
            if (m.layer !== n.layer + 1) return;
            if ((i * 7 + j * 3) % 3 === 0) return;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            const mx = (n.x + m.x) / 2;
            ctx.bezierCurveTo(mx, n.y, mx, m.y, m.x, m.y);
            ctx.stroke();
          });
        });
        // The chosen route, brighter.
        ctx.globalAlpha = edgeA;
        ctx.strokeStyle = "#F6F1EF";
        ctx.lineWidth = 1.6;
        const route = [1, 4, 8, 10, 13];
        ctx.beginPath();
        route.forEach((ri, k) => {
          const n = nodes[ri];
          if (k === 0) ctx.moveTo(n.x, n.y);
          else {
            const prev = nodes[route[k - 1]];
            const mx = (prev.x + n.x) / 2;
            ctx.bezierCurveTo(mx, prev.y, mx, n.y, n.x, n.y);
          }
        });
        ctx.stroke();
        ctx.restore();
      }

      // The points.
      const drift = reduced ? 0 : time / 1000;
      for (let i = 0; i < N; i++) {
        const a = S0[i];
        const b = S1[i];
        const x = a.x + (b.x - a.x) * f;
        const y = a.y + (b.y - a.y) * f;
        const v = a.v + (b.v - a.v) * f;
        const wob = Math.sin(drift * 0.9 + i * 0.7) * (pc < 0.6 ? 1.6 : 0.6);
        const matrix = Math.max(0, pc - 2);
        const cell = (b.cell || 22) * 0.62;
        const size = 3.2 + (cell - 3.2) * matrix;
        ctx.fillStyle = shade(v);
        ctx.globalAlpha = 0.55 + 0.45 * v;
        ctx.fillRect(x - size / 2, y - size / 2 + wob, size, size);
      }
      ctx.globalAlpha = 1;

      // Stage 2: the confidence band collapsing.
      const bandA = Math.max(0, 1 - Math.abs(pc - 1) / 0.85);
      if (bandA > 0.01) {
        ctx.save();
        ctx.globalAlpha = bandA * 0.5;
        ctx.strokeStyle = "rgba(126,155,224,0.9)";
        ctx.setLineDash([3, 5]);
        [-1, 1].forEach((sgn) => {
          ctx.beginPath();
          for (let s = 0; s <= 100; s++) {
            const t = s / 100;
            const band = (1 - t) * H * 0.42 + 8;
            const y =
              pad +
              (1 - 1 / (1 + Math.exp(-(t * 6 - 3) * 1.3))) * H +
              sgn * band;
            const x = pad + t * W;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
        ctx.restore();
      }
    };

    const syncCaptions = () => {
      const caps = capsRef.current?.children;
      if (caps) {
        for (let i = 0; i < caps.length; i++) {
          const el = caps[i] as HTMLElement;
          const o = Math.max(0, 1 - Math.abs(p - i) / 0.55);
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(p - i) * 16}px)`;
          el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        }
      }
      const dots = dotsRef.current?.children;
      if (dots) {
        for (let i = 0; i < dots.length; i++) {
          (dots[i] as HTMLElement).style.background =
            Math.round(p) === i ? "#F6F1EF" : "rgba(246,241,239,0.28)";
        }
      }
    };

    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const span = r.height - STAGE_H - HEADER_H;
      const t = span > 0 ? (-r.top + HEADER_H) / span : 0;
      pTarget = Math.min(3, Math.max(0, t * 3.15 - 0.07));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let raf = 0;
    let t0: number | null = null;
    const loop = (ts: number) => {
      if (t0 === null) t0 = ts;
      p += (pTarget - p) * 0.12;
      draw(ts - t0);
      syncCaptions();
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
        <canvas ref={canvasRef} aria-hidden="true" className={styles.canvas} />

        <div ref={capsRef} className={styles.captions}>
          {captions.map((cap, i) => (
            <div
              key={cap.eyebrow}
              className={styles.caption}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <div className={styles.capEyebrow}>{cap.eyebrow}</div>
              <h2 className={styles.capTitle}>{cap.title}</h2>
              <p className={styles.capBody}>{cap.body}</p>
            </div>
          ))}
        </div>

        <div className={styles.formula}>
          <div className={styles.formulaRule} />
          <div>P(correct) = &sigma;(&theta; &minus; b)</div>
        </div>

        <div ref={dotsRef} className={styles.dots}>
          {captions.map((cap, i) => (
            <div
              key={cap.eyebrow}
              className={styles.dot}
              style={{
                background: i === 0 ? "#F6F1EF" : "rgba(246,241,239,0.28)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
