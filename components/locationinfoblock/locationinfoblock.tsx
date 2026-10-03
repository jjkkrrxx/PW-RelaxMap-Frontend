'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import StarRating from '@/components/starrating/starrating';
import { useCategoriesStore } from '@/lib/store/categoriesStore';
import type { LocationDetails } from '@/types/location-details';
import styles from './locationinfoblock.module.css';

interface Props {
  location: LocationDetails;
}

export default function LocationInfoBlock({ location }: Props) {
  const { name, region, locationType, rate, ownerId } = location;
  const categories = useCategoriesStore(state => state.categories);
  const hasHydrated = useCategoriesStore(state => state.hasHydrated);
  const fetchIfEmpty = useCategoriesStore(state => state.fetchIfEmpty);

  useEffect(() => {
    if (!useCategoriesStore.persist.hasHydrated()) {
      void useCategoriesStore.persist.rehydrate();
    }
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      void fetchIfEmpty();
    }
  }, [fetchIfEmpty, hasHydrated]);

  const regionName =
    categories?.regions.find(item => item.slug === region)?.name ?? region;
  const locationTypeName =
    categories?.locationTypes.find(item => item.slug === locationType)?.name ??
    locationType;

  return (
    <div className={styles.info}>
      <div className={styles.rating}>
        <StarRating value={rate} />
        <span className={styles.separator} aria-hidden="true" />
        <span className={styles.rate}>{rate.toFixed(1)}</span>
      </div>

      <h1 className={styles.title}>{name}</h1>

      <dl className={styles.meta}>
        <div className={styles.row}>
          <dt className={styles.label}>Регіон:</dt>
          <dd className={styles.value}>{regionName}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Тип локації:</dt>
          <dd className={styles.value}>{locationTypeName}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Автор статті:</dt>
          <dd className={styles.value}>
            {ownerId ? (
              <Link href={`/profile/${ownerId._id}`} className={styles.author}>
                {ownerId.name}
              </Link>
            ) : (
              'Автор недоступний'
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
