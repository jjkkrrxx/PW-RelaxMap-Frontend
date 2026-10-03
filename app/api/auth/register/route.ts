import { NextResponse } from "next/server";
import axios from "axios";

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

  try {
    const body = await request.json();

    const response = await axios.post(
      `${backendUrl}/api/auth/register`,
      body,
      );

    const res = NextResponse.json(response.data, {
      status: response.status,
    });

    forwardSetCookie(res, response.headers["set-cookie"]);

    return res;
  } catch (error: unknown) {
    let status = 500;
    let message = "Внутрішня помилка сервера";
    let setCookie: string[] | undefined;

    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Помилка у внутрішньому роуті auth/register:",
          error.message,
        );
      }

      status = error.response?.status || 500;
      message = error.response?.data?.message || message;
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