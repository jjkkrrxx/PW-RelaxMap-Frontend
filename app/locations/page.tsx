import { Suspense } from "react";
import Loader from "@/components/loader/loader";
import LocationsCatalog from "./LocationsCatalog";
import styles from "./page.module.css";

export default function LocationsPage() {
  return (
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
  );
}
