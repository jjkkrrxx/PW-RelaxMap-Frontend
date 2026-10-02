import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        {
          message: 'Критична помилка: BACKEND_URL не налаштовано в .env.local',
        },
        { status: 500 }
      );
    }

    const response = await axios.get(`${backendUrl}/api/categories`);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    let status = 500;
    let message = 'Внутрішня помилка сервера';

    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          'Помилка у внутрішньому роуті categories:',
          error.message
        );
      }

      status = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Невідома помилка:', error.message);
      }

      message = error.message;
    }

    return NextResponse.json({ message }, { status });
  }
}
