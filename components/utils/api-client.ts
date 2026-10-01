import axios, { AxiosError } from "axios";

export type ApiError = AxiosError<{ error: string }>;

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
