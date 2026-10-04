import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import Loader from "@/components/loader/loader";
import LocationsCatalog from "./LocationsCatalog";
import styles from "./page.module.css";

export default function LocationsPage() {
  return (
    <>
      <main className={styles.page}>
        <h1 className={styles.heading}>Усі місця відпочинку</h1>
        <Suspense
          fallback={
            <div className={styles.loading}>
              <Loader />
            </div>
          }
        >
          <LocationsCatalog />
        </Suspense>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link href="/" className={styles.footerBrand}>
            <Icon name="icon-map_search" size={20} />
            <span>Relax Map</span>
          </Link>
          <nav className={styles.footerNav} aria-label="Навігація футера">
            <Link href="/">Головна</Link>
            <Link href="/locations">Місця відпочинку</Link>
          </nav>
          <p className={styles.copyright}>
            © 2026 Relax Map. Усі права захищені.
          </p>
        </div>
      </footer>
    </>
  );
}
