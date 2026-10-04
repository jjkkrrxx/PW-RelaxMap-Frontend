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
const newLocationRef = useRef<HTMLLIElement | null>(null);
const lastLocationIdRef = useRef<string | null>(null);

useEffect(() => {
  if (locations.length > 0) {
    const lastLocation = locations[locations.length - 1];
    if (lastLocation._id !== lastLocationIdRef.current) {
      lastLocationIdRef.current = lastLocation._id;
      newLocationRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}, [locations]);

  return (
    <div>
      <ul>
        {locations.map((location) => (
          <li
            key={location._id}
            ref={(element) => {
              if (location._id === lastLocationIdRef.current) {
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
