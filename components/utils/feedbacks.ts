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
  rate: number; // 1–5
  description: string; // 1–200
}

// Бекенд обгортає відповіді в { data } (PR #52 бекенду).
interface DataResponse<T> {
  data: T;
}

// Останні відгуки для головної сторінки (свайпер). Бек: GET /api/feedbacks/last-reviews.
export const getLastReviews = async (): Promise<Review[]> => {
  const { data } = await apiClient.get<DataResponse<Review[]>>('/feedbacks/last-reviews');
  return Array.isArray(data?.data) ? data.data : [];
};

// Відповідь списку з пагінацією: { data, page, limit, totalPages, total }
export interface FeedbacksPage {
  data: Review[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

// Відгуки локації з пагінацією. Бек: GET /api/feedbacks?locationId=&page=&limit=
export const getFeedbacks = async (
  locationId: string,
  page = 1,
  limit = 10
): Promise<FeedbacksPage> => {
  const { data } = await apiClient.get<FeedbacksPage>('/feedbacks', {
    params: { locationId, page, limit },
  });
  return data;
};

// Створити відгук (лише авторизовані). Бек: POST /api/feedbacks.
export const createFeedback = async (dto: CreateFeedbackDto): Promise<Review> => {
  const { data } = await apiClient.post<DataResponse<Review>>('/feedbacks', dto);
  return data.data;
};
