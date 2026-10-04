'use client';

import { useEffect, useRef } from 'react';
import { Location } from '@/types/location';
import LocationCard from '../LocationCard/LocationCard';

interface LocationGridProps {
  locations: Location[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  isEditable?: boolean;
}

const LocationGrid = ({
  locations,
  hasMore,
  isLoading,
  onLoadMore,
  isEditable = false,
}: LocationGridProps) => {
  const previousLengthRef = useRef(locations.length);
  const newLocationRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (locations.length > previousLengthRef.current) {
      newLocationRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    previousLengthRef.current = locations.length;
  }, [locations]);

  return (
    <div>
      <ul>
        {locations.map((location, index) => (
          <li
            key={location._id}
            ref={(element) => {
              if (index === previousLengthRef.current) {
                newLocationRef.current = element;
              }
            }}
          >
            <LocationCard location={location} isEditable={isEditable} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <button type="button" onClick={onLoadMore} disabled={isLoading}>
          {isLoading ? 'Завантаження...' : 'Показати ще'}
        </button>
      )}
    </div>
  );
};

export default LocationGrid;
