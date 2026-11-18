"use client";

import { useState } from "react";
import styles from "@/app/(hub)/hub/hub.module.css";

/** Top of /hub/admin: jump straight to what a chapter lead or a country team sees. */
export default function AdminViewPicker({
  chapters,
  countries,
}: {
  chapters: { id: string; label: string }[];
  countries: string[];
}) {
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? "");
  const [country, setCountry] = useState(countries[0] ?? "");
  const select = { height: 38, padding: "0 8px", fontSize: 14, maxWidth: "100%" } as const;
  return (
    <div className={styles.page} style={{ paddingBottom: 0 }}>
      <div className={styles.cardBox}>
        <h2 className={styles.boxTitle}>See the hub as someone else</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
          <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} style={select} aria-label="Chapter">
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <a className={styles.ctaBtnPrimary} href={`/hub/admin/view/${chapterId}`}>
            View as Chapter Lead →
          </a>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
          <select value={country} onChange={(e) => setCountry(e.target.value)} style={select} aria-label="Country">
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <a className={styles.ctaBtnSecondary} href={`/hub/country?country=${encodeURIComponent(country)}`}>
            View as Country Director →
          </a>
        </div>
      </div>
    </div>
  );
}
