import { notFound } from 'next/navigation';
import ProfileInfo from '@/components/profileinfo/profileinfo';
import ProfilePlaceholder from '@/components/profileplaceholder/profileplaceholder';
import styles from './page.module.css';

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error('BACKEND_URL не налаштовано в .env.local');
  }

  const userRes = await fetch(`${backendUrl}/api/users/${userId}`, {
    cache: 'no-store',
  });

  if (!userRes.ok) {
    notFound();
  }

  const userJson = await userRes.json();
  const user = userJson.data;

  const locationsRes = await fetch(
  `${backendUrl}/api/users/${userId}/locations?page=1&limit=9`,
  { cache: 'no-store' },
);

if (!locationsRes.ok) {
  notFound();
}

const locationsJson = await locationsRes.json();
const locations = locationsJson.data ?? [];

  return (
    <main className={styles.page}>
      <ProfileInfo
        name={user.name}
        avatar={user.avatar}
        articlesAmount={user.articlesAmount}
      />

      <section className={styles.locations}>
        <h2 className={styles.heading}>Локації</h2>

        {/* TODO: замінити на <LocationsGrid /> коли буде готовий (#8) */}
        {locations.length === 0 ? (
          <ProfilePlaceholder userId={userId} />
        ) : (
          <ul className={styles.grid}>
            {locations.map((loc: { _id: string; name: string }) => (
              <li key={loc._id} className={styles.card}>
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}