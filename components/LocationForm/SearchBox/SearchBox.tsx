'use client';

import css from './SearchBox.module.css';
import { useEffect, useRef } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import Button from '../Button/Button';

interface SearchBoxProps {
  onSelect: (coords: { lat: number; lon: number }) => void;
  id?: string;
}

export default function SearchBox({ onSelect, id }: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const map = useMap();
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !map || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'formatted_address'],
    });

    autocomplete.bindTo('bounds', map);

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lon = place.geometry.location.lng();

      onSelect({
        lat,
        lon,
      });

      map.panTo({
        lat,
        lng: lon,
      });

      map.setZoom(15);
    });

    return () => listener.remove();
  }, [places, map, onSelect]);

  return (
    <div className={css.wrapper}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Пошук місця..."
        className={css.input}
        id={id}
      />

      <Button type="button" secondary className={css.button}>
        Пошук
      </Button>
    </div>
  );
}
