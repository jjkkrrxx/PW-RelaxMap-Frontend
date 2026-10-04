'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/loader/loader';
import { useAuthStore } from '@/lib/store/authStore';

// «Мій Профіль»: дізнаємося id поточного юзера й відкриваємо його профіль.
// Гостя сюди не пустить proxy.ts, але про всяк випадок — на вхід.
export default function OwnProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    if (user) {
      router.replace(`/profile/${user._id}`);
    } else {
      router.replace('/login?from=/profile');
    }
  }, [isHydrated, user, router]);

  return <Loader fullscreen />;
}
