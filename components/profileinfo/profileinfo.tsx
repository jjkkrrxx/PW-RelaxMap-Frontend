import Image from 'next/image';
import styles from './profileinfo.module.css';

type ProfileInfoProps = {
  name: string;
  avatar: string;
  articlesAmount: number;
};

export default function ProfileInfo({
  name,
  avatar,
  articlesAmount,
}: ProfileInfoProps) {
  return (
    <div className={styles.wrapper}>
      <Image
        src={avatar}
        alt={name}
        width={145}
        height={145}
        className={styles.avatar}
        priority
      />
      <div className={styles.info}>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.count}>Статей: {articlesAmount}</p>
      </div>
    </div>
  );
}