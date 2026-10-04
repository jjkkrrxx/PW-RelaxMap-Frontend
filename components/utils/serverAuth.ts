import { cookies } from 'next/headers';
import { serverApi } from './serverApi';
import type { User } from '@/lib/store/authStore';

interface DataResponse<T> {
  data: T;
}

export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  const { data } = await serverApi.get<DataResponse<User | null>>(
    '/users/current',
    {
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  return data.data;
};
