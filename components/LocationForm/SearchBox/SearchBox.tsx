'use client';

import css from './SearchBox.module.css';
import { useEffect, useRef, useCallback } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import Button from '../Button/Button';

interface SearchBoxProps {
  onSelect: (coords: { lat: number; lon: number }) => void;
  id?: string;
  resetSignal?: number;
}

export default function SearchBox({
  onSelect,
  id,
  resetSignal,
}: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const map = useMap();
  const places = useMapsLibrary('places');

  const handleLocation = useCallback(
    (location: google.maps.LatLng) => {
      const lat = location.lat();
      const lon = location.lng();

      onSelect({ lat, lon });

      map?.panTo({ lat, lng: lon });
      map?.setZoom(15);
    },
    [map, onSelect]
  );

  useEffect(() => {
    if (!places || !map || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'formatted_address'],
    });

    autocomplete.bindTo('bounds', map);

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry?.location) return;

      handleLocation(place.geometry.location);
    });

    return () => listener.remove();
  }, [places, map, handleLocation]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [resetSignal]);

  const handleSearch = () => {
    if (!places || !map || !inputRef.current?.value) return;

    const service = new places.PlacesService(map);

    service.findPlaceFromQuery(
      {
        query: inputRef.current.value,
        fields: ['geometry'],
      },
      (results, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !results?.length
        ) {
          return;
        }

        const location = results[0].geometry?.location;

        if (!location) return;

        handleLocation(location);
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={css.wrapper}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Пошук місця..."
        className={css.input}
        id={id}
        onKeyDown={handleKeyDown}
      />

      <Button
        type="button"
        secondary
        className={css.button}
        onClick={handleSearch}
      >
        Пошук
      </Button>
    </div>
  );
}
