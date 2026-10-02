'use client';

import { useRef } from 'react';
import { Icon } from '@/components/Icon/Icon';
import styles from './starrating.module.css';

interface Props {
  value: number; // 0..max, може бути дробовим (наприклад, 3.5)
  max?: number;
  editable?: boolean;
  onChange?: (value: number) => void;
  size?: 24 | 32; // у формі відгуку зірки 32×32
}

type Fill = 'full' | 'half' | 'empty';

// Іконки зі спільного спрайта (макет Figma): повна, половина, невибрана.
const ICONS: Record<Fill, string> = {
  full: 'icon-star_filled',
  half: 'icon-star_half',
  empty: 'icon-star_rate',
};

// Рейтинг зірками з підтримкою половинок.
// editable=true — інтерактивний вибір цілої оцінки (для форми відгуку).
export default function StarRating({
  value,
  max = 5,
  editable = false,
  onChange,
  size = 24,
}: Props) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const rounded = Math.round(value * 2) / 2; // округлення до 0.5

  const fillFor = (i: number): Fill => {
    if (rounded >= i + 1) return 'full';
    if (rounded >= i + 0.5) return 'half';
    return 'empty';
  };

  const star = (i: number) => (
    <Icon name={ICONS[fillFor(i)]} size={size} className={styles.star} />
  );

  if (!editable) {
    return (
      <div
        className={styles.stars}
        role="img"
        aria-label={`Рейтинг ${value} з ${max}`}
      >
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={styles.item}>
            {star(i)}
          </span>
        ))}
      </div>
    );
  }

  const select = (next: number) => {
    onChange?.(next);
    buttons.current[next - 1]?.focus();
  };

  // Стрілки — як у радіогрупі: ←/↓ попередня оцінка, →/↑ наступна
  const handleKeyDown = (event: React.KeyboardEvent, i: number) => {
    const current = i + 1;
    let next = current;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      next = current === max ? 1 : current + 1;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      next = current === 1 ? max : current - 1;
    } else {
      return;
    }

    event.preventDefault();
    select(next);
  };

  // у Tab-порядку лише вибрана зірка (або перша, якщо оцінку ще не обрано)
  const tabStop = rounded >= 1 ? Math.floor(rounded) : 1;

  return (
    <div className={styles.stars} role="radiogroup" aria-label="Оцінка">
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          ref={(el) => {
            buttons.current[i] = el;
          }}
          type="button"
          className={styles.button}
          role="radio"
          aria-checked={rounded === i + 1}
          aria-label={`${i + 1} з ${max}`}
          tabIndex={tabStop === i + 1 ? 0 : -1}
          onClick={() => onChange?.(i + 1)}
          onKeyDown={(event) => handleKeyDown(event, i)}
        >
          {star(i)}
        </button>
      ))}
    </div>
  );
}
