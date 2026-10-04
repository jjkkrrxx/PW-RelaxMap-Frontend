import Container from '@/components/Container/Container';

import css from './EditLocationPage.module.css';
import { getLocation } from '@/components/utils/locationForm';
import EditLocationClient from './EditLocationPage';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/components/utils/serverAuth';

interface EditLocationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const { id } = await params;

  let data;

  try {
    ({ data } = await getLocation(id));
  } catch {
    notFound();
  }

  const user = await getCurrentUser();

  // ownerId може бути null, якщо автора локації видалено — тоді редагувати нікому.
  // redirect — поза try/catch: він працює через виняток, і catch його б перехопив
  if (!user || user._id !== data.ownerId?._id) {
    redirect(`/locations/${id}`);
  }

  return (
    <main className={css.page}>
      <Container>
        <h1 className={css.title}>Редагування місця</h1>
        <EditLocationClient
          id={id}
          data={{
            image: data.image,
            name: data.name,
            locationType: data.locationType,
            region: data.region,
            description: data.description,
            coordinates: data.coordinates ?? {
              lat: null,
              lon: null,
            },
          }}
        />
      </Container>
    </main>
  );
}
