import { NextResponse } from "next/server";
import axios from "axios";

const SESSION_COOKIES = ["sessionId", "accessToken", "refreshToken"];

// Вихід: POST /api/auth/logout → бекенд видаляє сесію.
// Cookies сесії очищаємо завжди — навіть якщо бекенд недоступний, юзер має вийти.
export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  const cookieHeader = request.headers.get("cookie") || "";

  if (backendUrl) {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, null, {
        headers: {
          Cookie: cookieHeader,
        },
      });
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development" && error instanceof Error) {
        console.error("Помилка у внутрішньому роуті auth/logout:", error.message);
      }
    }
  }

  const res = new NextResponse(null, { status: 204 });

  // ті самі параметри, з якими бекенд ставить ці cookies
  SESSION_COOKIES.forEach((name) =>
    res.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    }),
  );

  return res;
}
