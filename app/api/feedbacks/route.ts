import { NextResponse } from 'next/server';
import axios from 'axios';

const NO_BACKEND_URL_MESSAGE =
  'Критична помилка: BACKEND_URL не налаштовано в .env.local';

// Переносимо всі Set-Cookie з відповіді бекенду у відповідь браузеру
function forwardSetCookie(res: NextResponse, setCookie?: string[]) {
  setCookie?.forEach((cookie) => res.headers.append('Set-Cookie', cookie));
}

function errorResponse(error: unknown, method: string) {
  let status = 500;
  let message = 'Внутрішня помилка сервера';
  let setCookie: string[] | undefined;

  if (axios.isAxiosError(error)) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Помилка у роуті feedbacks (${method}):`, error.message);
    }
    status = error.response?.status || 500;
    message = error.response?.data?.message || message;
    setCookie = error.response?.headers['set-cookie'];
  } else if (error instanceof Error) {
    message = error.message;
  }

  const res = NextResponse.json({ message }, { status });
  forwardSetCookie(res, setCookie);
  return res;
}

// Відгуки локації з пагінацією: GET /api/feedbacks?locationId=&page=&limit=
export async function GET(request: Request) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ message: NO_BACKEND_URL_MESSAGE }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const response = await axios.get(`${backendUrl}/api/feedbacks`, {
      params: searchParams,
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return errorResponse(error, 'GET');
  }
}

// Створення відгуку (лише авторизовані): POST /api/feedbacks
export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ message: NO_BACKEND_URL_MESSAGE }, { status: 500 });
  }

  try {
    const body = await request.json();
    const response = await axios.post(`${backendUrl}/api/feedbacks`, body, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    const res = NextResponse.json(response.data, { status: response.status });
    forwardSetCookie(res, response.headers['set-cookie']);
    return res;
  } catch (error: unknown) {
    return errorResponse(error, 'POST');
  }
}
