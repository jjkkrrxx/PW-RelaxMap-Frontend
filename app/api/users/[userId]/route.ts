import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
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

    const { userId } = await params;
    const response = await axios.get(
      `${backendUrl}/api/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    let status = 500;
    let message = "Внутрішня помилка сервера";

    if (axios.isAxiosError(error)) {
      if (process.env.NODE_ENV === "development") {
        console.error("Помилка у роуті users/[userId]:", error.message);
      }
      status = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ message }, { status });
  }
}
