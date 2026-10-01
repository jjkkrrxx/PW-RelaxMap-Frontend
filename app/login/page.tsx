'use client';

import React, { useState, useEffect } from 'react';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import styles from './page.module.css';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    const isRegister = window.location.pathname.includes('register');
    setActiveTab(isRegister ? 'register' : 'login');
  }, []);

  const handleTabChange = (tabName: 'register' | 'login') => {
    setActiveTab(tabName);
    window.history.pushState(null, '', `/${tabName}`);
  };

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

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              type="button" 
              className={styles.tab} 
              onClick={() => handleTabChange('register')}
            >
              Реєстрація
            </button>
            <button 
              type="button" 
              className={styles.tab} 
              onClick={() => handleTabChange('login')}
            >
              Вхід
            </button>
          </div>
          <div className={`${styles.tabsLine} ${activeTab === 'login' ? styles.lineLogin : styles.lineRegister}`}></div>
        </div>

        <main className={styles.main}>
          <h1 className={styles.formTitle}>
            {activeTab === 'login' ? 'Вхід' : 'Реєстрація'}
          </h1>
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </main>

        <footer className={styles.footer}>
          <p>© 2025 Relax Map</p>
        </footer>

      </div>
    </div>
  );
}
