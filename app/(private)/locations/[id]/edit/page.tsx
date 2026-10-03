import Container from '@/components/Container/Container';
import LocationForm from '@/components/LocationForm/LocationForm';

import css from './EditLocationPage.module.css';
import { getLocation } from '@/components/utils/locationForm';
import { notFound } from 'next/navigation';

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

  return (
    <main className={css.page}>
      <Container>
        <h2 className={css.title}>Редагування місця</h2>
        <LocationForm edit values={data} />
      </Container>
    </main>
  );
}
