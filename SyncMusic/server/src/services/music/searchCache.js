const cache = new Map();
const MAX_ENTRIES = 300;

export async function cachedSearch(key, ttlSeconds, loader) {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) return hit.value;
  if (hit) cache.delete(key);
  const value = await loader();
  cache.set(key, { value, expiresAt: now + Math.max(1, ttlSeconds) * 1000 });
  if (cache.size > MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  return value;
}
export function clearSearchCache() { cache.clear(); }
