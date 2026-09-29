'use client';

import styles from './starrating.module.css';

interface Props {
  value: number; // 0..max
  max?: number;
  editable?: boolean;
  onChange?: (value: number) => void;
}

// Рейтинг зірками. editable=true — інтерактивний вибір (для форми відгуку).
export default function StarRating({
  value,
  max = 5,
  editable = false,
  onChange,
}: Props) {
  return (
    <div
      className={styles.stars}
      role={editable ? 'radiogroup' : 'img'}
      aria-label={`Рейтинг ${value} з ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value);
        const symbol = filled ? '★' : '☆';

        if (editable) {
          return (
            <button
              key={i}
              type="button"
              className={styles.star}
              aria-label={`${i + 1} з ${max}`}
              onClick={() => onChange?.(i + 1)}
            >
              {symbol}
            </button>
          );
        }

        return (
          <span key={i} className={styles.star} aria-hidden="true">
            {symbol}
          </span>
        );
      })}
    </div>
  );
}
