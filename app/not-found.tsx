import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Ой! Здається, такої сторінки не існує.</p>
      <Link href="/" className={styles.link}>
        Повернутися на головну
      </Link>
    </div>
  );
}
