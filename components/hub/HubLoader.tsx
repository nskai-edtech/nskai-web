import styles from "./HubLoader.module.css";

interface HubLoaderProps {
  label?: string;
  sublabel?: string;
}

export default function HubLoader({
  label = "NSK AI // Chapter Operations",
  sublabel = "Opening your chapter…",
}: HubLoaderProps) {
  return (
    <div className={styles.container} role="status">
      <div className={styles.caption}>{label}</div>
      <div className={styles.subcaption}>{sublabel}</div>
    </div>
  );
}
