'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import { Icon } from '@/components/Icon/Icon';
import Loader from '@/components/loader/loader';
import LocationCard from '@/components/LocationCard/LocationCard';
import { getPopularLocations } from '@/components/utils/locations';
import { useCategoriesStore } from '@/lib/store/categoriesStore';
import styles from './popularlocationsblock.module.css';

// найбільше карток в одному ряду (десктоп); для безкінечного циклу їх треба удвічі більше
const MAX_SLIDES_PER_VIEW = 3;

// Секція «Популярні локації» на головній сторінці: карусель карток за рейтингом.
export default function PopularLocationsBlock() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['popular-locations'],
    queryFn: getPopularLocations,
  });

  // назви типів локацій для карток — зі спільного store категорій
  const hasHydrated = useCategoriesStore((state) => state.hasHydrated);
  const fetchIfEmpty = useCategoriesStore((state) => state.fetchIfEmpty);

  useEffect(() => {
    void useCategoriesStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (hasHydrated) void fetchIfEmpty();
  }, [hasHydrated, fetchIfEmpty]);

  if (!isLoading && locations.length === 0) {
    return null;
  }

  // безкінечний цикл — коли карток вистачає; інакше стрілки повертають на початок
  const canLoop = locations.length >= MAX_SLIDES_PER_VIEW * 2;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Популярні локації</h2>
          <Link href="/locations" className={styles.allLink}>
            Всі локації
          </Link>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <Loader />
          </div>
        ) : (
          <div className={styles.slider}>
            <Swiper
              // A11y: при переході Tab на картку поза екраном карусель гортає до неї
              modules={[A11y]}
              a11y={{ slideLabelMessage: '{{index}} з {{slidesLength}}' }}
              watchSlidesProgress
              loop={canLoop}
              rewind={!canLoop}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1440: { slidesPerView: MAX_SLIDES_PER_VIEW },
              }}
              onSwiper={setSwiper}
              className={styles.swiper}
            >
              {locations.map((location) => (
                <SwiperSlide key={location._id} className={styles.slide}>
                  <LocationCard location={location} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={styles.controls}>
              <button
                type="button"
                className={styles.arrow}
                aria-label="Попередні локації"
                onClick={() => swiper?.slidePrev()}
              >
                <Icon name="icon-arrow_back" size={24} />
              </button>
              <button
                type="button"
                className={styles.arrow}
                aria-label="Наступні локації"
                onClick={() => swiper?.slideNext()}
              >
                <Icon name="icon-arrow_forward" size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
