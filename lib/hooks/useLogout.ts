"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logoutRequest } from "@/components/utils/auth";

/**
 * Вихід з акаунту за ТЗ: викликаємо бекенд,
 * але НЕЗАЛЕЖНО від відповіді очищаємо store і йдемо на головну.
 */
export const useLogout = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return async () => {
    try {
      // route handler /api/auth/logout очищає httpOnly-cookies
      await logoutRequest();
    } catch {
      // навіть якщо бекенд недоступний — юзер має вийти
    } finally {
      clearAuth();
      router.push("/");
      // перезапитати серверні компоненти вже без сесії
      router.refresh();
    }
  };
};
