"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import Loader from "@/components/loader/loader";
import LocationGrid from "@/components/LocationGrid/LocationGrid";
import { getLocations } from "@/components/utils/locations";
import { Location } from "@/types/location";
import styles from "./page.module.css";

const DESKTOP_MEDIA_QUERY = "(min-width: 1440px)";
const COMPACT_PAGE_SIZE = 6;
const DESKTOP_PAGE_SIZE = 9;

function subscribeToDesktopBreakpoint(onChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getPageSizeSnapshot() {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
    ? DESKTOP_PAGE_SIZE
    : COMPACT_PAGE_SIZE;
}

function getServerPageSize() {
  return COMPACT_PAGE_SIZE;
}

export default function LocationsCatalog() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const region = searchParams.get("region") ?? "";
  // типів може бути кілька (?type=a&type=b) — тримаємо рядком для залежностей
  const type = searchParams.getAll("type").join(",");
  const sort = searchParams.get("sort") ?? "";
  const pageSize = useSyncExternalStore(
    subscribeToDesktopBreakpoint,
    getPageSizeSnapshot,
    getServerPageSize,
  );
  const filterKey = JSON.stringify({ search, region, type, sort, pageSize });
  const requestIdRef = useRef(0);

  const [locations, setLocations] = useState<Location[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadedFilterKey, setLoadedFilterKey] = useState<string | null>(null);
  const [loadingMoreFilterKey, setLoadingMoreFilterKey] = useState<
    string | null
  >(null);
  const [error, setError] = useState<{
    filterKey: string;
    message: string;
  } | null>(null);

  const isInitialLoading = loadedFilterKey !== filterKey;
  const isLoadingMore = loadingMoreFilterKey === filterKey;
  const currentError = error?.filterKey === filterKey ? error.message : null;

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    void getLocations(
      1,
      pageSize,
      { search, region, type, sort },
      controller.signal,
    )
      .then((response) => {
        if (requestId !== requestIdRef.current) return;
        setLocations(response.data);
        setPage(response.page);
        setTotalPages(response.totalPages);
        setLoadingMoreFilterKey(null);
        setLoadedFilterKey(filterKey);
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        setLocations([]);
        setPage(0);
        setTotalPages(0);
        setError({
          filterKey,
          message: "Не вдалося завантажити локації. Спробуйте ще раз.",
        });
        setLoadedFilterKey(filterKey);
      });

    return () => {
      controller.abort();
      requestIdRef.current += 1;
    };
  }, [filterKey, search, region, type, sort, pageSize]);

  const handleLoadMore = async () => {
    if (isInitialLoading || isLoadingMore || page >= totalPages) return;

    const requestId = requestIdRef.current;
    setLoadingMoreFilterKey(filterKey);

    try {
      const response = await getLocations(page + 1, pageSize, {
        search,
        region,
        type,
        sort,
      });
      if (requestId !== requestIdRef.current) return;
      setLocations((current) => [...current, ...response.data]);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch {
      if (requestId === requestIdRef.current) {
        setError({
          filterKey,
          message: "Не вдалося завантажити наступні локації. Спробуйте ще раз.",
        });
      }
    } finally {
      if (requestId === requestIdRef.current) setLoadingMoreFilterKey(null);
    }
  };

  return (
    <>
      <FilterPanel />

      {isInitialLoading ? (
        <div className={styles.loading}>
          <Loader />
        </div>
      ) : currentError && locations.length === 0 ? (
        <p className={styles.message} role="alert">
          {currentError}
        </p>
      ) : locations.length === 0 ? (
        <p className={styles.message}>Локацій не знайдено</p>
      ) : (
        <>
          {currentError && <p role="alert">{currentError}</p>}
          <h2 className={styles.visuallyHidden}>Список локацій</h2>
          <LocationGrid
            locations={locations}
            hasMore={page < totalPages}
            isLoading={isLoadingMore}
            onLoadMore={handleLoadMore}
          />
        </>
      )}
    </>
  );
}
