'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal/Modal';
import AddReviewForm from '@/components/addreviewform/addreviewform';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './addreviewmodal.module.css';

interface Props {
  locationId: string;
  // true — модалку відкрито переходом зі сторінки локації (перехоплений маршрут)
  intercepted?: boolean;
}

// Модальне вікно «Залишити відгук» на паралельному маршруті (учасник №12).
// Закриття (бекдроп, хрестик, Escape, «Відмінити», успіх) повертає на сторінку локації.
export default function AddReviewModal({ locationId, intercepted = false }: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  // закриваємо лише раз: повторний router.back() повів би на попередню сторінку
  const isClosing = useRef(false);

  const close = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;

    if (intercepted) {
      // відкрито зі сторінки — повертаємось назад, без зайвого запису в історії
      router.back();
    } else {
      // прямий захід за адресою — попередньої сторінки сайту в історії немає
      router.replace(`/locations/${locationId}`, { scroll: false });
    }
  }, [router, locationId, intercepted]);

  const isGuest = isHydrated && !isAuthenticated;

  // Гість: поки немає AuthPromptModal (задача №7) — повідомлення і повернення на сторінку
  useEffect(() => {
    if (!isGuest) return;
    toast.error('Щоб залишити відгук, увійдіть в акаунт', {
      id: 'review-auth-required',
    });
    close();
  }, [isGuest, close]);

  // до перевірки сесії не знаємо, гість чи ні — нічого не показуємо
  if (!isHydrated || !isAuthenticated || !user) {
    return null;
  }

  return (
    <Modal onClose={close}>
      <div className={styles.content}>
        <h2 className={styles.title}>Залишити відгук</h2>
        <AddReviewForm
          locationId={locationId}
          userName={user.name}
          onSuccess={close}
          onCancel={close}
        />
      </div>
    </Modal>
  );
}
