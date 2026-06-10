export const AUTH_COOKIE_NAME = "auth.session_token";

export function setSessionCookie(token: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  const name = isProduction
    ? `__Secure-${AUTH_COOKIE_NAME}`
    : AUTH_COOKIE_NAME;

  document.cookie = `${name}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax${isProduction ? "; secure" : ""}`;
}

export function clearSessionCookie(): void {
  const isProduction = process.env.NODE_ENV === "production";
  const names = isProduction
    ? [`__Secure-${AUTH_COOKIE_NAME}`, AUTH_COOKIE_NAME]
    : [AUTH_COOKIE_NAME];

  for (const name of names) {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
  }
}
