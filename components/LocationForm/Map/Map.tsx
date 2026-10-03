'use client';

import { useEffect } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
} from '@vis.gl/react-google-maps';
import css from './Map.module.css';
import SearchBox from '../SearchBox/SearchBox';

interface Coordinates {
  lat: number | null;
  lon: number | null;
}

interface MapProps {
  coordinates: Coordinates;
  searchable?: boolean;
  onCoordinatesChange?: (coords: { lat: number; lon: number }) => void;
  id?: string;
}

const defaultCenter = {
  lat: 49,
  lng: 31,
};

function MapContent({
  coordinates,
  searchable,
  onCoordinatesChange,
  id,
}: MapProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || coordinates.lat === null || coordinates.lon === null) return;

    map.panTo({
      lat: coordinates.lat,
      lng: coordinates.lon,
    });

    map.setZoom(15);
  }, [map, coordinates.lat, coordinates.lon]);

  const markerPosition =
    coordinates.lat !== null && coordinates.lon !== null
      ? {
          lat: coordinates.lat,
          lng: coordinates.lon,
        }
      : null;

  return (
    <>
      {searchable && onCoordinatesChange && (
        <SearchBox onSelect={onCoordinatesChange} id={id} />
      )}

      <GoogleMap
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        className={css.map}
        defaultCenter={defaultCenter}
        defaultZoom={6}
        gestureHandling="greedy"
      >
        {markerPosition && <AdvancedMarker position={markerPosition} />}
      </GoogleMap>
    </>
  );
}

export default function Map(props: MapProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <MapContent {...props} />
    </APIProvider>
  );
}
