"use client";

import { useRef, useState } from "react";
import styles from "./LoupePlate.module.css";

const RADIUS = 150;

/** Telecommunications' one motion piece: a loupe. The second plate is revealed
    only inside a circle that follows the pointer. */
export default function LoupePlate({
  base,
  overlay,
}: {
  base: { file: string; alt: string };
  overlay: { file: string; alt: string };
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);

  const mask = lens
    ? `radial-gradient(circle ${RADIUS}px at ${lens.x}px ${lens.y}px, #000 62%, rgba(0,0,0,0) 66%)`
    : undefined;

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setLens({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onPointerLeave={() => setLens(null)}
    >
      <img src={`/plates/${base.file}`} alt={base.alt} className={styles.image} />

      <div
        className={styles.layer}
        style={{
          opacity: lens ? 1 : 0,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
        aria-hidden="true"
      >
        <img src={`/plates/${overlay.file}`} alt="" className={styles.image} />
      </div>

      <div
        className={styles.ring}
        style={{
          left: lens?.x ?? 0,
          top: lens?.y ?? 0,
          opacity: lens ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
