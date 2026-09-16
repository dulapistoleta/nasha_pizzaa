/**
 * Ограничение частоты запросов (rate limiting).
 *
 * Хранилище вынесено за интерфейс: по умолчанию — процессная память,
 * но в продакшене с несколькими инстансами её нужно заменить на общее
 * хранилище (Redis / Upstash) — см. `RedisLikeStore` ниже.
 */

export interface RateLimitResult {
  ok: boolean;
  /** Сколько запросов осталось в текущем окне. */
  remaining: number;
  /** Момент сброса окна, Unix-время в мс. */
  resetAt: number;
  /** Сколько секунд ждать до следующей попытки. */
  retryAfterSeconds: number;
}

export interface RateLimitStore {
  /** Регистрирует запрос и возвращает состояние окна для ключа. */
  hit(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Ограниченное по памяти хранилище скользящего окна.
 *
 * Ёмкость ограничена сознательно: без этого поток запросов с уникальных IP
 * сам стал бы вектором исчерпания памяти.
 */
class MemoryStore implements RateLimitStore {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly maxKeys = 10_000) {}

  async hit(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      // Периодическая уборка просроченных окон вместо отдельного таймера
      if (this.buckets.size >= this.maxKeys) this.sweep(now);

      const bucket: Bucket = { count: 1, resetAt: now + windowMs };
      this.buckets.set(key, bucket);
      return bucket;
    }

    existing.count += 1;
    return existing;
  }

  private sweep(now: number): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }

    // Если после уборки всё ещё переполнено — вытесняем самые старые окна
    if (this.buckets.size >= this.maxKeys) {
      const overflow = this.buckets.size - Math.floor(this.maxKeys * 0.8);
      let removed = 0;
      for (const key of this.buckets.keys()) {
        this.buckets.delete(key);
        if (++removed >= overflow) break;
      }
    }
  }
}

/**
 * Пример подключения общего хранилища для нескольких инстансов:
 *
 * ```ts
 * const store: RateLimitStore = {
 *   async hit(key, windowMs) {
 *     const redisKey = `rl:${key}`;
 *     const count = await redis.incr(redisKey);
 *     if (count === 1) await redis.pexpire(redisKey, windowMs);
 *     const ttl = await redis.pttl(redisKey);
 *     return { count, resetAt: Date.now() + ttl };
 *   },
 * };
 * ```
 */
export const memoryStore = new MemoryStore();

export interface RateLimitRule {
  /** Понятное имя для заголовков и логов. */
  name: string;
  limit: number;
  windowMs: number;
}

export async function enforceRateLimit(
  store: RateLimitStore,
  identifier: string,
  rule: RateLimitRule,
): Promise<RateLimitResult> {
  const { count, resetAt } = await store.hit(`${rule.name}:${identifier}`, rule.windowMs);
  const remaining = Math.max(0, rule.limit - count);

  return {
    ok: count <= rule.limit,
    remaining,
    resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
  };
}

/**
 * Достаёт IP клиента.
 *
 * ВАЖНО: заголовки `x-forwarded-for` подделываются клиентом, если приложение
 * не стоит за доверенным прокси/CDN, который их перезаписывает. На Vercel,
 * Cloudflare и nginx с `proxy_set_header` это безопасно; при прямом доступе
 * к Node-серверу ориентироваться на них нельзя.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-real-ip") ??
    headers.get("x-vercel-forwarded-for") ??
    "unknown"
  );
}
