import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:8001";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");
  const next = searchParams.get("next") ?? "/overview";

  if (token) {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const response = NextResponse.redirect(`${origin}${next}`);
        const setCookies = res.headers.getSetCookie?.() ?? [];
        for (const cookie of setCookies) {
          response.headers.append("Set-Cookie", cookie);
        }
        return response;
      }
    } catch {}
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}
