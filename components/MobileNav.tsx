"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company, industries, products, type NavItem } from "@/lib/nav";
import styles from "./MobileNav.module.css";

const SECTIONS: { label: string; items: NavItem[] }[] = [
  { label: "Products", items: products },
  { label: "Solutions", items: industries },
  { label: "Company", items: company },
];

/** The small-screen counterpart to the header's hover mega-menus, which a
    touch device can never open. Everything is expanded in one scrolling
    sheet rather than behind accordions: the whole navigation is only two
    dozen rows, and a reader looking for one product should not have to guess
    which section holds it. */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A route change leaves the sheet open over the new page otherwise.
  useEffect(() => setOpen(false), [pathname]);

  // Hold the page still behind the sheet.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={open ? `${styles.bar} ${styles.barTop}` : styles.bar} />
        <span className={open ? `${styles.bar} ${styles.barBottom}` : styles.bar} />
      </button>

      <div
        id="mobile-nav"
        className={open ? `${styles.sheet} ${styles.sheetOpen}` : styles.sheet}
      >
        <nav className={styles.inner}>
          {SECTIONS.map((section) => (
            <section key={section.label} className={styles.section}>
              <h2 className={styles.sectionLabel}>{section.label}</h2>
              {section.items.map((item) => (
                <Link
                  key={`${item.name}-${item.href}`}
                  href={item.href}
                  className={styles.row}
                >
                  <span
                    className={styles.tile}
                    style={{ background: item.color, color: item.tileInk }}
                  >
                    {item.icon}
                  </span>
                  <span className={styles.rowBody}>
                    <span className={styles.rowName}>{item.name}</span>
                    <span className={styles.rowDesc}>{item.description}</span>
                  </span>
                </Link>
              ))}
            </section>
          ))}

          <section className={styles.section}>
            <Link href="/foundation" className={styles.plain}>Foundation</Link>
            <Link href="/community" className={styles.plain}>Community</Link>
          </section>

          <Link href="/contact" className={styles.cta}>Contact</Link>
        </nav>
      </div>
    </>
  );
}
