import { API_ENV } from "@traject/env/server";
import { Elysia } from "elysia";
import { LRUCache } from "lru-cache";
import { logger } from "@/common/logger";

const globalCache = new LRUCache<string, number[]>({
  max: 10000,
  ttl: API_ENV.RATE_LIMIT_WINDOW_MS ?? 60000,
});

// Auth cache
const authCache = new LRUCache<string, number[]>({
  max: 1000,
  ttl: API_ENV.AUTH_RATE_LIMIT_WINDOW_MS ?? 60000,
});

const getClientIP = (req: Request): string => {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
};

export const createRateLimiter = (options: {
  max: number;
  windowMs: number;
  cache: LRUCache<string, number[]>;
  skip?: (req: Request) => boolean;
}) => {
  return new Elysia().onRequest(({ request, set }) => {
    // Skip if rate limiting is disabled
    if (!API_ENV.ENABLE_RATE_LIMITER) return;
    if (options.skip?.(request)) return;

    const ip = getClientIP(request);
    const now = Date.now();
    const timestamps = options.cache.get(ip) || [];

    const valid = timestamps.filter((ts) => now - ts < options.windowMs);
    valid.push(now);

    if (valid.length > options.max) {
      if (API_ENV.NODE_ENV === "development") {
        logger.warn(
          `[RATE_LIMIT] IP ${ip} blocked (limit: ${options.max}/${options.windowMs}ms)`,
        );
      }
      set.status = 429;
      return {
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again later.",
      };
    }

    options.cache.set(ip, valid);
  });
};

export const globalRateLimit = createRateLimiter({
  max: API_ENV.RATE_LIMIT_MAX ?? 100,
  windowMs: API_ENV.RATE_LIMIT_WINDOW_MS ?? 60000,
  cache: globalCache,
  skip: (req) => {
    if (req.method === "OPTIONS") return true;
    const path = new URL(req.url).pathname;
    return path === "/health" || path.startsWith("/api/auth");
  },
});

export const authRateLimit = createRateLimiter({
  max: API_ENV.AUTH_RATE_LIMIT_MAX ?? 10,
  windowMs: API_ENV.AUTH_RATE_LIMIT_WINDOW_MS ?? 60000,
  cache: authCache,
});
