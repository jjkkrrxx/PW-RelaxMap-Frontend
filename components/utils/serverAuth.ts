import { cookies } from 'next/headers';
import { serverApi } from './serverApi';
import type { User } from '@/lib/store/authStore';

interface DataResponse<T> {
  data: T;
}

// Поточний юзер на сервері. null — гість, сесія недійсна або бекенд недоступний:
// сторінка тоді сама вирішує, куди перенаправити, замість того щоб упасти з помилкою.
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();

    const { data } = await serverApi.get<DataResponse<User | null>>(
      '/users/current',
      {
        headers: {
          // готовий рядок для заголовка Cookie, зі значеннями в правильному кодуванні
          Cookie: cookieStore.toString(),
        },
      },
    );

    return data.data;
  } catch {
    return null;
  }
};
