import { apiClient } from "./api-client";
import { Location } from "@/types/location";

export interface UserLocationsResponse {
  data: Location[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export const getUserLocations = async (
  userId: string,
  page: number = 1,
  limit: number = 9,
) => {
  const { data } = await apiClient.get<UserLocationsResponse>(
    `/users/${userId}/locations`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return data;
};
