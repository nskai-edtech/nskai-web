"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setLoadingMessage("Signing you in…");
    setError(null);
    try {
      const res = await fetch("/api/hub/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || data.error || !data.redirect) {
        setError(data.error || "Could not sign you in.");
        setPassword("");
        setLoadingMessage(null);
        return;
      }
      router.push(data.redirect);
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoadingMessage(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>NSK AI</div>
        <span className={styles.monoLabel}>Chapter Operations</span>

        {loadingMessage ? (
          <p className={styles.loadingText} role="status">
            {loadingMessage}
          </p>
        ) : (
          <>
            <h1 className={styles.title}>Officer &amp; Admin Sign In</h1>
            <p className={styles.desc}>
              Access is restricted to appointed Chapter Leads, Executives, and Global Admins.
              Sign in with your registered email and password.
            </p>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim() && password) signIn();
              }}
            >
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Registered Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="you@university.edu"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={styles.input}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Sign In →
              </button>
            </form>

            <div className={styles.notice}>
              Forgot your password? Ask NSK AI for a fresh invite link.
              <br />
              Not yet a chapter lead?{" "}
              <a href="/community/chapter-leads">Apply to lead NSK AI on your campus</a>.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
