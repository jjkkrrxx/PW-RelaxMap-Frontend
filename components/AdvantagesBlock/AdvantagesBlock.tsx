import Container from '../Container/Container';
import AdvantageCard from './AdvantageCard/AdvantageCard';
import css from './AdvantagesBlock.module.css';

const advantages = [
  {
    iconName: 'select_check_box',
    title: 'Реальні відгуки',
    text: 'Користувачі діляться чесними враженнями, щоб ви робили правильний вибір.',
  },
  {
    iconName: 'filter_alt',
    title: 'Зручні фільтри',
    text: 'Шукайте за типом локації, регіоном, наявністю зручностей та іншими критеріями.',
  },
  {
    iconName: 'communication',
    title: 'Спільнота мандрівників',
    text: 'Додавайте власні улюблені місця та діліться своїми неймовірними знахідками.',
  },
];

function AdvantagesBlock() {
  return (
    <section className={css.section}>
      <Container>
        <h2 className={css.title}>Ключові переваги</h2>
        <ul className={css.list}>
          {advantages.map(advantage => (
            <AdvantageCard key={advantage.title} {...advantage} />
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default AdvantagesBlock;
