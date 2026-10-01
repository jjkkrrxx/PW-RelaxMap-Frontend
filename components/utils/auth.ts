import { apiClient } from "./api-client";
import type { User } from "@/lib/store/authStore";

// Бекенд обгортає відповіді в { data }
interface DataResponse<T> {
  data: T;
}

// Поточний юзер: GET /api/users/current (route handler №5)
export const fetchCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<DataResponse<User>>("/users/current");
  return data.data;
};

// Оновлення сесії: POST /api/auth/refresh (наш route handler)
export const refreshSession = async (): Promise<void> => {
  await apiClient.post("/auth/refresh");
};

// Вихід: POST /api/auth/logout (route handler №1)
export const logoutRequest = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
