'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import styles from './heroblock.module.css';

export default function HeroBlock() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasError, setHasError] = useState(false); 
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setHasError(true);
      return;
    }
    setHasError(false);
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    router.push(`/locations?search=${encodedQuery}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (hasError) setHasError(false);
  };

  return (
    <section className={styles.heroSection}>

      <picture>
        <source media="(min-width: 1440px)" srcSet="/images/herosection/herobgdesktop.jpg" />
        <source media="(min-width: 768px)" srcSet="/images/herosection/herobgtablet.jpg" />
        <Image 
          src="/images/herosection/herobgmobile.jpg" 
          alt="" 
          fill 
          sizes="100vw"
          priority={true} 
          className={styles.backgroundImage} 
        />
      </picture>
      
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
              onChange={handleInputChange}
              aria-label="Пошук місць" 
            />
            {hasError && <span className={styles.errorText}>Введіть назву, тип або регіон для пошуку</span>}
          </div>
          <button type="submit" className={styles.searchButton}>
            Знайти місце
          </button>
        </form>
      </div>
    </section>
  );
}








