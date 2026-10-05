import css from './CreateLocationPage.module.css';
import Container from '@/components/Container/Container';
import CreateLocationClient from './CreateLocation';

export default function CreateLocationPage() {
  return (
    <main className={css.page}>
      <Container>
        <h1 className={css.title}>Додавання нового місця</h1>
        <CreateLocationClient />
      </Container>
    </main>
  );
}
