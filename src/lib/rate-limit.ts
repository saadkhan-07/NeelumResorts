/**
 * A small in-memory sliding-window limiter for the public enquiry endpoint.
 *
 * Best-effort by design: memory is per server instance, so on a host that runs
 * several instances (Vercel functions) a determined sender gets the limit once
 * per instance. That still stops the realistic abuse — one script or one bored
 * visitor hammering the form — without adding a paid service. If spam ever gets
 * past it, swap this for Upstash Redis behind the same `allow()` signature.
 */

type Window = { hits: number[] };

const buckets = new Map<string, Window>();
let lastSweep = Date.now();

export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Forget idle keys now and then so the map cannot grow without bound.
  if (now - lastSweep > windowMs) {
    for (const [k, w] of buckets) {
      if (w.hits.every((t) => now - t > windowMs)) buckets.delete(k);
    }
    lastSweep = now;
  }

  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  return true;
}

/** The caller's IP as the proxy reports it; "unknown" shares one bucket. */
export function clientIp(h: Headers): string {
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}
