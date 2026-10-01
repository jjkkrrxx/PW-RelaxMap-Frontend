//components\utils\api-client.ts

import axios, { AxiosError } from "axios";

export type ApiError = AxiosError<{ error: string }>;

export const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
