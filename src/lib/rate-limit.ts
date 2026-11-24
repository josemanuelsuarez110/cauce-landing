/**
 * Rate limiting por IP.
 *
 * - `InMemoryRateLimiter`: ventana fija en memoria. Válido para una sola instancia.
 * - `UpstashRateLimiter`: usa la API REST de Upstash Redis (sin dependencias extra) para
 *   despliegues con varias instancias o serverless. Se activa si hay credenciales en el entorno.
 */

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  /** Segundos hasta que se libera el cupo. */
  retryAfter: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const MAX_TRACKED_KEYS = 10_000;

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  async limit(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    this.evict(now);

    let bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + this.windowMs };
      this.buckets.set(key, bucket);
    }
    bucket.count += 1;

    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return {
      success: bucket.count <= this.max,
      remaining: Math.max(0, this.max - bucket.count),
      retryAfter,
    };
  }

  /** Evita crecimiento ilimitado de memoria (defensa ante DoS con muchas IPs). */
  private evict(now: number): void {
    if (this.buckets.size < MAX_TRACKED_KEYS) return;
    for (const [k, b] of this.buckets) if (b.resetAt <= now) this.buckets.delete(k);
    while (this.buckets.size >= MAX_TRACKED_KEYS) {
      const oldest = this.buckets.keys().next().value;
      if (oldest === undefined) break;
      this.buckets.delete(oldest);
    }
  }
}

export class UpstashRateLimiter implements RateLimiter {
  constructor(
    private readonly url: string,
    private readonly token: string,
    private readonly max: number,
    private readonly windowSeconds: number,
    private readonly fallback: RateLimiter,
  ) {}

  async limit(key: string): Promise<RateLimitResult> {
    const redisKey = `rl:leads:${key}`;
    try {
      const res = await fetch(`${this.url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["INCR", redisKey],
          ["EXPIRE", redisKey, String(this.windowSeconds), "NX"],
          ["TTL", redisKey],
        ]),
        cache: "no-store",
        signal: AbortSignal.timeout(1500),
      });
      if (!res.ok) throw new Error(`upstash_status_${res.status}`);
      const data: unknown = await res.json();
      const rows = Array.isArray(data) ? (data as Array<{ result?: unknown }>) : [];
      const count = Number(rows[0]?.result);
      const ttl = Number(rows[2]?.result);
      if (!Number.isFinite(count)) throw new Error("upstash_bad_response");
      return {
        success: count <= this.max,
        remaining: Math.max(0, this.max - count),
        retryAfter: Number.isFinite(ttl) && ttl > 0 ? ttl : this.windowSeconds,
      };
    } catch {
      // Si Redis falla, degradamos al limitador en memoria en lugar de abrir el endpoint.
      return this.fallback.limit(key);
    }
  }
}

function readPositiveInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

let singleton: RateLimiter | undefined;

export function getLeadsRateLimiter(): RateLimiter {
  if (singleton) return singleton;
  const max = readPositiveInt(process.env.LEADS_RATE_LIMIT_MAX, 5);
  const windowSeconds = readPositiveInt(process.env.LEADS_RATE_LIMIT_WINDOW_SECONDS, 600);
  const memory = new InMemoryRateLimiter(max, windowSeconds * 1000);

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  singleton =
    url && token ? new UpstashRateLimiter(url.replace(/\/$/, ""), token, max, windowSeconds, memory) : memory;
  return singleton;
}

/**
 * IP del cliente. Solo se confía en x-forwarded-for si TRUST_PROXY_HEADERS=true
 * (el despliegue debe estar detrás de un proxy que sobrescriba el header; si no, es falsificable).
 */
export function getClientIp(headers: Headers): string {
  if (process.env.TRUST_PROXY_HEADERS === "true") {
    const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const candidate = forwarded || headers.get("x-real-ip")?.trim();
    if (candidate && /^[0-9a-fA-F:.]{3,45}$/.test(candidate)) return candidate;
  }
  return "unknown";
}
