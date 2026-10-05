"use client";

import { useEffect, useRef } from "react";
import { useCategoriesStore } from "@/lib/store/categoriesStore";
import Loader from "@/components/loader/loader";
import { Location } from "@/types/location";
import LocationCard from "../LocationCard/LocationCard";
import styles from "./LocationGrid.module.css";

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
  const previousLengthRef = useRef(locations.length);
  const hasHydrated = useCategoriesStore((state) => state.hasHydrated);
  const fetchIfEmpty = useCategoriesStore((state) => state.fetchIfEmpty);

  useEffect(() => {
    void useCategoriesStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (hasHydrated) void fetchIfEmpty();
  }, [hasHydrated, fetchIfEmpty]);

  useEffect(() => {
    if (locations.length > previousLengthRef.current) {
      newLocationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    previousLengthRef.current = locations.length;
  }, [locations.length]);

  return (
    <div>
      <ul className={styles.grid}>
        {locations.map((location, index) => (
          <li
            key={location._id}
            ref={(element) => {
              if (index === previousLengthRef.current) {
                newLocationRef.current = element;
              }
            }}
            className={styles.item}
          >
            <LocationCard
              location={location}
              isEditable={isEditable}
              // перший ряд видно одразу — фото з пріоритетом
              isPriority={index < 3}
            />
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          className={styles.loadMore}
          onClick={onLoadMore}
          disabled={isLoading}
          aria-label={isLoading ? "Завантаження локацій" : undefined}
        >
          <span className={isLoading ? styles.hiddenLabel : undefined}>
            Показати ще
          </span>
          {isLoading && (
            <span className={styles.loadingIndicator}>
              <Loader size={20} light />
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default LocationGrid;
