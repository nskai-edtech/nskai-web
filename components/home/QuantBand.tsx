"use client";

import { useEffect, useRef } from "react";
import { FIRST_FRAME, makeBandPainter } from "./figures";

/** The full-bleed band: one surface drawn at two, four, eight and sixteen levels. */
export default function QuantBand({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    /** The most recent timestamp painted, so a resize redraws the same moment. */
    let last = FIRST_FRAME;

    // The painter bakes in the element width, and .band is the one fluid canvas
    // on the page, so a resize needs a fresh painter or the band stretches.
    let draw = makeBandPainter(cv);
    let width = cv.clientWidth;
    draw(FIRST_FRAME);

    const onResize = () => {
      if (cv.clientWidth === width) return;
      width = cv.clientWidth;
      draw = makeBandPainter(cv);
      draw(last);
    };
    window.addEventListener("resize", onResize);

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
        if (visible) draw((last = ts - start + FIRST_FRAME));
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
