import "server-only";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting for public endpoints (CV upload, contact/membership forms).
 *
 * Why Upstash Redis and not in-memory: on Vercel serverless there is no shared
 * process memory — each request may hit a different instance, so an in-memory
 * counter is trivially bypassed. A Redis-backed limiter shares the count across
 * instances, which is the only thing that actually stops abuse here.
 *
 * FAIL OPEN: if Upstash isn't configured or is unreachable, requests are
 * ALLOWED. A rate limiter that's down must not take the whole site down with
 * it — better to briefly serve unthrottled than to reject every visitor. The
 * limiter is a spam/abuse control, not the primary security boundary (that's
 * input validation + RLS).
 *
 * Config: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. Without
 * them, limiting is disabled (fail open) — fine for local/dev.
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

/** Null when Upstash isn't configured — callers then skip limiting (fail open). */
const redis = url && token ? new Redis({ url, token }) : null;

/**
 * Per-endpoint limiters. Sliding window. Tuned to real human use:
 *  - cv: uploading a CV is a rare action; a handful per hour per IP is plenty.
 *  - form: contact/membership forms; a few per 10 min stops spam floods.
 */
const limiters = redis
  ? {
      cv: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        prefix: "rl:cv",
      }),
      form: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "rl:form",
      }),
    }
  : null;

export type LimiterKind = "cv" | "form";

/** The client IP from Vercel's forwarding headers, or a fallback bucket. */
async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  // First IP in the list is the client; fall back to a shared bucket.
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/**
 * Returns true if the request is allowed, false if it exceeded the limit.
 * Fail open: if limiting is not configured or Upstash errors, returns true.
 */
export async function checkRateLimit(kind: LimiterKind): Promise<boolean> {
  if (!limiters) return true; // not configured → allow
  try {
    const ip = await clientIp();
    const { success } = await limiters[kind].limit(ip);
    return success;
  } catch {
    // Upstash unreachable → allow rather than block everyone.
    return true;
  }
}
