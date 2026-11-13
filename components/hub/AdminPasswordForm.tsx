"use client";

import { useState } from "react";

const input: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid var(--ink-muted)",
  background: "transparent",
  color: "var(--ink)",
  font: "inherit",
  minHeight: 44,
  flex: "1 1 200px",
};

/** Lets a signed-in admin change the shared admin password. */
export default function AdminPasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/hub/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change-admin-password", password: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMessage(data.error || "Could not change the password.");
      } else {
        setMessage("Admin password changed. Use the new one next time you sign in.");
        setCurrent("");
        setNext("");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section style={{ padding: "32px var(--page-x) 64px" }}>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, margin: "0 0 8px" }}>Change Admin Password</h2>
      <p style={{ color: "var(--ink-muted)", fontSize: 14, margin: "0 0 16px" }}>
        Both admin emails share this password.
      </p>
      <form onSubmit={submit} style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 760 }}>
        <input
          id="current-admin-password"
          type="password"
          aria-label="Current password"
          placeholder="Current password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          style={input}
        />
        <input
          id="new-admin-password"
          type="password"
          aria-label="New password"
          placeholder="New password (8+ characters)"
          autoComplete="new-password"
          minLength={8}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          style={input}
        />
        <button type="submit" disabled={busy} style={{ ...input, flex: "0 0 auto", cursor: "pointer", fontWeight: 600 }}>
          {busy ? "Saving…" : "Change Password"}
        </button>
      </form>
      {message && (
        <p role="status" style={{ marginTop: 12, fontSize: 14 }}>
          {message}
        </p>
      )}
    </section>
  );
}
