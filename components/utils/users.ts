import axios from "axios";
import type { CurrentUserIdentity, UserProfile } from "@/types/user";
import { apiClient } from "./api-client";

interface DataResponse<T> {
  data: T;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data } = await apiClient.get<DataResponse<UserProfile>>(
    `/users/${encodeURIComponent(userId)}`,
  );

  return data.data;
}

export async function getCurrentUserIdentity(): Promise<CurrentUserIdentity | null> {
  try {
    const { data } =
      await apiClient.get<DataResponse<CurrentUserIdentity>>("/users/current");

    return data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}
