"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/(hub)/hub/hub.module.css";

export default function CountrySignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className={styles.logoutBtn}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/hub/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "logout" }),
        }).catch(() => {});
        router.push("/hub/login");
        router.refresh();
      }}
    >
      {busy ? "Signing out..." : "Sign Out"}
    </button>
  );
}
