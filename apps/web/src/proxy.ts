import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPaths = ["/auth/login", "/auth/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (!isAuthPage) {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie") ?? "";

  try {
    const res = await fetch(`${process.env.API_URL ?? "http://localhost:8001"}/api/auth/get-session`, {
      headers: { cookie },
    });

    const data = await res.json();
    const hasSession = !!data?.user;

    if (isAuthPage && hasSession) {
      return NextResponse.redirect(new URL("/overview", request.url));
    }
  } catch {
    // pass through if we can't reach the API
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
