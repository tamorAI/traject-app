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

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly data: unknown;

  constructor(status: number, message: string, code?: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code ?? "UNKNOWN_ERROR";
    this.data = data;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isValidationError(): boolean {
    return this.status === 400;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

type RequestInterceptor = (config: {
  path: string;
  method: string;
  body?: unknown;
  signal?: AbortSignal;
}) => { path: string; method: string; body?: unknown; signal?: AbortSignal };

type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

interface ApiClientConfig {
  basePath: string;
  onUnauthorized?: () => void;
  retries?: number;
  retryDelay?: number;
}

const globalResponseInterceptors: ResponseInterceptor[] = [];

export function addResponseInterceptor(interceptor: ResponseInterceptor) {
  globalResponseInterceptors.push(interceptor);
}

export function clearResponseInterceptors() {
  globalResponseInterceptors.length = 0;
}

function createApiClient(config: ApiClientConfig) {
  const { basePath, onUnauthorized, retries = 0, retryDelay = 500 } = config;

  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: ResponseInterceptor[] = [...globalResponseInterceptors];

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: { signal?: AbortSignal },
  ): Promise<T> {
    let resolvedPath = path;
    let resolvedMethod = method;

    for (const interceptor of requestInterceptors) {
      const result = interceptor({
        path: resolvedPath,
        method: resolvedMethod,
        body,
        signal: options?.signal,
      });
      resolvedPath = result.path;
      resolvedMethod = result.method;
    }

    let lastError: Error | null = null;
    const maxRetries = method === "GET" ? retries : 0;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`${basePath}${resolvedPath}`, {
          method: resolvedMethod,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
          credentials: "include",
          signal: options?.signal,
        });

        let processedRes: Response = res;
        for (const interceptor of responseInterceptors) {
          processedRes = await interceptor(processedRes);
        }

        if (!processedRes.ok) {
          const data = await processedRes.json().catch(() => ({}));
          const message = data?.message ?? data?.error ?? "Request failed";
          const error = new ApiError(
            processedRes.status,
            message,
            data?.code,
            data,
          );

          if (error.isUnauthorized && onUnauthorized) {
            onUnauthorized();
          }

          throw error;
        }

        const text = await processedRes.text();
        return text ? (JSON.parse(text) as T) : (undefined as T);
      } catch (error) {
        lastError = error as Error;

        if (error instanceof ApiError && error.status < 500) {
          throw error;
        }

        if (options?.signal?.aborted) {
          throw error;
        }

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError ?? new ApiError(0, "Request failed");
  }

  return {
    get<T>(path: string, options?: { signal?: AbortSignal }): Promise<T> {
      return request<T>("GET", path, undefined, options);
    },
    post<T>(path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<T> {
      return request<T>("POST", path, body, options);
    },
    put<T>(path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<T> {
      return request<T>("PUT", path, body, options);
    },
    delete<T>(path: string, options?: { signal?: AbortSignal }): Promise<T> {
      return request<T>("DELETE", path, undefined, options);
    },
    addRequestInterceptor(interceptor: RequestInterceptor) {
      requestInterceptors.push(interceptor);
      return this;
    },
    addResponseInterceptor(interceptor: ResponseInterceptor) {
      responseInterceptors.push(interceptor);
      return this;
    },
  };
}

export const apiClient = createApiClient({
  basePath: "/api/auth",
  retries: 1,
  retryDelay: 500,
});

export const apiPost = apiClient.post;
export const apiGet = apiClient.get;
export const apiPut = apiClient.put;
export const apiDelete = apiClient.delete;
