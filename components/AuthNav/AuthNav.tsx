'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AuthNav.module.css';

export const AuthNav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link 
        href="/login" 
        className={`${styles.link} ${pathname === '/login' ? styles.active : ''}`}
      >
      Реєстрація
      </Link>
      <Link 
        href="/register" 
        className={`${styles.link} ${pathname === '/register' ? styles.active : ''}`}
      >
       Вхід
      </Link>
    </nav>
  );
};
