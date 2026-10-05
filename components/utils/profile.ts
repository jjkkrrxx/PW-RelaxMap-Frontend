import { apiClient } from "./api-client";
import type { User } from "@/lib/store/authStore";

interface DataResponse<T> {
  data: T;
}

// Зміна імені поточного юзера: PATCH /api/users/current
export const updateProfileName = async (name: string): Promise<User> => {
  const { data } = await apiClient.patch<DataResponse<User>>("/users/current", {
    name,
  });
  return data.data;
};

// Зміна аватара: PATCH /api/users/current/avatar (multipart, поле avatar)
export const updateProfileAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await apiClient.patch<DataResponse<User>>(
    "/users/current/avatar",
    formData,
    // apiClient за замовчуванням шле JSON — для файлу потрібен multipart
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
};
