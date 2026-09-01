import Link from "next/link";
import type { CSSProperties } from "react";
import { company, industries, products, type NavItem } from "@/lib/nav";
import styles from "./Header.module.css";

/** One row of a mega-menu panel: coloured icon tile, name, one-line description. */
function MenuRow({ item }: { item: NavItem }) {
  return (
    <Link
      href={item.href}
      className={styles.row}
      style={{ "--row-accent": item.color } as CSSProperties}
    >
      <div
        className={styles.tile}
        style={{ background: item.color, color: item.tileInk }}
      >
        {item.icon}
      </div>
      <div className={styles.rowBody}>
        <div className={styles.rowName}>{item.name}</div>
        <p className={styles.rowDesc}>{item.description}</p>
      </div>
    </Link>
  );
}

/** A nav label whose 376px panel opens on hover or keyboard focus.
    The label is not itself a link, matching the prototype. */
function MenuGroup({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div className={styles.group}>
      <div className={styles.trigger} tabIndex={0} aria-haspopup="true">
        {label}
      </div>
      <div className={styles.panel}>
        {items.map((item) => (
          <MenuRow key={`${item.name}-${item.href}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.wordmark}>
        NSK AI
      </Link>
      <nav className={styles.nav}>
        <MenuGroup label="Products" items={products} />
        <MenuGroup label="Solutions" items={industries} />
        <MenuGroup label="Company" items={company} />
        <Link href="/foundation" className={styles.link}>
          Foundation
        </Link>
        <Link href="/community" className={styles.link}>
          Community
        </Link>
      </nav>
      <div className={styles.actions}>
        <Link href="/contact" className={styles.cta}>
          Contact
        </Link>
      </div>
    </header>
  );
}
