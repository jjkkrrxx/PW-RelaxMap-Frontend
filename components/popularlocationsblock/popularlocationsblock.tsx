'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { apiClient } from '@/components/utils/api-client';
import LocationCard from '../LocationCard/LocationCard';
import { Location } from '@/types/location';

import 'swiper/css';
import 'swiper/css/navigation';
import styles from './popularlocationsblock.module.css';

export default function PopularLocationsBlock() {
  const { data: locations, isLoading, error } = useQuery<Location[]>({
    queryKey: ['popularLocations'],
    queryFn: async () => {
      const response = await apiClient.get('/locations/popular');
      return response.data;
    },
    retry: 1,
  });

  if (isLoading) {
    return <div className={styles.loading}>Завантаження популярних локацій...</div>;
  }

  const displayLocations = error || !locations || locations.length === 0 
    ? ([
        { 
          _id: '1', 
          name: 'Сонячна Рів’єра', 
          locationType: 'Monе', 
          region: 'Одеська обл.', 
          image: '/images/herosection/herobgmobile.jpg', 
          rate: 5.0, 
          coordinates: { lat: 0, lon: 0 }, 
          reviews: [],
          ownerId: '',
          feedbacksId: ''
        },
        { 
          _id: '2', 
          name: 'Тилігульський Спокій', 
          locationType: 'Лиман', 
          region: 'Миколаївська обл.', 
          image: '/images/herosection/herobgtablet.jpg', 
          rate: 4.8, 
          coordinates: { lat: 0, lon: 0 }, 
          reviews: [],
          ownerId: '',
          feedbacksId: ''
        },
        { 
          _id: '3', 
          name: 'Кінбурнська Вольниця', 
          locationType: 'Море', 
          region: 'Миколаївська обл.', 
          image: '/images/herosection/herobgdesktop.jpg', 
          rate: 4.9, 
          coordinates: { lat: 0, lon: 0 }, 
          reviews: [],
          ownerId: '',
          feedbacksId: ''
        },
        { 
          _id: '4', 
          name: 'Бакотська Затока', 
          locationType: 'Природа', 
          region: 'Хмельницька обл.', 
          image: '/images/herosection/herobgmobile.jpg', 
          rate: 4.7, 
          coordinates: { lat: 0, lon: 0 }, 
          reviews: [],
          ownerId: '',
          feedbacksId: ''
        }
      ] as unknown as Location[])
    : locations;


  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Популярні локації</h2>
          <Link href="/locations" className={styles.allLocationsLink}>
            Всі локації
          </Link>
        </div>

        <div className={styles.sliderWrapper}>
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '#popular-prev',
              nextEl: '#popular-next',
            }}
            loop={true}
            spaceBetween={24}
            slidesPerGroup={1}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1440: { slidesPerView: 3 },
            }}
            className={styles.swiperContainer}
          >
            {displayLocations.map((loc) => (
              <SwiperSlide key={loc._id}>
                <div className={styles.cardCustomizer}>
                  <LocationCard location={loc as unknown as Location} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.controlsWrapper}>
            <button id="popular-prev" className={`${styles.navButton} ${styles.prevButton}`} aria-label="Попередній слайд">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.09502 12.8527L12.5968 18.3542C12.7668 18.5246 12.8527 18.7246 12.8545 18.9542C12.8565 19.1839 12.7726 19.3846 12.6028 19.5563C12.4328 19.7284 12.2322 19.8135 12.001 19.8115C11.7699 19.8095 11.5686 19.7236 11.3973 19.5537L4.44727 12.6037C4.35627 12.5117 4.29011 12.4161 4.24877 12.3167C4.20727 12.2172 4.18652 12.1117 4.18652 12.0002C4.18652 11.8887 4.20727 11.7835 4.24877 11.6845C4.29011 11.5853 4.35627 11.4899 4.44727 11.3983L11.4033 4.44225C11.5791 4.27242 11.7805 4.1875 12.0075 4.1875C12.2344 4.1875 12.4328 4.27242 12.6028 4.44225C12.7726 4.61625 12.8575 4.817 12.8575 5.0445C12.8575 5.27217 12.7726 5.47125 12.6028 5.64175L7.09502 11.1492H19.2978C19.5419 11.1492 19.7459 11.2301 19.9098 11.3917C20.0736 11.5534 20.1555 11.7565 20.1555 12.001C20.1555 12.2455 20.0736 12.4486 19.9098 12.6102C19.7459 12.7719 19.5419 12.8527 19.2978 12.8527H7.09502Z" fill="currentColor" />
              </svg>
            </button>
            <button id="popular-next" className={`${styles.navButton} ${styles.nextButton}`} aria-label="Наступний слайд">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.09502 12.8527L12.5968 18.3542C12.7668 18.5246 12.8527 18.7246 12.8545 18.9542C12.8565 19.1839 12.7726 19.3846 12.6028 19.5563C12.4328 19.7284 12.2322 19.8135 12.001 19.8115C11.7699 19.8095 11.5686 19.7236 11.3973 19.5537L4.44727 12.6037C4.35627 12.5117 4.29011 12.4161 4.24877 12.3167C4.20727 12.2172 4.18652 12.1117 4.18652 12.0002C4.18652 11.8887 4.20727 11.7835 4.24877 11.6845C4.29011 11.5853 4.35627 11.4899 4.44727 11.3983L11.4033 4.44225C11.5791 4.27242 11.7805 4.1875 12.0075 4.1875C12.2344 4.1875 12.4328 4.27242 12.6028 4.44225C12.7726 4.61625 12.8575 4.817 12.8575 5.0445C12.8575 5.27217 12.7726 5.47125 12.6028 5.64175L7.09502 11.1492H19.2978C19.5419 11.1492 19.7459 11.2301 19.9098 11.3917C20.0736 11.5534 20.1555 11.7565 20.1555 12.001C20.1555 12.2455 20.0736 12.4486 19.9098 12.6102C19.7459 12.7719 19.5419 12.8527 19.2978 12.8527H7.09502Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

