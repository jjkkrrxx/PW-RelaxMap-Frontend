import { Location } from "@/types/location";
import Image from "next/image";
import Link from "next/link";
import StarRating from "../starrating/starrating";

interface LocationCardProps {
  location: Location;
  isEditable?: boolean;
}

const LocationCard = ({ location, isEditable = false }: LocationCardProps) => {
  return (
    <div>
      <Image
        src={location.image}
        alt={location.name}
        width={420}
        height={420}
      />

      <p>{location.locationType}</p>

      <StarRating value={location.rate} />

      <h3>{location.name}</h3>

      <Link href={`/locations/${location._id}`}>Переглянути локацію</Link>

      {isEditable && (
        <Link href={`/locations/${location._id}/edit`}>Редагувати</Link>
      )}
    </div>
  );
};

export default LocationCard;
