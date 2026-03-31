import Redis from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = import.meta.env.REDIS_URL || process.env.REDIS_URL;
  if (!url) return null;

  redis = new Redis(url);
  return redis;
}

export async function incrementViews(slug: string): Promise<number> {
  const r = getRedis();
  if (!r) return 0;

  try {
    return await r.incr(`views:${slug}`);
  } catch {
    return 0;
  }
}

export async function getViews(slug: string): Promise<number> {
  const r = getRedis();
  if (!r) return 0;

  try {
    const val = await r.get(`views:${slug}`);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export async function getAllViews(slugs: string[]): Promise<Record<string, number>> {
  const r = getRedis();
  const result: Record<string, number> = {};

  if (!r || slugs.length === 0) return result;

  try {
    const keys = slugs.map(s => `views:${s}`);
    const values = await r.mget(...keys);
    for (let i = 0; i < slugs.length; i++) {
      result[slugs[i]] = values[i] ? parseInt(values[i], 10) : 0;
    }
  } catch {
    // Return empty counts if Redis unavailable
  }

  return result;
}
