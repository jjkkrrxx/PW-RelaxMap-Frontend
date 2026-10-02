import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  // Гість без жодної cookie сесії: не звертаємося до бекенду і не віддаємо 401
  const hasSession =
    request.cookies.has("accessToken") || request.cookies.has("refreshToken");

  if (!hasSession) {
    return NextResponse.json({ data: null });
  }

  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        {
          message: "Критична помилка: BACKEND_URL не налаштовано в .env.local",
        },
        { status: 500 },
      );
    }

    const response = await axios.get(`${backendUrl}/api/users/current`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    let status = 500;
    let message = "Внутрішня помилка сервера";

    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Помилка у внутрішньому роуті users/current:",
          error.message,
        );
      }
      status = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Невідома помилка:", error.message);
      }
      message = error.message;
    }

    return NextResponse.json({ message }, { status });
  }
}
