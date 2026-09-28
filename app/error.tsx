'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Щось пішло не так!</h2>
      <p className={styles.message}>Сталася непередбачувана помилка при завантаженні сторінки.</p>
      <button onClick={() => reset()} className={styles.button}>
        Спробувати знову
      </button>
    </div>
  );
}
