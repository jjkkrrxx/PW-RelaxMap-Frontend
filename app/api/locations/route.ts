import { NextResponse } from 'next/server';
import axios from 'axios';

const NO_BACKEND_URL_MESSAGE =
  'Критична помилка: BACKEND_URL не налаштовано в .env.local';

function errorResponse(error: unknown) {
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

// Каталог локацій з фільтрами й пагінацією:
// GET /api/locations?search=&region=&type=&sort=&page=&limit=
export async function GET(request: Request) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ message: NO_BACKEND_URL_MESSAGE }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);

    // параметри фільтрів передаємо на бекенд як є
    const response = await axios.get(`${backendUrl}/api/locations`, {
      params: searchParams,
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return errorResponse(error);
  }
}

// Створення локації (лише авторизовані): POST /api/locations з FormData
export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ message: NO_BACKEND_URL_MESSAGE }, { status: 500 });
  }

  try {
    const cookieHeader = request.headers.get('cookie') || '';
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
    return errorResponse(error);
  }
}
