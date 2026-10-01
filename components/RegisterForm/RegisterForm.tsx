'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button'; 
import styles from './RegisterForm.module.css';

export const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentErrors = { name: '', email: '', password: '' };
    let hasError = false;

    if (!name.trim()) {
      currentErrors.name = "Будь ласка, введіть ваше ім'я";
      hasError = true;
    }
    if (!email.trim()) {
      currentErrors.email = 'Будь ласка, введіть почту';
      hasError = true;
    }
    if (!password.trim()) {
      currentErrors.password = 'Будь ласка, введіть пароль';
      hasError = true;
    } else if (password.length < 6) {
      currentErrors.password = 'Пароль має містити щонайменше 6 символів';
      hasError = true;
    }

    if (hasError) {
      setErrors(currentErrors);
      return;
    }

    setIsLoading(true);
    setErrors({ name: '', email: '', password: '' });

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка реєстрації');
      }

      router.push('/profile');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Помилка реєстрації. Спробуйте ще раз';
      setErrors(prev => ({ ...prev, password: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>Ім'я*</label>
        <input
          id="name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
          }}
          placeholder="Ваше ім'я"
          disabled={isLoading}
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>Пошта*</label>
        <input
          id="email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
          }}
          placeholder="hello@relaxmap.ua"
          disabled={isLoading}
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>Пароль*</label>
        <input
          id="password"
          type="password"
          className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
          }}
          placeholder="********"
          disabled={isLoading}
        />
        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
      </div>

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Реєстрація...' : 'Зареєструватись'}
      </Button>
    </form>
  );
};

export default RegisterForm;
