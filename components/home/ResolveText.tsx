"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** Wrap text to a pixel width using the Author metrics the canvas will paint with. */
function wrapLines(text: string, fontSize: number, maxW: number) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = '500 ' + fontSize + 'px "Author", "Helvetica Neue", sans-serif';
  if ("letterSpacing" in ctx) ctx.letterSpacing = -0.02 * fontSize + "px";
  const words = String(text).trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";
  words.forEach((w) => {
    const next = line ? line + " " + w : w;
    if (line && ctx.measureText(next).width > maxW) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines;
}

/** Paint the lines into a canvas whose backing store is `block` CSS pixels per
    pixel, so the browser's upscale is the quantization we want to show. */
function paint(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number,
  lines: string[],
  fontSize: number,
  lineHeight: number,
  block: number,
  color: string,
) {
  const w = Math.max(1, Math.ceil(cssW / block));
  const h = Math.max(1, Math.ceil(cssH / block));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.font = '500 ' + fontSize / block + 'px "Author", "Helvetica Neue", sans-serif';
  if ("letterSpacing" in ctx) ctx.letterSpacing = (-0.02 * fontSize) / block + "px";
  ctx.textBaseline = "top";
  ctx.fillStyle = color;
  lines.forEach((line, i) => ctx.fillText(line, 0, (i * lineHeight) / block));
}

const DEFAULT_STEPS = [16, 8, 4];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type Props = {
  as?: ElementType;
  className?: string;
  /** Plain text, since the effect measures and repaints it on a canvas. */
  children: string;
  /** "mount" resolves once fonts are ready (the hero); "scroll" waits until the
      heading comes into view (every section title). */
  trigger?: "mount" | "scroll";
  /** Block sizes to step through, largest first. */
  steps?: number[];
  stepMs?: number;
  /** Overrides for the hero, whose canvas is sized ahead of the paint. */
  fontSize?: number;
  lineHeight?: number;
  id?: string;
};

/** A heading that resolves out of coarse pixels into real type.
    The DOM text is always present; the canvas is a decorative overlay. */
export default function ResolveText({
  as: Tag = "h2",
  className,
  children,
  trigger = "scroll",
  steps = DEFAULT_STEPS,
  stepMs = 110,
  fontSize,
  lineHeight,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let observer: IntersectionObserver | undefined;
    // document.fonts.ready resolves on its own schedule, which can be after
    // this effect has been torn down. Without the flag, start() would build
    // an observer nothing is left to disconnect.
    let cancelled = false;

    const run = () => {
      const cs = getComputedStyle(el);
      const size = fontSize ?? parseFloat(cs.fontSize);
      const lh = lineHeight ?? (parseFloat(cs.lineHeight) || size * 1.15);
      const rect = el.getBoundingClientRect();
      if (!rect.width) return;
      const lines = wrapLines(el.textContent || "", size, rect.width + 1);
      const cv = document.createElement("canvas");
      cv.setAttribute("aria-hidden", "true");
      cv.style.cssText =
        "position:absolute;left:0;top:0;width:" +
        rect.width +
        "px;height:" +
        rect.height +
        "px;pointer-events:none;image-rendering:pixelated";
      el.appendChild(cv);
      el.style.color = "transparent";
      steps.forEach((block, i) => {
        timers.push(
          setTimeout(() => {
            paint(cv, rect.width, rect.height, lines, size, lh, block, cs.color);
          }, i * stepMs),
        );
      });
      timers.push(
        setTimeout(() => {
          el.style.color = "";
          cv.remove();
        }, steps.length * stepMs),
      );
    };

    const start = () => {
      if (cancelled) return;
      if (trigger === "mount") {
        run();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer?.unobserve(entry.target);
            run();
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
      );
      observer.observe(el);
    };

    // Measuring before the webfont lands would wrap against the fallback.
    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      observer?.disconnect();
    };
  }, [children, trigger, stepMs, fontSize, lineHeight, steps]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children as ReactNode}
    </Tag>
  );
}
