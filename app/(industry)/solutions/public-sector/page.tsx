import type { Metadata } from "next";
import Plate from "@/components/industry/Plate";
import RecordRiffle from "@/components/industry/RecordRiffle";
import { plateBySlug } from "@/lib/industries";
import styles from "../plate-stage.module.css";

const plate = plateBySlug("public-sector");

export const metadata: Metadata = {
  title: "Public sector",
  description:
    "Search across an archive that is not permitted to move: retrieval over records that cannot leave the building.",
};

export default function PublicSectorPage() {
  return (
    <Plate plate={plate}>
      <section className={styles.stage}>
        <div className={styles.head}>
          <h2 className={styles.title}>Riffle the drawer.</h2>
          <p className={styles.note}>
            Riffle the drawer. Each card is stamped as the index accepts it.
          </p>
        </div>
        <div className={styles.body}>
          <RecordRiffle />
        </div>
      </section>
    </Plate>
  );
}
