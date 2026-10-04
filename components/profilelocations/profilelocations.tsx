"use client";

import LocationGrid from "@/components/LocationGrid/LocationGrid";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  userId: string;
};

// Сторінка профілю серверна й не знає, хто увійшов,
// тож власника визначаємо тут — як у ProfilePlaceholder.
export default function ProfileLocations({ userId }: Props) {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  // кнопки «Редагувати» — лише власнику профілю
  const isOwner = isHydrated && user?._id === userId;

  return <LocationGrid userId={userId} isEditable={isOwner} />;
}
