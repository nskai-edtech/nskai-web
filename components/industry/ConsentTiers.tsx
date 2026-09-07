"use client";

import { useState } from "react";
import styles from "./ConsentTiers.module.css";

type Tier = 1 | 2 | 3;

const TIERS: { id: Tier; name: string; covers: string }[] = [
  { id: 1, name: "Care team", covers: "Names, ages and clinicians" },
  { id: 2, name: "Research", covers: "Sites and dates" },
  { id: 3, name: "External audit", covers: "Values and intervals" },
];

/** The redactable fields; each belongs to the tier that permits it.
    The prototype labels the counter "of 8" but draws seven fields, so the
    total is taken from the list rather than hard-coded — otherwise granting
    every tier settles on "7 of 8" and reads as a fault. */
const FIELDS: { text: string; tier: Tier }[] = [
  { text: "A. O. Adeyemi", tier: 1 },
  { text: "aged 54", tier: 1 },
  { text: "Ikoyi clinic", tier: 2 },
  { text: "11 March", tier: 2 },
  { text: "8.4%", tier: 3 },
  { text: "twelve weeks", tier: 3 },
  { text: "Dr B. Okonkwo", tier: 1 },
];

/** A field with its redaction bar over it. Defined at module scope: declared
    inside the component it would be a new component type on every render, so
    React would remount these spans instead of updating them and the bar's
    420ms wipe would never run — the bars would just snap. */
function Field({
  index,
  granted,
}: {
  index: number;
  granted: Record<Tier, boolean>;
}) {
  const field = FIELDS[index];
  return (
    <span className={styles.field}>
      <span>{field.text}</span>
      <span
        className={styles.bar}
        style={{ transform: granted[field.tier] ? "scaleX(0)" : "scaleX(1)" }}
        aria-hidden="true"
      />
    </span>
  );
}

/** Health and insurance's one motion piece: granting a consent tier lifts the
    bars off the fields that tier covers, and nothing else. */
export default function ConsentTiers() {
  const [granted, setGranted] = useState<Record<Tier, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const toggle = (id: Tier) =>
    setGranted((g) => ({ ...g, [id]: !g[id] }));

  const visible = FIELDS.filter((f) => granted[f.tier]).length;

  return (
    <div className={styles.grid}>
      <div className={styles.note}>
        <div className={styles.label}>Clinical note &middot; extract</div>
        <p className={styles.text}>
          Patient <Field index={0} granted={granted} />, <Field index={1} granted={granted} />, seen at{" "}
          <Field index={2} granted={granted} /> on <Field index={3} granted={granted} />. Metformin increased to 1g
          twice daily following an HbA1c of <Field index={4} granted={granted} />. Renal function
          stable. Review in <Field index={5} granted={granted} />; letter copied to{" "}
          <Field index={6} granted={granted} />.
        </p>
        <div className={styles.count}>
          Fields visible <span className={styles.countValue}>{visible}</span> of{" "}
          {FIELDS.length}
        </div>
      </div>

      <div>
        <div className={styles.label}>Consent granted</div>
        <div className={styles.tiers}>
          {TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              className={granted[tier.id] ? styles.tierOn : styles.tier}
              onClick={() => toggle(tier.id)}
              aria-pressed={granted[tier.id]}
            >
              <div className={styles.tierHead}>
                <div className={styles.tierName}>{tier.name}</div>
                <div className={styles.tierState}>
                  {granted[tier.id] ? "Granted" : "Withheld"}
                </div>
              </div>
              <div className={styles.tierCovers}>{tier.covers}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
