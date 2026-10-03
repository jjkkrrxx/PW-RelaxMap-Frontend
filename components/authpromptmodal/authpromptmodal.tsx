'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import Modal from '@/components/Modal/Modal';


export default function AuthPromptModal() {
  const router = useRouter();
  const isClosing = useRef(false);

  const close = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;
    router.back();
  }, [router]);

  return (
    <Modal onClose={close}>
      <h2>Потрібна авторизація</h2>
      <p>
        Щоб виконати цю дію, будь ласка, увійдіть у свій акаунт або
        зареєструйтесь.
      </p>
      <div>
        <Link href="/login">Увійти</Link>
        <Link href="/register">Зареєструватися</Link>
      </div>
    </Modal>
  );
}