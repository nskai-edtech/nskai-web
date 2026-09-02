import type { Metadata } from "next";
import Plate from "@/components/industry/Plate";
import PrecisionBudget from "@/components/industry/PrecisionBudget";
import { plateBySlug } from "@/lib/industries";
import styles from "../plate-stage.module.css";

const plate = plateBySlug("energy-and-industry");

export const metadata: Metadata = {
  title: "Energy and industry",
  description:
    "Inference at the wellhead: models sized for the hardware that is actually on site.",
};

export default function EnergyAndIndustryPage() {
  return (
    <Plate plate={plate}>
      <section className={styles.stage}>
        <div className={styles.head}>
          <h2 className={styles.title}>Set the precision budget.</h2>
          <p className={styles.note}>
            Set the precision budget. Watch which digits survive it.
          </p>
        </div>
        <div className={styles.body}>
          <PrecisionBudget />
        </div>
      </section>
    </Plate>
  );
}
