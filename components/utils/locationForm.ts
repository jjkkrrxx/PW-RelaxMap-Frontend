import { apiClient } from "./api-client";

export interface CategoryOption {
  slug: string;
  name: string;
}

export interface LocationCategories {
  locationTypes: CategoryOption[];
  regions: CategoryOption[];
}

interface CategoriesResponse {
  data: LocationCategories;
}

export const fetchCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await apiClient.get<CategoriesResponse>("/categories");
  return data;
};
