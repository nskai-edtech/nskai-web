import type { Metadata } from "next";
import ConsentTiers from "@/components/industry/ConsentTiers";
import Plate from "@/components/industry/Plate";
import { plateBySlug } from "@/lib/industries";
import styles from "../plate-stage.module.css";

const plate = plateBySlug("health-and-insurance");

export const metadata: Metadata = {
  title: "Health and insurance",
  description:
    "Notes, labelled and redacted: clinical text made usable without being made public.",
};

export default function HealthAndInsurancePage() {
  return (
    <Plate plate={plate}>
      <section className={styles.stage}>
        <div className={styles.head}>
          <h2 className={styles.title}>Grant a tier of consent.</h2>
          <p className={styles.note}>
            Grant a tier of consent. The note reveals only what that tier permits.
          </p>
        </div>
        <div className={styles.body}>
          <ConsentTiers />
        </div>
      </section>
    </Plate>
  );
}
