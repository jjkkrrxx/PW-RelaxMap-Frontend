import { NextResponse } from "next/server";
import axios from "axios";

// Переносимо Set-Cookie з відповіді бекенду в відповідь браузеру
function forwardSetCookie(res: NextResponse, setCookie?: string[]) {
  setCookie?.forEach((cookie) => res.headers.append("Set-Cookie", cookie));
}

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { message: "Критична помилка: BACKEND_URL не налаштовано в .env.local" },
      { status: 500 },
    );
  }

  const cookieHeader = request.headers.get("cookie") || "";

  try {
    const response = await axios.post(`${backendUrl}/api/auth/refresh`, null, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const res = NextResponse.json(response.data, { status: response.status });
    // нові sessionId, accessToken, refreshToken
    forwardSetCookie(res, response.headers["set-cookie"]);
    return res;
  } catch (error: unknown) {
    let status = 500;
    let message = "Внутрішня помилка сервера";
    let setCookie: string[] | undefined;

    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Помилка у внутрішньому роуті auth/refresh:",
          error.message,
        );
      }
      status = error.response?.status || 500;
      message = error.response?.data?.message || message;
      // при 401 бекенд очищає cookies — передаємо це браузеру теж
      setCookie = error.response?.headers["set-cookie"];
    } else if (error instanceof Error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Невідома помилка:", error.message);
      }
      message = error.message;
    }

    const res = NextResponse.json({ message }, { status });
    forwardSetCookie(res, setCookie);
    return res;
  }
}
