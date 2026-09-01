import type { Metadata } from "next";
import { CONTACT_EMAIL, DISCORD_URL } from "@/lib/nav";
import ContactForm from "./ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send us the problem, the data you have and the deadline you are working to. We read every message.",
};

export default function ContactPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`eyebrow ${styles.heroEyebrow}`}>Contact</div>
        <h1 className={styles.heroTitle}>Tell us what you are trying to fix.</h1>
        <p className={styles.heroLead}>
          Send us the problem, the data you have and the deadline you are working
          to. We read every message.
        </p>
      </section>

      <section className={styles.body}>
        <ContactForm />

        <aside className={styles.aside}>
          <div>
            <div className="eyebrow">Or write to us directly</div>
            <p className={styles.asideText}>
              If you would rather use your own mail client, send the same details
              to our inbox and we will pick it up from there.
            </p>
            {/* Also the no-JS fallback for the form. */}
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.asideLink}>
              {CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <div className="eyebrow">Response time</div>
            <p className={styles.asideText}>
              One working day, from Lagos or London, whichever is awake.
            </p>
          </div>

          <div>
            <div className="eyebrow">Community</div>
            <p className={styles.asideText}>
              Students and engineers building with us talk here every day.
            </p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener"
              className={styles.asideLink}
            >
              Join the Discord
            </a>
          </div>
        </aside>
      </section>
    </>
  );
}
