"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./RiseIn.module.css";

/** Rows that lift into place the first time they are scrolled into view.
    Static (already in place) under prefers-reduced-motion. */
export default function RiseIn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add(styles.shown);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          entry.target.classList.add(styles.shown);
        });
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.rise} ${className ?? ""}`}>
      {children}
    </div>
  );
}
