const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '600', 10) * 1000;

class CacheEntry {
  constructor(data, expiresAt) {
    this.data = data;
    this.expiresAt = expiresAt;
  }

  isExpired() {
    return Date.now() > this.expiresAt;
  }
}

const store = new Map();

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) {
    return null;
  }
  if (entry.isExpired()) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache(key, data, ttlSec) {
  const ttl = ttlSec !== undefined ? ttlSec * 1000 : DEFAULT_TTL;
  const expiresAt = Date.now() + ttl;
  store.set(key, new CacheEntry(data, expiresAt));
}

function deleteExpiredKeys() {
  for (const [key, entry] of store.entries()) {
    if (entry.isExpired()) {
      store.delete(key);
    }
  }
}

setInterval(deleteExpiredKeys, 60000);