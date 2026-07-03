import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Upstash Redis-backed rate limiter instances.
 *
 * Credentials are read from:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * All limiters use a sliding window algorithm.
 */

function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = createRedis();

/** Strict: 5 attempts per 10 minutes — admin login endpoint */
export const loginLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "rl:login",
    })
  : null;

/** Standard: 20 requests per minute — public form submissions (reservations, reviews) */
export const submissionLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      prefix: "rl:submission",
    })
  : null;

/** Standard: 10 requests per minute — upload signature endpoint */
export const uploadLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "rl:upload",
    })
  : null;

/**
 * Applies a rate limit check. Returns a 429 Response if the limit is exceeded,
 * or null if the request should proceed.
 *
 * Falls back to null (no limiting) when Redis credentials are not configured,
 * so the app works in development without Upstash.
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<Response | null> {
  if (!limiter) return null;

  const { success, limit, reset, remaining } = await limiter.limit(identifier);

  if (!success) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    );
  }

  return null;
}
