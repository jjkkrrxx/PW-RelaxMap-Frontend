import { apiClient } from './api-client';

// Модель відгуку відповідає бекенду команди (locationId — populated: name/locationType/region).
export interface Review {
  _id: string;
  rate: number;
  description: string;
  userName: string;
  locationId?: {
    _id: string;
    name: string;
    locationType?: string;
    region?: string;
  };
  createdAt?: string;
}

export interface CreateFeedbackDto {
  locationId: string;
  userName: string; // бек вимагає userName у тілі (createFeedbackSchema)
  rate: number; // ціле 1–5
  description: string; // 1–200
}

// Останні відгуки для головної сторінки (свайпер). Бек: GET /api/feedbacks/last-reviews.
// Бекенд повертає сирий масив відгуків (без обгортки { data }).
export const getLastReviews = async (): Promise<Review[]> => {
  const { data } = await apiClient.get('/feedbacks/last-reviews');
  return Array.isArray(data) ? data : [];
};

// Створити відгук (лише авторизовані). Бек: POST /api/feedbacks.
export const createFeedback = async (dto: CreateFeedbackDto) => {
  const { data } = await apiClient.post('/feedbacks', dto);
  return data;
};
