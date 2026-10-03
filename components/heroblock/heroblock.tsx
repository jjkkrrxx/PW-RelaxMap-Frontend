'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './heroblock.module.css';

export default function HeroBlock() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const hasError = false; 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push('/locations');
      return;
    }
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    router.push(`/locations?search=${encodedQuery}`);
  };

  return (
    <section className={styles.heroSection}>
      <Image
        src="/images/herosection/herobgmobile.jpg"
        alt="Природа України"
        fill
        priority
        className={`${styles.backgroundImage} ${styles.bgMobile}`}
      />
      <Image
        src="/images/herosection/herobgtablet.jpg"
        alt="Природа України"
        fill
        priority
        className={`${styles.backgroundImage} ${styles.bgTablet}`}
      />
      <Image
        src="/images/herosection/herobgdesktop.jpg"
        alt="Природа України"
        fill
        priority
        className={`${styles.backgroundImage} ${styles.bgDesktop}`}
      />
      
      <div className={styles.overlay}></div>

      <div className={styles.container}>
        <h1 className={styles.title}>
          Відкрий для себе Україну. Знайди ідеальне місце для відпочинку
        </h1>
        <p className={styles.subtitle}>
          Тисячі перевірених локацій з реальними фото та відгуками від мандрівників
        </p>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={`${styles.searchInput} ${hasError ? styles.searchInputError : ''}`}
              placeholder="Введіть назву, тип або регіон..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {hasError && <span className={styles.errorText}>Error text</span>}
          </div>
          <button type="submit" className={styles.searchButton}>
            Знайти місце
          </button>
        </form>
      </div>
    </section>
  );
}





