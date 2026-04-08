import type { APIRoute } from "astro";
import Redis from "ioredis";

const SECRET = import.meta.env.VOID_SECRET || process.env.VOID_SECRET;
const TOKEN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = import.meta.env.REDIS_URL || process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url);
  return redis;
}

async function sign(timestamp: string): Promise<string> {
  const data = new TextEncoder().encode(timestamp + SECRET);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + SECRET);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

function getClientIp(request: Request): string {
  // x-vercel-forwarded-for is Vercel's trusted header (can't be spoofed)
  // Fall back to last entry in x-forwarded-for (Vercel appends real IP at end)
  return request.headers.get("x-vercel-forwarded-for")
    || request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export const POST: APIRoute = async ({ request }) => {
  const r = getRedis();

  // No secret or no Redis — dev mode, return 1
  if (!SECRET || !r) {
    return new Response(JSON.stringify({ count: 1 }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse body
  let body: { token?: string } = {};
  try { body = await request.json(); } catch {}

  const token = body.token;
  if (!token || token === "dev") {
    return new Response(JSON.stringify({ error: "missing token" }), { status: 400 });
  }

  const [ts, sig] = token.split(":");
  if (!ts || !sig) {
    return new Response(JSON.stringify({ error: "invalid token" }), { status: 400 });
  }

  // Check token age
  const age = Date.now() - parseInt(ts, 10);
  if (isNaN(age) || age < 0 || age > TOKEN_WINDOW_MS) {
    return new Response(JSON.stringify({ error: "expired token" }), { status: 400 });
  }

  // Verify signature
  const expected = await sign(ts);
  if (sig !== expected) {
    return new Response(JSON.stringify({ error: "invalid token" }), { status: 400 });
  }

  try {
    // Atomic one-time-use check: SET NX returns "OK" only if key didn't exist
    const tokenKey = `void:token:${sig.slice(0, 16)}`;
    const isNew = await r.set(tokenKey, "pending", "EX", 600, "NX");

    if (!isNew) {
      // Token already used — return the stored count
      const storedCount = await r.get(tokenKey);
      const count = storedCount && storedCount !== "pending" ? parseInt(storedCount, 10) : 1;
      return new Response(JSON.stringify({ count }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check IP dedup
    const ip = getClientIp(request);
    const ipKey = `void:ip:${await hashIp(ip)}`;
    const existingCount = await r.get(ipKey);

    let count: number;
    if (existingCount) {
      // Same IP — return their existing number
      count = parseInt(existingCount, 10);
    } else {
      // New visitor — increment global counter
      count = await r.incr("void:count");
      await r.set(ipKey, count.toString());
    }

    // Update token key with the actual count (for replay lookups)
    await r.set(tokenKey, count.toString(), "EX", 600);

    return new Response(JSON.stringify({ count }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ count: 1 }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
