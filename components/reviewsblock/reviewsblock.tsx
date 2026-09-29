'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import StarRating from '@/components/starrating/starrating';
import type { Review } from '@/components/utils/feedbacks';
import styles from './reviewsblock.module.css';

interface Props {
  reviews: Review[];
  // На головній «Останні відгуки» показуємо назву локації; на деталі — ні.
  showLocation?: boolean;
}

export default function ReviewsBlock({ reviews, showLocation = false }: Props) {
  if (!reviews?.length) {
    return null;
  }

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        768: { slidesPerView: 2 },
        1440: { slidesPerView: 3 },
      }}
      className={styles.swiper}
    >
      {reviews.map((review) => (
        <SwiperSlide key={review._id}>
          <article className={styles.card}>
            <StarRating value={review.rate} />
            <p className={styles.text}>{review.description}</p>
            <p className={styles.author}>{review.userName}</p>
            {showLocation && review.locationId?.name && (
              <p className={styles.location}>{review.locationId.name}</p>
            )}
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
