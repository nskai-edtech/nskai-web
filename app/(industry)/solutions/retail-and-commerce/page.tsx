import type { Metadata } from "next";
import CaseStrip from "@/components/industry/CaseStrip";
import Plate from "@/components/industry/Plate";
import { plateBySlug } from "@/lib/industries";
import styles from "../plate-stage.module.css";

const plate = plateBySlug("retail-and-commerce");

export const metadata: Metadata = {
  title: "Retail and commerce",
  description:
    "The refund decided once: a decision reached in one exchange, with the reason written down.",
};

export default function RetailAndCommercePage() {
  return (
    <Plate plate={plate}>
      <section className={styles.stageWide}>
        <div className={styles.headInset}>
          <h2 className={styles.title}>The strip drifts.</h2>
          <p className={styles.note}>
            The strip drifts. Point at a case to hold it and read the decision.
          </p>
        </div>
        <div className={styles.bodyBleed}>
          <CaseStrip />
        </div>
      </section>
    </Plate>
  );
}
