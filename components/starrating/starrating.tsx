'use client';

import styles from './starrating.module.css';

interface Props {
  value: number; // 0..max, може бути дробовим (наприклад, 3.5)
  max?: number;
  editable?: boolean;
  onChange?: (value: number) => void;
}

type Fill = 'full' | 'half' | 'empty';

const STAR_PATH =
  'M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z';

function Star({ fill }: { fill: Fill }) {
  return (
    <span className={styles.star}>
      <svg className={styles.outline} viewBox="0 0 24 24" aria-hidden="true">
        <path d={STAR_PATH} />
      </svg>
      {fill !== 'empty' && (
        <span
          className={styles.fill}
          style={{ width: fill === 'half' ? '50%' : '100%' }}
        >
          <svg className={styles.solid} viewBox="0 0 24 24" aria-hidden="true">
            <path d={STAR_PATH} />
          </svg>
        </span>
      )}
    </span>
  );
}

// Рейтинг зірками з підтримкою половинок.
// editable=true — інтерактивний вибір цілої оцінки (для форми відгуку).
export default function StarRating({
  value,
  max = 5,
  editable = false,
  onChange,
}: Props) {
  const rounded = Math.round(value * 2) / 2; // округлення до 0.5

  const fillFor = (i: number): Fill => {
    if (rounded >= i + 1) return 'full';
    if (rounded >= i + 0.5) return 'half';
    return 'empty';
  };

  return (
    <div
      className={styles.stars}
      role={editable ? 'radiogroup' : 'img'}
      aria-label={`Рейтинг ${value} з ${max}`}
    >
      {Array.from({ length: max }, (_, i) =>
        editable ? (
          <button
            key={i}
            type="button"
            className={styles.button}
            aria-label={`${i + 1} з ${max}`}
            onClick={() => onChange?.(i + 1)}
          >
            <Star fill={fillFor(i)} />
          </button>
        ) : (
          <Star key={i} fill={fillFor(i)} />
        ),
      )}
    </div>
  );
}
