import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ message: string }>;

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});
