import { Icon } from '@/components/Icon/Icon';
import css from './AdvantageCard.module.css';

interface AdvantageCardProps {
  iconName: string;
  title: string;
  text: string;
}

// <li> — картки лежать у <ul> блоку переваг
function AdvantageCard({ iconName, title, text }: AdvantageCardProps) {
  return (
    <li className={css.card}>
      <Icon className={css.icon} size={64} name={`icon-${iconName}`} />
      <h3 className={css.title}>{title}</h3>
      <p className={css.text}>{text}</p>
    </li>
  );
}

export default AdvantageCard;
