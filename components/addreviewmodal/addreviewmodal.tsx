'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
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
// Гостя перенаправляємо на модалку-запрошення до авторизації (AuthPromptModal).
export default function AddReviewModal({ locationId, intercepted = false }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  // Відгук додано: закриваємо модалку й перезапитуємо дані сторінки локації —
  // список відгуків і загальний рейтинг оновлюються без перезавантаження.
  const handleSuccess = useCallback(() => {
    close();
    router.refresh();
    // блоки головної («Останні відгуки», «Популярні локації») теж мають побачити зміни
    void queryClient.invalidateQueries({ queryKey: ['last-reviews'] });
    void queryClient.invalidateQueries({ queryKey: ['popular-locations'] });
  }, [close, router, queryClient]);

  const isGuest = isHydrated && !isAuthenticated;

  // Гість: замість форми — AuthPromptModal на сусідньому паралельному маршруті.
  // replace, щоб «Назад» із неї повертав на сторінку локації, а не на форму
  useEffect(() => {
    if (!isGuest || isClosing.current) return;
    isClosing.current = true;
    router.replace(`/locations/${locationId}/auth-prompt`, { scroll: false });
  }, [isGuest, router, locationId]);

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
          onSuccess={handleSuccess}
          onCancel={close}
        />
      </div>
    </Modal>
  );
}
