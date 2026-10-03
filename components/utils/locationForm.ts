import { apiClient } from './api-client';
import { LocationFormValues } from '../LocationForm/LocationForm';
import { serverApi } from './serverApi';
import axios from 'axios';

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
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locations`,
    buildLocationFormData(values)
  );

  return data;
};

export const updateLocation = async (
  id: string,
  values: LocationFormValues
) => {
  const {data} = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locations/${id}`,
    buildLocationFormData(values)
  );

  return data
};
