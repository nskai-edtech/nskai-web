"use client";

import { useEffect, useRef } from "react";
import {
  drawFigure,
  FIRST_FRAME,
  type FigureKind,
  type Pointer,
} from "./figures";

/** One product block's figure. It animates only while on screen, and follows
    the pointer anywhere over the plate it sits in. */
export default function FigureCanvas({
  kind,
  className,
}: {
  kind: FigureKind;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const pointer: Pointer = { x: 0.5, y: 0.5, on: false };
    drawFigure(kind, cv, FIRST_FRAME, pointer);

    const plate = cv.parentElement;
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointer.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      pointer.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      pointer.on = true;
    };
    const onLeave = () => {
      pointer.on = false;
    };
    plate?.addEventListener("pointermove", onMove);
    plate?.addEventListener("pointerleave", onLeave);

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
        if (visible) drawFigure(kind, cv, ts - start + FIRST_FRAME, pointer);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      plate?.removeEventListener("pointermove", onMove);
      plate?.removeEventListener("pointerleave", onLeave);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [kind]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
