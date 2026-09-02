"use client";

import { useEffect, useRef, useState } from "react";

/** A measurement that settles out of noise when it scrolls into view, then
    holds with a ±1 last-digit jitter if it is a live figure. */
export default function CounterRow({
  target,
  dp,
  live,
  index,
}: {
  target: number;
  dp: number;
  live: boolean;
  index: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState((0).toFixed(dp));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) => v.toFixed(dp);

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setText(fmt(target));
      return;
    }

    let settleId: ReturnType<typeof setInterval> | undefined;
    let jitterId: ReturnType<typeof setInterval> | undefined;
    let holdId: ReturnType<typeof setTimeout> | undefined;

    const settle = () => {
      let k = 0;
      const steps = 18;
      settleId = setInterval(() => {
        k++;
        const p = k / steps;
        const eased = 1 - Math.pow(1 - p, 3);
        const noise = (1 - eased) * target * 0.55 * (Math.random() - 0.4);
        setText(fmt(Math.max(0, target * eased + noise)));
        if (k >= steps) {
          clearInterval(settleId);
          setText(fmt(target));
          if (live && dp > 0) {
            jitterId = setInterval(
              () => {
                const d = (Math.random() < 0.5 ? -1 : 1) * Math.pow(10, -dp);
                setText(fmt(target + d));
                holdId = setTimeout(() => setText(fmt(target)), 420);
              },
              3400 + index * 700,
            );
          }
        }
      }, 55);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          settle();
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (settleId) clearInterval(settleId);
      if (jitterId) clearInterval(jitterId);
      if (holdId) clearTimeout(holdId);
    };
  }, [target, dp, live, index]);

  return <span ref={ref}>{text}</span>;
}
