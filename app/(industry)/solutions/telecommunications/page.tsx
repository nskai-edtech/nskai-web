import type { Metadata } from "next";
import LoupePlate from "@/components/industry/LoupePlate";
import Plate from "@/components/industry/Plate";
import { plateBySlug } from "@/lib/industries";
import styles from "../plate-stage.module.css";

const plate = plateBySlug("telecommunications");

export const metadata: Metadata = {
  title: "Telecommunications",
  description:
    "Support that answers in the language the question was asked in, on the channel the subscriber chose.",
};

export default function TelecommunicationsPage() {
  return (
    <Plate plate={plate}>
      <section className={styles.stage}>
        <div className={styles.head}>
          <h2 className={styles.title}>Move across the plate.</h2>
          <p className={styles.note}>
            Move across the plate. Under the room the subscriber reaches lies the
            one that answers.
          </p>
        </div>
        <div className={styles.body}>
          <LoupePlate
            base={{ file: "tel-plate-city.jpg", alt: "" }}
            overlay={{ file: "tel-plate-net.jpg", alt: "" }}
          />
        </div>
      </section>
    </Plate>
  );
}
