"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import LocationGrid from "@/components/LocationGrid/LocationGrid";
import { getUserLocations } from "@/components/utils/locations";
import { useAuthStore } from "@/lib/store/authStore";

// за ТЗ — порція з 9 локацій
const LIMIT = 9;

type Props = {
  userId: string;
};

// Локації на сторінці профілю: завантаження порціями + кнопки «Редагувати» для власника.
// LocationGrid лише показує список — дані вантажимо тут.
export default function ProfileLocations({ userId }: Props) {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isOwner = isHydrated && user?._id === userId;

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["user-locations", userId],
    queryFn: ({ pageParam }) => getUserLocations(userId, pageParam, LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  if (isError) {
    return (
      <p role="alert">
        Не вдалося завантажити локації. Спробуйте оновити сторінку.
      </p>
    );
  }

  const locations = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <LocationGrid
      locations={locations}
      hasMore={Boolean(hasNextPage)}
      isLoading={isPending || isFetchingNextPage}
      onLoadMore={() => void fetchNextPage()}
      isEditable={isOwner}
    />
  );
}
