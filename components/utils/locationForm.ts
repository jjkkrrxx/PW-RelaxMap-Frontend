import { apiClient } from './api-client';
import { LocationFormValues } from '../LocationForm/LocationForm';
import { serverApi } from './serverApi';
import { LocationWithOwner } from '@/types/location';

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
  const { data } = await apiClient.get<CategoriesResponse>('/categories');
  return data;
};

interface LocationData {
  data: LocationWithOwner;
}

interface ApiResponse<T> {
  data: T;
}

export const getLocation = async (id: string): Promise<LocationData> => {
  const { data } = await serverApi.get<LocationData>(
    `/locations/${encodeURIComponent(id)}`
  );

  return data;
};

const buildLocationFormData = (values: LocationFormValues) => {
  const formData = new FormData();

  if (values.image instanceof File) {
    formData.append('images', values.image);
  }

  formData.append('name', values.name);
  formData.append('locationType', values.locationType);
  formData.append('region', values.region);
  formData.append('description', values.description);

  const { lat, lon } = values.coordinates;

  if (lat !== null && lon !== null) {
    formData.append('coordinates', JSON.stringify({ lat, lon }));
  }

  return formData;
};

export const createLocation = async (values: LocationFormValues) => {
  const { data } = await apiClient.post<ApiResponse<LocationWithOwner>>(
    '/locations',
    buildLocationFormData(values)
  );

  return data.data;
};

export const updateLocation = async (
  id: string,
  values: LocationFormValues
) => {
  const { data } = await apiClient.patch<ApiResponse<LocationWithOwner>>(
    `/locations/${id}`,
    buildLocationFormData(values)
  );

  return data.data;
};
