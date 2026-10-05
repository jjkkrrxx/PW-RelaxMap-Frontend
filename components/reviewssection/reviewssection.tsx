import Link from 'next/link';
import ReviewsBlock from '@/components/reviewsblock/reviewsblock';
import type { Review } from '@/components/utils/feedbacks';
import styles from './reviewssection.module.css';

interface Props {
  reviews: Review[];
  // Адреса паралельного маршруту з модалкою відгуку, напр. /locations/[id]/review
  addReviewHref: string;
}

// Секція «Відгуки» на сторінці локації (учасник №12).
// Заголовок і кнопка є завжди; свайпер — лише коли є хоча б один відгук.
export default function ReviewsSection({ reviews, addReviewHref }: Props) {
  // найновіші — першими: щойно доданий відгук одразу видно в каруселі
  const newestFirst = [...reviews].reverse();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.head}>
          <h2 className={styles.title}>Відгуки</h2>
          <Link href={addReviewHref} scroll={false} className={styles.button}>
            Залишити відгук
          </Link>
        </div>
        {newestFirst.length > 0 && <ReviewsBlock reviews={newestFirst} />}
      </div>
    </section>
  );
}
