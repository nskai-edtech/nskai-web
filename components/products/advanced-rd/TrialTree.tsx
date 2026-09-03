"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TrialTree.module.css";

type Verdict = "carried" | "closed" | "open" | "published";

type Node = {
  id: string;
  gen: number;
  y: number;
  p?: string;
  label: string;
  metric: string;
  verdict: Verdict;
};

/** One programme, five generations deep. Most branches close. */
const DATA: Node[] = [
  { id: "r", gen: 0, y: 229, label: "Baseline 7B, fp16", metric: "WER 14.2%", verdict: "carried" },
  { id: "a", gen: 1, y: 40, p: "r", label: "4-bit, per-channel scale", metric: "WER 14.6%", verdict: "carried" },
  { id: "b", gen: 1, y: 229, p: "r", label: "4-bit, per-tensor scale", metric: "WER 19.1%", verdict: "closed" },
  { id: "c", gen: 1, y: 418, p: "r", label: "8-bit KV cache", metric: "WER 14.3%", verdict: "carried" },
  { id: "d", gen: 2, y: 26, p: "a", label: "plus domain distillation", metric: "WER 13.4%", verdict: "carried" },
  { id: "e", gen: 2, y: 156, p: "a", label: "plus layer skip, 25%", metric: "WER 22.8%", verdict: "closed" },
  { id: "f", gen: 2, y: 300, p: "c", label: "plus speculative decode", metric: "WER 14.3%", verdict: "open" },
  { id: "g", gen: 2, y: 430, p: "c", label: "plus prompt cache", metric: "WER 14.1%", verdict: "carried" },
  { id: "h", gen: 3, y: 95, p: "d", label: "40h in-domain speech", metric: "WER 11.9%", verdict: "carried" },
  { id: "i", gen: 3, y: 229, p: "d", label: "synthetic audio only", metric: "WER 18.4%", verdict: "closed" },
  { id: "j", gen: 3, y: 363, p: "g", label: "cache and 4-bit merged", metric: "WER 13.8%", verdict: "open" },
  { id: "k", gen: 4, y: 229, p: "h", label: "3.2x throughput on device", metric: "WER 11.9%", verdict: "published" },
];

const FINDINGS = [
  "Baseline measured on your corpus. Nothing decided yet.",
  "Per-tensor quantization moves the error. Per-channel does not.",
  "Layer skipping fails at this scale. Speculative decoding needs a rerun.",
  "The gain comes from in-domain data, not from synthetic augmentation.",
  "A 4-bit model at 11.9% WER and 3.2x throughput. Method published, closed branches reported with it.",
];

const COL_W = 192;
const NODE_W = 168;

/** Class per verdict; "pending" is a branch that has opened but not settled. */
const CLASS: Record<Verdict | "pending", string> = {
  pending: styles.pending,
  closed: styles.closed,
  open: styles.open,
  published: styles.published,
  carried: styles.carried,
};

const TAG: Record<Verdict | "pending", string> = {
  pending: "running",
  closed: "closed",
  open: "rerun",
  published: "published",
  carried: "carried",
};

const EDGE_STROKE: Record<Verdict | "pending", string> = {
  pending: "rgba(245,237,236,0.16)",
  closed: "rgba(245,237,236,0.09)",
  open: "rgba(242,107,94,0.4)",
  published: "#E01A0D",
  carried: "#E01A0D",
};

/** Advanced R&D's set piece: a trial tree advanced by clicking. Branches open,
    settle to carried / closed / rerun, and one lineage is published. */
export default function TrialTree() {
  const [step, setStep] = useState(0);
  const [shownGen, setShownGen] = useState(0);
  const [settledGen, setSettledGen] = useState(0);

  // A trial's reveal and settle are staged on timers. They have to be
  // cancellable: resetting — or advancing again before the settle lands —
  // would otherwise let a stale timer push the tree back to an older
  // generation, leaving the ledger and the finding disagreeing with it.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const advance = () => {
    clearTimers();
    if (step >= 4) {
      setStep(0);
      setShownGen(0);
      setSettledGen(0);
      return;
    }
    const next = step + 1;
    setStep(next);
    // The generation appears, then settles into its verdicts a beat later.
    timers.current.push(setTimeout(() => setShownGen(next), 40));
    timers.current.push(setTimeout(() => setSettledGen(next), 720));
  };

  const live = DATA.filter((n) => n.gen <= step);
  const verdictOf = (n: Node): Verdict | "pending" =>
    n.gen <= settledGen ? n.verdict : "pending";

  const byId: Record<string, Node> = {};
  DATA.forEach((n) => {
    byId[n.id] = n;
  });

  const settled = live.filter((n) => n.gen <= settledGen);
  const count = (v: Verdict) => settled.filter((n) => n.verdict === v).length;

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <div className={styles.eyebrow}>A programme, one trial at a time</div>
          <h2 className={styles.title}>Most branches close. We report those too.</h2>
          <p className={styles.lead}>
            Every trial opens candidates, measures them on your corpus, and closes
            the ones that do not hold. Run it and watch the field narrow.
          </p>
        </div>
        <div className={styles.control}>
          <button type="button" className={styles.button} onClick={advance}>
            {step >= 4
              ? "Reset the programme"
              : step === 0
                ? "Run the first trial"
                : "Run the next trial"}
          </button>
          <div className={styles.trialLabel}>{step} of 4 trials run</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.ledger}>
          <div className={styles.ledgerRow}>
            <div className={styles.ledgerName}>Candidates opened</div>
            <div className={styles.ledgerValue}>{live.length}</div>
          </div>
          <div className={styles.ledgerRow}>
            <div className={styles.ledgerName}>Ruled out</div>
            <div className={styles.ledgerValue}>{count("closed")}</div>
          </div>
          <div className={styles.ledgerRow}>
            <div className={styles.ledgerName}>Inconclusive</div>
            <div className={styles.ledgerValue}>{count("open")}</div>
          </div>
          <div className={styles.ledgerRowCarried}>
            <div className={styles.ledgerNameCarried}>Carried forward</div>
            <div className={styles.ledgerValueCarried}>
              {count("carried") + count("published")}
            </div>
          </div>

          <div className={styles.findingLabel}>Finding</div>
          <p className={settledGen === 4 ? styles.findingOn : styles.finding}>
            {FINDINGS[settledGen]}
          </p>
        </div>

        <div className={styles.canvas}>
          <svg width="100%" height="520" aria-hidden="true" className={styles.edges}>
            {live
              .filter((n) => n.p)
              .map((n) => {
                const p = byId[n.p!];
                const x1 = 8 + p.gen * COL_W + NODE_W;
                const y1 = p.y + 31;
                const x2 = 8 + n.gen * COL_W;
                const y2 = n.y + 31;
                return (
                  <path
                    key={n.id}
                    d={`M ${x1} ${y1} C ${x1 + 58} ${y1}, ${x2 - 58} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={EDGE_STROKE[verdictOf(n)]}
                    strokeWidth="1"
                    className={styles.edge}
                  />
                );
              })}
          </svg>

          {live.map((n) => {
            const v = verdictOf(n);
            return (
              <div
                key={n.id}
                className={`${styles.node} ${CLASS[v]}`}
                style={{
                  left: 8 + n.gen * COL_W,
                  top: n.y,
                  opacity: n.gen <= shownGen ? 1 : 0,
                  transform: `translateY(${n.gen <= shownGen ? 0 : 12}px)`,
                }}
              >
                <div className={styles.nodeLabel}>{n.label}</div>
                <div className={styles.nodeFoot}>
                  <div className={styles.nodeMetric}>{n.metric}</div>
                  <div className={styles.nodeTag}>{TAG[v]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
