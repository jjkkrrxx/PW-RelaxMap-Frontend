import { notFound } from 'next/navigation';
import ProfileInfo from '@/components/profileinfo/profileinfo';

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
    `${backendUrl}/api/users/${userId}/locations?page=1&limit=6`,
    { cache: 'no-store' },
  );
  const locationsJson = await locationsRes.json();
  const locations = locationsJson.data ?? [];

  return (
    <main>
      <ProfileInfo
        name={user.name}
        avatar={user.avatar}
        articlesAmount={user.articlesAmount}
      />

      <section>
        <h2>Локації користувача</h2>

        {/* TODO: замінити на <LocationsGrid /> коли буде готовий (#8) */}
        {locations.length === 0 ? (
          <p>Користувач ще не ділився локаціями</p>
        ) : (
          <ul>
            {locations.map((loc: { _id: string; name: string }) => (
              <li key={loc._id}>{loc.name}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}