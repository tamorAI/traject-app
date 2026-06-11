import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/overview", "/settings", "/org-select"] as const;
const authRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/update-password",
] as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((path) =>
    pathname.startsWith(path),
  );
  const isAuthRoute = authRoutes.some((path) => pathname.startsWith(path));

  const sessionCookie =
    request.cookies.get("auth.session_token") ??
    request.cookies.get("__Secure-auth.session_token");

  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$).*)",
  ],
};
