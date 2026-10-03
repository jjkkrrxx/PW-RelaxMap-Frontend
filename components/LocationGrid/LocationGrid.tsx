"use client";

import { useEffect, useRef, useState } from "react";
import { Location } from "@/types/location";
import { getUserLocations } from "@/components/utils/locations";
import LocationCard from "../LocationCard/LocationCard";

interface LocationGridProps {
  userId: string;
  isEditable?: boolean;
}

const LocationGrid = ({ userId, isEditable = false }: LocationGridProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [newLocationId, setNewLocationId] = useState<string | null>(null);

  const newLocationRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);

      try {
        const response = await getUserLocations(userId, 1, 9);

        setLocations(response.data);
        setPage(response.page);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [userId]);

  useEffect(() => {
    if (!newLocationId) {
      return;
    }

    newLocationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [locations, newLocationId]);

  const handleLoadMore = async () => {
    if (isLoading || page >= totalPages) {
      return;
    }

    const nextPage = page + 1;

    setIsLoading(true);

    try {
      const response = await getUserLocations(userId, nextPage, 9);

      setNewLocationId(response.data[0]?._id ?? null);

      setLocations((prevLocations) => [...prevLocations, ...response.data]);

      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load more locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && locations.length === 0) {
    return <p>Завантаження...</p>;
  }

  if (!isLoading && locations.length === 0) {
    return <p>Локації не знайдено</p>;
  }

  return (
    <div>
      <ul>
        {locations.map((location) => (
          <li
            key={location._id}
            ref={(element) => {
              if (location._id === newLocationId) {
                newLocationRef.current = element;
              }
            }}
          >
            <LocationCard location={location} isEditable={isEditable} />
          </li>
        ))}
      </ul>

      {page < totalPages && (
        <button type="button" onClick={handleLoadMore} disabled={isLoading}>
          {isLoading ? "Завантаження..." : "Показати ще"}
        </button>
      )}
    </div>
  );
};

export default LocationGrid;
