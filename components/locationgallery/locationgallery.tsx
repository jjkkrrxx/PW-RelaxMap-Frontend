import Image from 'next/image';
import type { LocationDetails } from '@/types/location-details';
import styles from './locationgallery.module.css';

type Props = Pick<LocationDetails, 'image' | 'name'>;

export default function LocationGallery({ image, name }: Props) {
  if (!image) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      <Image
        src={image}
        alt={`Фото локації ${name}`}
        fill
        sizes="(min-width: 1440px) 755px, (min-width: 768px) 704px, 335px"
        preload
        className={styles.image}
      />
    </div>
  );
}
