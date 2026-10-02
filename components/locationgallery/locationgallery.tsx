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
        unoptimized
        className={styles.image}
      />
    </div>
  );
}
