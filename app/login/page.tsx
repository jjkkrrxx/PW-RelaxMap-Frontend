'use client';

import React, { Suspense } from 'react';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import styles from './page.module.css';

export default function AuthPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authCard}>
        <header className={styles.header}>
          <svg className={styles.logoIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
            <path d="M9 3v15M15 6v15" />
          </svg>
          <span className={styles.logoText}>Relax Map</span>
        </header>

        <main className={styles.main}>
          <h1 className={styles.formTitle}>Вхід</h1>
          <Suspense fallback={<div>Завантаження...</div>}>
            <LoginForm />
          </Suspense>
        </main>

        <footer className={styles.footer}>
          <p>© 2025 Relax Map</p>
        </footer>
      </div>
    </div>
  );
}
