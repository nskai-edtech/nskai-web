"use client";

import { useEffect, useRef } from "react";
import { FIRST_FRAME, makeBandPainter } from "./figures";

/** The full-bleed band: one surface drawn at two, four, eight and sixteen levels. */
export default function QuantBand({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const draw = makeBandPainter(cv);
    draw(FIRST_FRAME);

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visible = e.isIntersecting)),
      { rootMargin: "80px" },
    );
    io.observe(cv);

    let raf = 0;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      let start: number | null = null;
      const loop = (ts: number) => {
        if (start === null) start = ts;
        if (visible) draw(ts - start + FIRST_FRAME);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
