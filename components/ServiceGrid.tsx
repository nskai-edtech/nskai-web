import type { CSSProperties } from "react";
import { services } from "@/lib/home-content";
import styles from "./ServiceGrid.module.css";

/** "Our services" — four cards whose detail lines come out on hover.
    Shared by the homepage and the solutions overview; the overview numbers
    them, the homepage does not. */
export default function ServiceGrid({ numbered = false }: { numbered?: boolean }) {
  return (
    <div className={styles.grid}>
      {services.map((service, i) => (
        <div
          key={service.title}
          className={styles.card}
          style={{ "--svc-accent": service.accent } as CSSProperties}
        >
          <div className={styles.top}>
            <div className={styles.title}>{service.title}</div>
            <div className={styles.dot} />
          </div>
          <div className={styles.rule} />
          <p className={styles.lead}>{service.lead}</p>
          <div className={styles.body}>
            <div className={styles.detail}>
              {service.detail.map((line, k) => (
                <div
                  key={line}
                  className={k === 0 ? styles.detailStrong : styles.detailMuted}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
          {numbered ? (
            <div className={styles.index}>{String(i + 1).padStart(2, "0")}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
