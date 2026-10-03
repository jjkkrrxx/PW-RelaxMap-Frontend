import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        {
          message: 'Критична помилка: BACKEND_URL не налаштовано в .env.local',
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const response = await axios.post(`${backendUrl}/api/locations`, formData, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: unknown) {
    let status = 500;
    let message = 'Внутрішня помилка сервера';

    if (axios.isAxiosError(error)) {
      status = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ message }, { status });
  }
}

