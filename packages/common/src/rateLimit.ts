import type { Request, RequestHandler } from "express";
import { Redis } from "ioredis";

export interface RateLimitOptions {
  /** Prefix so different limiters never share counters, e.g. "auth". */
  name: string;
  windowSeconds: number;
  max: number;
  redisUrl?: string;
  /** Default: client IP. */
  key?: (req: Request) => string;
}

// Atomic fixed-window counter: INCR, set expiry on first hit, return count and TTL.
const LUA = `
local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return { c, redis.call('TTL', KEYS[1]) }`;

const clients = new Map<string, Redis>();
const connecting = new WeakMap<Redis, Promise<unknown>>();
function client(url: string) {
  let c = clients.get(url);
  if (!c) {
    c = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 500,
      retryStrategy: (n) => Math.min(n * 200, 2000),
    });
    c.on("error", () => {}); // outages are handled per request by the fallback below
    connecting.set(c, c.connect().catch(() => {}));
    clients.set(url, c);
  }
  return c;
}

/** Close shared Redis connections (graceful shutdown / tests). */
export async function closeRateLimiters() {
  await Promise.all([...clients.values()].map((c) => c.quit().catch(() => c.disconnect())));
  clients.clear();
}

/**
 * Distributed rate limiter: counters live in Redis so every instance of a service shares them.
 * If Redis is unreachable it FAILS OVER to a per-instance in-memory counter (weaker but never open,
 * and never takes the API down).
 */
export function rateLimit(opts: RateLimitOptions): RequestHandler {
  const memory = new Map<string, { count: number; resetAt: number }>();
  const redis = opts.redisUrl ? client(opts.redisUrl) : undefined;

  const hit = async (key: string): Promise<{ count: number; ttl: number }> => {
    if (redis) {
      try {
        // First request after startup: give the connection a moment instead of silently using memory.
        if (redis.status !== "ready") {
          await Promise.race([connecting.get(redis), new Promise((r) => setTimeout(r, 500))]);
        }
        const [count, ttl] = (await redis.eval(LUA, 1, key, opts.windowSeconds)) as [number, number];
        return { count, ttl: Math.max(ttl, 1) };
      } catch {
        /* fall through to memory */
      }
    }
    const now = Date.now();
    let e = memory.get(key);
    if (!e || e.resetAt <= now) {
      e = { count: 0, resetAt: now + opts.windowSeconds * 1000 };
      memory.set(key, e);
    }
    e.count++;
    return { count: e.count, ttl: Math.max(Math.ceil((e.resetAt - now) / 1000), 1) };
  };

  return async (req, res, next) => {
    const id = opts.key ? opts.key(req) : (req.ip ?? "unknown");
    const { count, ttl } = await hit(`rl:${opts.name}:${id}`);
    res.setHeader("RateLimit-Limit", String(opts.max));
    res.setHeader("RateLimit-Remaining", String(Math.max(opts.max - count, 0)));
    res.setHeader("RateLimit-Reset", String(ttl));
    if (count > opts.max) {
      res.setHeader("Retry-After", String(ttl));
      return res
        .status(429)
        .json({ error: { code: "RATE_LIMITED", message: "Too many requests, try again later", details: [] } });
    }
    next();
  };
}
