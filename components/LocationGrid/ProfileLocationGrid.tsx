"use client";

import { useState } from "react";
import { useEffect, useRef } from "react";
import { getUserLocations } from "@/components/utils/locations";
import { useAuthStore } from "@/lib/store/authStore";
import Loader from "@/components/loader/loader";
import ProfilePlaceholder from "@/components/profileplaceholder/profileplaceholder";
import { Location } from "@/types/location";
import LocationGrid from "./LocationGrid";
import styles from "./LocationGrid.module.css";

interface ProfileLocationGridProps {
  userId: string;
}

const MOBILE_PAGE_SIZE = 4;
const TABLET_PAGE_SIZE = 4;
const DESKTOP_PAGE_SIZE = 3;

export default function ProfileLocationGrid({
  userId,
}: ProfileLocationGridProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthHydrated = useAuthStore((state) => state.isHydrated);
  const requestIdRef = useRef(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<{
    requestKey: string;
    message: string;
  } | null>(null);
  const requestKey = pageSize === null ? null : `${userId}:${pageSize}`;
  const isInitialLoading =
    requestKey === null || loadedRequestKey !== requestKey;
  const currentError = error?.requestKey === requestKey ? error.message : null;

  useEffect(() => {
    const tabletQuery = window.matchMedia("(min-width: 768px)");
    const desktopQuery = window.matchMedia("(min-width: 1440px)");

    const updatePageSize = () => {
      setPageSize(
        desktopQuery.matches
          ? DESKTOP_PAGE_SIZE
          : tabletQuery.matches
            ? TABLET_PAGE_SIZE
            : MOBILE_PAGE_SIZE,
      );
    };

    updatePageSize();
    tabletQuery.addEventListener("change", updatePageSize);
    desktopQuery.addEventListener("change", updatePageSize);

    return () => {
      tabletQuery.removeEventListener("change", updatePageSize);
      desktopQuery.removeEventListener("change", updatePageSize);
    };
  }, []);

  useEffect(() => {
    if (pageSize === null) return;

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    void getUserLocations(userId, 1, pageSize, controller.signal)
      .then((response) => {
        if (requestId !== requestIdRef.current) return;
        setLocations(response.data);
        setPage(response.page);
        setTotalPages(response.totalPages);
        setLoadedRequestKey(`${userId}:${pageSize}`);
        setError(null);
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        setLocations([]);
        setPage(0);
        setTotalPages(0);
        setError({
          requestKey: `${userId}:${pageSize}`,
          message: "Не вдалося завантажити локації. Спробуйте ще раз.",
        });
        setLoadedRequestKey(`${userId}:${pageSize}`);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoadingMore(false);
      });

    return () => {
      controller.abort();
      requestIdRef.current += 1;
    };
  }, [userId, pageSize]);

  const handleLoadMore = async () => {
    if (
      isInitialLoading ||
      isLoadingMore ||
      pageSize === null ||
      page >= totalPages
    )
      return;

    const requestId = requestIdRef.current;
    setIsLoadingMore(true);
    setError(null);

    try {
      const response = await getUserLocations(userId, page + 1, pageSize);
      if (requestId !== requestIdRef.current) return;
      setLocations((current) => [...current, ...response.data]);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch {
      if (requestId === requestIdRef.current) {
        setError({
          requestKey: `${userId}:${pageSize}`,
          message: "Не вдалося завантажити наступні локації. Спробуйте ще раз.",
        });
      }
    } finally {
      if (requestId === requestIdRef.current) setIsLoadingMore(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className={styles.loadingState}>
        <Loader />
      </div>
    );
  }

  if (locations.length === 0 && !currentError) {
    return <ProfilePlaceholder userId={userId} />;
  }

  return (
    <>
      {currentError && <p role="alert">{currentError}</p>}
      <LocationGrid
        locations={locations}
        hasMore={page < totalPages}
        isLoading={isLoadingMore}
        onLoadMore={handleLoadMore}
        isEditable={isAuthHydrated && user?._id === userId}
      />
    </>
  );
}
