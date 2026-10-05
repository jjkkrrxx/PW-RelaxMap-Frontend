import Link from 'next/link';
import ReviewsBlock from '@/components/reviewsblock/reviewsblock';
import styles from './reviewssection.module.css';

type Review = {
  _id: string;
  userName: string;
  rate: number;
  description: string;
  createdAt: string;
};

type Props = {
  reviews: Review[];
  addReviewHref: string;
};

// Секція «Відгуки» на сторінці локації.
// Заголовок і кнопка є завжди; свайпер — лише коли є хоча б один відгук.
export default function ReviewsSection({ reviews, addReviewHref }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Відгуки</h2>
          <Link href={addReviewHref} className={styles.addButton}>
            Залишити відгук
          </Link>
        </div>
        {reviews.length > 0 && <ReviewsBlock reviews={reviews} />}
      </div>
    </section>
  );
}
