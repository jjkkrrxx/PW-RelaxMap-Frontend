'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './profileplaceholder.module.css';

type Props = {
  userId: string;
};

export default function ProfilePlaceholder({ userId }: Props) {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isOwner = isHydrated && user?._id === userId;

  return (
    <div className={styles.wrapper}>
      {isOwner ? (
        <>
          <p className={styles.text}>
            Ви ще нічого не публікували, поділіться своєю першою локацією!
          </p>
          <Link href="/locations/add" className={styles.button}>
            Поділитись локацією
          </Link>
        </>
      ) : (
        <>
          <p className={styles.text}>
            Цей користувач ще не ділився локаціями
          </p>
          <Link href="/locations" className={styles.button}>
            Назад до локацій
          </Link>
        </>
      )}
    </div>
  );
}