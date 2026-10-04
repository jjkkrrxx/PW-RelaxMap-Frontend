import { Location } from "@/types/location";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import { useCategoriesStore } from "@/lib/store/categoriesStore";
import StarRating from "../starrating/starrating";
import styles from "./LocationCard.module.css";

interface LocationCardProps {
  location: Location;
  isEditable?: boolean;
  // перші картки видно одразу — фото вантажимо з пріоритетом (LCP)
  isPriority?: boolean;
}

const LocationCard = ({
  location,
  isEditable = false,
  isPriority = false,
}: LocationCardProps) => {
  const locationTypes = useCategoriesStore(
    (state) => state.categories?.locationTypes,
  );
  const locationTypeName = locationTypes?.find(
    (item) => item.slug === location.locationType,
  )?.name;

  return (
    <article className={styles.card}>
      <Image
        src={location.image}
        alt={location.name}
        width={420}
        height={420}
        // ширина картки на кожному брейкпоінті — браузер вантажить фото потрібного розміру
        sizes="(min-width: 1440px) 421px, (min-width: 421px) 340px, 335px"
        preload={isPriority}
        className={styles.image}
      />

      <div className={styles.information}>
        <p className={styles.type}>
          {locationTypeName ?? location.locationType}
        </p>

        <div className={styles.rating}>
          <StarRating value={location.rate} />
        </div>

        <h3 className={styles.name}>{location.name}</h3>

        <div className={styles.actions}>
          <Link href={`/locations/${location._id}`} className={styles.viewLink}>
            Переглянути локацію
          </Link>

          {isEditable && (
            <Link
              href={`/locations/${location._id}/edit`}
              className={styles.editLink}
              aria-label={`Редагувати: ${location.name}`}
              title="Редагувати локацію"
            >
              <Icon name="icon-edit" size={20} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default LocationCard;
