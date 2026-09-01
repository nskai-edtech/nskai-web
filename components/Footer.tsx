import Link from "next/link";
import { DISCORD_URL } from "@/lib/nav";
import styles from "./Footer.module.css";

// The footer lists products in its own order, which differs from the
// mega-menu's. Kept as designed rather than reusing the nav ordering.
const footerProducts = [
  { name: "Zerra", href: "/products/zerra" },
  { name: "Leri", href: "/products/leri" },
  { name: "Data Annotation", href: "/products/data-annotation" },
  { name: "Rudani", href: "/products/rudani" },
  { name: "Enterprise AI", href: "/products/enterprise-ai" },
  { name: "Advanced R&D", href: "/products/advanced-rd" },
];

const companyLinks = [
  { name: "Solutions", href: "/solutions" },
  { name: "Company", href: "/company" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <Link href="/" className={styles.wordmark}>
          NSK AI
        </Link>

        <div className={styles.column}>
          <div className={styles.heading}>Products</div>
          {footerProducts.map((product) => (
            <Link key={product.href} href={product.href} className={styles.link}>
              {product.name}
            </Link>
          ))}
        </div>

        <div className={styles.column}>
          <div className={styles.heading}>Company</div>
          {companyLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.name}
            </Link>
          ))}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener"
            className={styles.link}
          >
            Discord
          </a>
        </div>

        <div className={`${styles.column} ${styles.offices}`}>
          <div className={styles.heading}>Offices</div>
          <div>Lagos &middot; London</div>
        </div>
      </div>

      <div className={styles.baseline}>
        <div>Lagos and London</div>
        <div>NSK AI &copy; 2026</div>
      </div>
    </footer>
  );
}
