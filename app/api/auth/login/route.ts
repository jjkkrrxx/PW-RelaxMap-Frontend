import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get('cookie') || '';
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { message: 'BACKEND_URL не налаштовано' },
        { status: 500 }
      );
    }

    const response = await axios.post(`${backendUrl}/api/auth/login`, body, {
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
    });

    const setCookieHeader = response.headers['set-cookie'];
    const res = NextResponse.json(response.data);

    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) => {
          res.headers.append('Set-Cookie', cookie);
        });
      } else {
        res.headers.set('Set-Cookie', setCookieHeader);
      }
    }

    return res;
  } catch (error: unknown) {
    let status = 500;
    let message = 'Помилка сервера';

    if (axios.isAxiosError(error)) {
      status = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ message }, { status });
  }
}
