"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/nav";
import styles from "./contact.module.css";

type Status = { text: string; error: boolean };

const EMPTY: Status = { text: "", error: false };

// Deliberately permissive: catches typos like a missing @ or domain without
// rejecting addresses that are unusual but valid.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(EMPTY);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());

  function validate() {
    const bad = new Set<string>();
    if (!name.trim()) bad.add("name");
    if (!email.trim() || !EMAIL_RE.test(email.trim())) bad.add("email");
    if (!message.trim()) bad.add("message");
    return bad;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const bad = validate();
    setInvalid(bad);
    if (bad.size > 0) {
      setStatus({
        text:
          bad.has("email") && !bad.has("name") && !bad.has("message")
            ? "That email address does not look right."
            : "Please fill in your name, email and request.",
        error: true,
      });
      return;
    }

    setSubmitting(true);
    setStatus({ text: "Sending…", error: false });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, org, message, company }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error || "Something went wrong.");
      }

      setName("");
      setEmail("");
      setOrg("");
      setMessage("");
      setStatus({ text: "Thank you. We will be in touch.", error: false });
    } catch (error) {
      setStatus({
        text:
          error instanceof Error
            ? `${error.message} You can also email ${CONTACT_EMAIL}.`
            : `Something went wrong. You can also email ${CONTACT_EMAIL}.`,
        error: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.field}>
        <span className="eyebrow">Name</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={invalid.has("name") || undefined}
        />
      </label>

      <label className={styles.field}>
        <span className="eyebrow">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={invalid.has("email") || undefined}
        />
      </label>

      <label className={styles.field}>
        <span className="eyebrow">Organisation</span>
        <input
          type="text"
          name="org"
          autoComplete="organization"
          className={styles.input}
          value={org}
          onChange={(e) => setOrg(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className="eyebrow">Your request</span>
        <textarea
          rows={7}
          name="message"
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={invalid.has("message") || undefined}
        />
      </label>

      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.submitRow}>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Sending…" : "Send request"}
        </button>
        <div
          className={`${styles.status} ${status.error ? styles.statusError : ""}`}
          role="status"
          aria-live="polite"
        >
          {status.text}
        </div>
      </div>
    </form>
  );
}
