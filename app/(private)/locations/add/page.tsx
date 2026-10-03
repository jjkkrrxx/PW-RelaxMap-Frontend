import LocationForm from '@/components/LocationForm/LocationForm';
import css from './AddLocationPage.module.css';
import Container from '@/components/Container/Container';

// const editValues: LocationFormValues = {
//   image:
//     'https://static.vecteezy.com/system/resources/thumbnails/083/933/835/small/beautiful-and-inspiring-picture-detailing-a-bright-hot-air-balloon-over-river-pure-cozy-perfect-for-creatives-moods-stock-image-free-photo.jpeg',
//   name: 'Озеро Синевир',
//   locationType: 'zapovidnyk',
//   region: 'volyn',
//   description:
//     'Одне з найвідоміших озер України, популярне туристичне місце в Карпатах.',
//   coordinates: {
//     lat: 48.6174,
//     lon: 23.6898,
//   },
// };

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
