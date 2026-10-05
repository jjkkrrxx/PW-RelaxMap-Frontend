'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import StarRating from '@/components/starrating/starrating';
import type { Review } from '@/components/utils/feedbacks';
import styles from './reviewsblock.module.css';

interface Props {
  reviews: Review[];
  // На головній «Останні відгуки» показуємо назву локації; на деталі — ні.
  showLocation?: boolean;
}

// Іконки arrow_back і arrow_forward з макета Figma (24×24).
const ARROW_BACK =
  'M7.09502 12.8518L12.5968 18.3533C12.7668 18.5236 12.8527 18.7236 12.8545 18.9533C12.8565 19.1829 12.7726 19.3836 12.6028 19.5553C12.4328 19.7274 12.2322 19.8125 12.001 19.8105C11.7699 19.8085 11.5686 19.7226 11.3973 19.5528L4.44727 12.6028C4.35627 12.5108 4.29011 12.4151 4.24877 12.3158C4.20727 12.2163 4.18652 12.1108 4.18652 11.9993C4.18652 11.8878 4.20727 11.7825 4.24877 11.6835C4.29011 11.5844 4.35627 11.4889 4.44727 11.3973L11.4033 4.44127C11.5791 4.27144 11.7805 4.18652 12.0075 4.18652C12.2344 4.18652 12.4328 4.27144 12.6028 4.44127C12.7726 4.61527 12.8575 4.81602 12.8575 5.04352C12.8575 5.27119 12.7726 5.47027 12.6028 5.64077L7.09502 11.1483H19.2978C19.5419 11.1483 19.7459 11.2291 19.9098 11.3908C20.0736 11.5524 20.1555 11.7555 20.1555 12C20.1555 12.2445 20.0736 12.4476 19.9098 12.6093C19.7459 12.7709 19.5419 12.8518 19.2978 12.8518H7.09502Z';

const ARROW_FORWARD =
  'M16.9051 12.8517H4.70234C4.45767 12.8517 4.25459 12.7709 4.09309 12.6092C3.93142 12.4476 3.85059 12.2445 3.85059 12C3.85059 11.7555 3.93142 11.5524 4.09309 11.3907C4.25459 11.2291 4.45767 11.1482 4.70234 11.1482H16.9051L11.4033 5.64674C11.2333 5.47674 11.1473 5.27649 11.1451 5.04599C11.1428 4.81532 11.2267 4.61457 11.3968 4.44374C11.5672 4.27224 11.7679 4.18749 11.9991 4.18949C12.2303 4.19149 12.4315 4.2774 12.6028 4.44724L19.5528 11.3972C19.6438 11.4892 19.71 11.5849 19.7513 11.6842C19.7928 11.7837 19.8136 11.8892 19.8136 12.0007C19.8136 12.1122 19.7928 12.2175 19.7513 12.3165C19.71 12.4157 19.6438 12.5111 19.5528 12.6027L12.5968 19.5527C12.421 19.7266 12.2196 19.8135 11.9926 19.8135C11.7658 19.8135 11.5673 19.7261 11.3973 19.5512C11.2275 19.3811 11.1426 19.1823 11.1426 18.955C11.1426 18.7278 11.2275 18.5292 11.3973 18.3592L16.9051 12.8517Z';

export default function ReviewsBlock({ reviews, showLocation = false }: Props) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!reviews?.length) {
    return null;
  }

  const updateEdges = (s: SwiperInstance) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  return (
    <div className={styles.wrapper}>
      <Swiper
        // A11y: при переході Tab на картку поза екраном карусель гортає до неї
        modules={[A11y]}
        a11y={{ slideLabelMessage: '{{index}} з {{slidesLength}}' }}
        watchSlidesProgress
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1440: { slidesPerView: 3 },
        }}
        onSwiper={(s) => {
          setSwiper(s);
          updateEdges(s);
        }}
        onSlideChange={updateEdges}
        onBreakpoint={updateEdges}
        // відгуків стало більше чи менше — стан стрілок перераховуємо
        onSlidesLengthChange={updateEdges}
        className={styles.swiper}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id} className={styles.slide}>
            <article className={styles.card}>
              <StarRating value={review.rate} />
              <p className={styles.text}>{review.description}</p>
              <div className={styles.meta}>
                <p className={styles.author}>{review.userName}</p>
                {showLocation && review.locationId?.name && (
                  <Link
                    href={`/locations/${review.locationId._id}`}
                    className={styles.location}
                  >
                    {review.locationId.name}
                  </Link>
                )}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Попередні відгуки"
          disabled={isBeginning}
          onClick={() => swiper?.slidePrev()}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={ARROW_BACK} />
          </svg>
        </button>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Наступні відгуки"
          disabled={isEnd}
          onClick={() => swiper?.slideNext()}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={ARROW_FORWARD} />
          </svg>
        </button>
      </div>
    </div>
  );
}
