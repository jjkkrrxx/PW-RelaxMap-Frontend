import { NextRequest, NextResponse } from "next/server";

// "Мій профіль" — приватний; /profile/[userId] (чужий профіль) — публічний
const PRIVATE_EXACT = ["/profile"];
const PRIVATE_PATTERNS = [
  /^\/locations\/add\/?$/,
  /^\/locations\/[^/]+\/edit\/?$/, // /locations/[id]/edit
];
const AUTH_ROUTES = ["/login", "/register"];

const isPrivateRoute = (pathname: string) =>
  PRIVATE_EXACT.includes(pathname) ||
  PRIVATE_PATTERNS.some((pattern) => pattern.test(pathname));

const isAuthRoute = (pathname: string) => AUTH_ROUTES.includes(pathname);

// accessToken живе 15 хв: якщо його вже немає, але є refreshToken —
// оновлюємо сесію тут, щоб юзера не викинуло на логін
async function tryRefresh(request: NextRequest): Promise<string[] | null> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) return null;

  try {
    const res = await fetch(`${backendUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    if (!res.ok) return null;
    return res.headers.getSetCookie();
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const privateRoute = isPrivateRoute(pathname);
  const authRoute = isAuthRoute(pathname);

  if (!privateRoute && !authRoute) {
    return NextResponse.next();
  }

  // попереднє завантаження посилань (Link prefetch): не оновлюємо сесію —
  // інакше кілька prefetch приватних сторінок із шапки запускають паралельні refresh,
  // бекенд видаляє старий refreshToken, і другий запит розлогінює юзера
  const isPrefetch =
    request.headers.has("next-router-prefetch") ||
    request.headers.get("purpose") === "prefetch";

  let isLoggedIn = request.cookies.has("accessToken");
  let refreshedCookies: string[] | null = null;

  if (!isLoggedIn && request.cookies.has("refreshToken")) {
    if (isPrefetch) {
      // є refreshToken — вважаємо залогіненим; оновить реальна навігація
      isLoggedIn = true;
    } else {
      refreshedCookies = await tryRefresh(request);
      isLoggedIn = refreshedCookies !== null;
    }
  }

  let response: NextResponse;

  if (privateRoute && !isLoggedIn) {
    // гість на приватній сторінці → на логін, з адресою, куди повернути
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    response = NextResponse.redirect(loginUrl);
  } else if (authRoute && isLoggedIn) {
    // залогінений на /login чи /register → на головну
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  // нові cookies після refresh передаємо браузеру
  refreshedCookies?.forEach((cookie) =>
    response.headers.append("Set-Cookie", cookie),
  );

  return response;
}

export const config = {
  matcher: ["/profile", "/locations/:path*", "/login", "/register"],
};
