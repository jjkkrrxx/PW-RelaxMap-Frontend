'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import styles from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/login');
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <header className={styles.header}>
          <svg className={styles.logoIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
            <path d="M9 3v15M15 6v15" />
          </svg>
          <span className={styles.logoText}>Relax Map</span>
        </header>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <span className={styles.tab}>Реєстрація</span>
            <Link href="/login" className={styles.tab}>Вхід</Link>
          </div>
          <div className={`${styles.tabsLine} ${styles.lineRegister}`}></div>
        </div>

        <main className={styles.main}>
          <h1 className={styles.formTitle}>Реєстрація</h1>
          <RegisterForm />
        </main>

        <footer className={styles.footer}>
          <p>© 2025 Relax Map</p>
        </footer>

      </div>
    </div>
  );
}
