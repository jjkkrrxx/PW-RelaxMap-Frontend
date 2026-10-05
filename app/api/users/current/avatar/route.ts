import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Зміна аватара поточного юзера: PATCH /api/users/current/avatar (FormData, поле avatar)
export async function PATCH(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { message: "Критична помилка: BACKEND_URL не налаштовано в .env.local" },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const response = await axios.patch(
      `${backendUrl}/api/users/current/avatar`,
      formData,
      { headers: { Cookie: request.headers.get("cookie") ?? "" } },
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const status = axios.isAxiosError(error)
      ? (error.response?.status ?? 500)
      : 500;
    const message = axios.isAxiosError(error)
      ? (error.response?.data?.message ?? "Не вдалося оновити аватар")
      : "Не вдалося оновити аватар";

    return NextResponse.json({ message }, { status });
  }
}
