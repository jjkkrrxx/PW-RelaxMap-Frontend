import { apiClient } from "./api-client";
import { Location } from "@/types/location";

interface UserLocationsResponse {
  data: Location[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface LocationFilters {
  search?: string;
  region?: string;
  type?: string;
  sort?: string;
}

interface LocationsResponse {
  data: Location[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export const getLocations = async (
  page: number,
  limit: number,
  filters: LocationFilters = {},
  signal?: AbortSignal,
) => {
  const { data } = await apiClient.get<LocationsResponse>("/locations", {
    params: {
      search: filters.search || undefined,
      region: filters.region || undefined,
      type: filters.type || undefined,
      sort: filters.sort || undefined,
      page,
      limit,
    },
    signal,
  });

  return data;
};

export const getUserLocations = async (
  userId: string,
  page: number,
  limit: number,
  signal?: AbortSignal,
) => {
  const { data } = await apiClient.get<UserLocationsResponse>(
    `/users/${userId}/locations`,
    {
      params: {
        page,
        limit,
      },
      signal,
    },
  );

  return data;
};
