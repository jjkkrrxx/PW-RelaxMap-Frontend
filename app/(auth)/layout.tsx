import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import styles from "./layout.module.css";

// Спільна оболонка сторінок входу й реєстрації за Figma:
// смуга з лого 72 px, контент по центру, футер унизу.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // поточний рік — щоб не міняти вручну щороку
  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Icon name="icon-map_search" size={24} />
          <span>Relax Map</span>
        </Link>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>© {year} Relax Map</p>
      </footer>
    </div>
  );
}
