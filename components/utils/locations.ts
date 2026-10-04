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
  // один або кілька slug через кому
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
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.region) params.set("region", filters.region);
  // бекенд чекає повторюваний параметр: type=a&type=b
  filters.type
    ?.split(",")
    .filter(Boolean)
    .forEach((item) => params.append("type", item));
  if (filters.sort) params.set("sort", filters.sort);
  params.set("page", String(page));
  params.set("limit", String(limit));

  const { data } = await apiClient.get<LocationsResponse>("/locations", {
    params,
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
