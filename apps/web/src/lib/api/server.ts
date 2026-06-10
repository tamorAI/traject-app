const API_URL = process.env.API_URL ?? "http://localhost:8001";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  cookies?: string;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, cookies } = options;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookies ? { cookie: cookies } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...(method !== "GET" ? { credentials: "include" } : {}),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? "Request failed");
  }

  return res.json() as Promise<T>;
}

export interface SessionData {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export async function getServerSession(
  cookieHeader?: string,
): Promise<SessionData> {
  try {
    const response = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
    });

    if (!response.ok) {
      return { user: null, session: null };
    }

    const data = await response.json();
    return {
      user: data?.user ?? null,
      session: data?.session ?? null,
    };
  } catch {
    return { user: null, session: null };
  }
}
