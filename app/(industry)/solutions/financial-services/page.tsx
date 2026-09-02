import type { Metadata } from "next";
import Plate from "@/components/industry/Plate";
import ReconciliationLedger from "@/components/industry/ReconciliationLedger";
import { plateBySlug } from "@/lib/industries";
import styles from "../plate-stage.module.css";

const plate = plateBySlug("financial-services");

export const metadata: Metadata = {
  title: "Financial services",
  description:
    "Reconciliation: two ledgers that ought to agree, and the small number of lines that do not.",
};

export default function FinancialServicesPage() {
  return (
    <Plate plate={plate}>
      <section className={styles.stage}>
        <div className={styles.head}>
          <h2 className={styles.title}>Drag the rule across the day.</h2>
          <p className={styles.note}>
            Drag the rule across the day. Lines pair as it passes; what remains is
            the exception list.
          </p>
        </div>
        <div className={styles.body}>
          <ReconciliationLedger />
        </div>
      </section>
    </Plate>
  );
}
