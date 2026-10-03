import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { message: 'Критична помилка: BACKEND_URL не налаштовано в .env.local' },
        { status: 500 }
      );
    }

    const response = await axios.get(`${backendUrl}/api/users/${userId}`);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    let status = 500;
    let message = 'Внутрішня помилка сервера';

    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Помилка у роуті users/[userId]:', error.message);
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