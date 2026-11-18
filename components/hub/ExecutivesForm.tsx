"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChapterExecutive, HubSlot } from "@/lib/hub-types";
import styles from "@/app/(hub)/hub/hub.module.css";

interface Props {
  chapterId: string;
  initial: ChapterExecutive[];
  slots: { deputy: HubSlot; treasurer: HubSlot };
  /** The Chapter Lead, or an admin previewing as the lead. */
  canEdit: boolean;
}

const SEAT_LABEL = { deputy: "Deputy Lead", treasurer: "Programs Coordinator" } as const;

function blank(seat: ChapterExecutive["seat"]): ChapterExecutive {
  return { seat, title: seat === "other" ? "" : SEAT_LABEL[seat], name: "", email: "", phone: "" };
}

/** The two compulsory seats always come first, then any extra executives. */
function withRequiredSeats(list: ChapterExecutive[]): ChapterExecutive[] {
  const deputy = list.find((e) => e.seat === "deputy") ?? blank("deputy");
  const coordinator = list.find((e) => e.seat === "treasurer") ?? blank("treasurer");
  return [deputy, coordinator, ...list.filter((e) => e.seat === "other")];
}

function seatStatus(slot: HubSlot): string {
  if (slot.status === "active") return `Signed in · ${slot.email}`;
  if (slot.status === "invited") return "Link issued, not signed in yet";
  return "No account yet";
}

export default function ExecutivesForm({ chapterId, initial, slots, canEdit }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<ChapterExecutive[]>(() => withRequiredSeats(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const update = (i: number, field: keyof ChapterExecutive, value: string) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/hub/executives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, executives: rows }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Could not save.");
      } else {
        setSaved(true);
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSaving(false);
  };

  return (
    <form className={styles.cardBox} onSubmit={save}>
      <h2 className={styles.boxTitle}>Your Executive Team</h2>
      <div className={styles.boxSubtitle}>
        The Deputy Lead and Programs Coordinator are required. Once you save, NSK AI sends each of
        them a personal link to set their password and sign in. Anyone else you add is kept on the
        chapter&apos;s record.
      </div>

      {rows.map((row, i) => (
        <div key={i} className={styles.execRow}>
          <label className={styles.execField}>
            Role
            {row.seat === "other" ? (
              <input
                className={styles.execInput}
                value={row.title}
                onChange={(e) => update(i, "title", e.target.value)}
                placeholder="e.g. Secretary"
                disabled={!canEdit}
                required
              />
            ) : (
              <span className={styles.execFixedRole}>{SEAT_LABEL[row.seat]} *</span>
            )}
          </label>
          <label className={styles.execField}>
            Full name
            <input
              className={styles.execInput}
              value={row.name}
              onChange={(e) => update(i, "name", e.target.value)}
              disabled={!canEdit}
              required
            />
          </label>
          <label className={styles.execField}>
            Email
            <input
              type="email"
              className={styles.execInput}
              value={row.email}
              onChange={(e) => update(i, "email", e.target.value)}
              disabled={!canEdit}
              required
            />
          </label>
          <label className={styles.execField}>
            Phone (optional)
            <input
              className={styles.execInput}
              value={row.phone ?? ""}
              onChange={(e) => update(i, "phone", e.target.value)}
              disabled={!canEdit}
            />
          </label>
          {row.seat === "other" ? (
            canEdit && (
              <button
                type="button"
                className={styles.execRemove}
                onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
              >
                Remove
              </button>
            )
          ) : (
            <span className={styles.execField} style={{ paddingBottom: 9 }}>
              {seatStatus(slots[row.seat])}
            </span>
          )}
        </div>
      ))}

      {canEdit && (
        <div className={styles.actionBtnsRow} style={{ marginTop: 20 }}>
          <button
            type="button"
            className={styles.ctaBtnSecondary}
            onClick={() => setRows((prev) => [...prev, blank("other")])}
          >
            + Add another executive
          </button>
          <button type="submit" className={styles.ctaBtnPrimary} disabled={saving}>
            {saving ? "Saving…" : "Save executive team"}
          </button>
        </div>
      )}
      {!canEdit && (
        <p className={styles.execMessage}>Only the Chapter Lead can change this list.</p>
      )}

      {error && <p className={styles.execMessage} role="alert">{error}</p>}
      {saved && (
        <p className={styles.execMessage} role="status">
          Saved. NSK AI will send your Deputy Lead and Programs Coordinator their sign-in links.
        </p>
      )}
    </form>
  );
}
