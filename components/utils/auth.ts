import { apiClient } from "./api-client";
import type { User } from "@/lib/store/authStore";

// Бекенд обгортає відповіді в { data }
interface DataResponse<T> {
  data: T;
}

// Поточний юзер: GET /api/users/current (route handler №5).
// null — гість без cookies сесії (route handler відповідає { data: null })
export const fetchCurrentUser = async (): Promise<User | null> => {
  const { data } =
    await apiClient.get<DataResponse<User | null>>("/users/current");
  return data.data;
};

// Оновлення сесії: POST /api/auth/refresh (наш route handler).
// Лише один запит одночасно: бекенд при оновленні видаляє старий refreshToken,
// тож другий паралельний запит отримав би 401 і бекенд очистив би cookies.
// Паралельні виклики чекають на той самий запит.
let refreshPromise: Promise<void> | null = null;

export const refreshSession = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Вихід: POST /api/auth/logout (route handler №1)
export const logoutRequest = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
