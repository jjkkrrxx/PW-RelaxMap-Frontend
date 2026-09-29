import Image from 'next/image';

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
    <div className="profile-info">
      <Image
        src={avatar}
        alt={name}
        width={120}
        height={120}
        className="profile-info__avatar"
      />
      <div className="profile-info__text">
        <h1 className="profile-info__name">{name}</h1>
        <p className="profile-info__count">
          Опубліковано локацій: {articlesAmount}
        </p>
      </div>
    </div>
  );
}