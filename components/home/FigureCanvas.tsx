"use client";

import { useEffect, useRef } from "react";
import {
  drawFigure,
  FIRST_FRAME,
  type FigureKind,
  type Pointer,
} from "./figures";

/** One product block's figure. It animates only while on screen, and follows
    the pointer anywhere over the plate it sits in.

    Under prefers-reduced-motion the idle animation stops, but the pointer still
    steers the figure: reduced motion asks us to drop motion the reader did not
    ask for, not to make the piece inert under their own cursor. */
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

    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // With the loop running, the next frame picks the pointer up on its own;
    // without it, the move itself has to paint, coalesced onto a frame.
    let nudge = 0;
    const repaint = () => {
      if (!reduced || nudge) return;
      nudge = requestAnimationFrame(() => {
        nudge = 0;
        drawFigure(kind, cv, FIRST_FRAME, pointer);
      });
    };

    const plate = cv.parentElement;
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointer.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      pointer.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      pointer.on = true;
      repaint();
    };
    const onLeave = () => {
      pointer.on = false;
      repaint();
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
      if (nudge) cancelAnimationFrame(nudge);
    };
  }, [kind]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
