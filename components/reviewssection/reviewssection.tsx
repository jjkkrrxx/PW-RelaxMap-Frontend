'use client';

import ReviewsBlock from '@/components/reviewsblock/reviewsblock';
import type { Review } from '@/components/utils/feedbacks';
import styles from './reviewssection.module.css';

interface Props {
  reviews: Review[];
  onAddReview: () => void;
}

// Секція «Відгуки» на сторінці локації (учасник №12).
// Заголовок і кнопка є завжди; свайпер — лише коли є хоча б один відгук.
export default function ReviewsSection({ reviews, onAddReview }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.head}>
          <h2 className={styles.title}>Відгуки</h2>
          <button type="button" className={styles.button} onClick={onAddReview}>
            Залишити відгук
          </button>
        </div>
        {reviews.length > 0 && <ReviewsBlock reviews={reviews} />}
      </div>
    </section>
  );
}
