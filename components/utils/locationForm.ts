import { apiClient } from './api-client';
import { LocationFormValues } from '../LocationForm/LocationForm';
import { serverApi } from './serverApi';

export const fetchCategories = async () => {
  const { data } = await apiClient.get('/categories');
  return data;
};

interface LocationData {
  data: LocationFormValues;
}

export const getLocation = async (id: string): Promise<LocationData> => {
  const { data } = await serverApi.get<LocationData>(
    `/locations/${encodeURIComponent(id)}`
  );

  return data;
};
