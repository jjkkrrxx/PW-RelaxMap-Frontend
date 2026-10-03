import LocationForm from '@/components/LocationForm/LocationForm';
import css from './AddLocationPage.module.css';
import Container from '@/components/Container/Container';

export default function AddLocationPage() {
  return (
    <main className={css.page}>
      <Container>
        <h2 className={css.title}>Додавання нового місця</h2>
        <LocationForm />
      </Container>
    </main>
  );
}
