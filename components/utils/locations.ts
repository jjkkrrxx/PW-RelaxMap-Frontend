import { apiClient } from "./api-client";
import { Location } from "@/types/location";

interface UserLocationsResponse {
  data: Location[];
  page: number;
  limit: number;
  totalPages: number;
  totalLocations: number;
}

export const getUserLocations = async (
  userId: string,
  page: number,
  limit: number,
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
