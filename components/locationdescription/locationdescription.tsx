import type { LocationDetails } from '@/types/location-details';
import styles from './locationdescription.module.css';

interface Props {
  description: LocationDetails['description'];
}

export default function LocationDescription({ description }: Props) {
  return (
    <div className={styles.wrapper}>
      {description.split(/\r?\n+/).map((paragraph, index) => (
        <p key={index} className={styles.text}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}
