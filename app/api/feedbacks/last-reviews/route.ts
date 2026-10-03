import { NextResponse } from 'next/server';
import axios from 'axios';

// Проксі до бекенду (критерій №16: усі запити до бека через app/api).
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { message: 'Критична помилка: BACKEND_URL не налаштовано в .env.local' },
        { status: 500 }
      );
    }

    const response = await axios.get(`${backendUrl}/api/feedbacks/last-reviews`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    let status = 500;
    let message = 'Внутрішня помилка сервера';

    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Помилка у роуті feedbacks/last-reviews:', error.message);
      }
      status = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ message }, { status });
  }
}
