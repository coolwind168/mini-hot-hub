const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '600', 10) * 1000

class CacheEntry<T = any> {
  data: T
  expiresAt: number

  constructor(data: T, expiresAt: number) {
    this.data = data
    this.expiresAt = expiresAt
  }

  isExpired(): boolean {
    return Date.now() > this.expiresAt
  }
}

const store = new Map<string, CacheEntry>()

export function getCache<T = any>(key: string): T | null {
  const entry = store.get(key)
  if (!entry) {
    return null
  }
  if (entry.isExpired()) {
    store.delete(key)
    return null
  }
  return entry.data as T
}

export function setCache<T = any>(key: string, data: T, ttlSec?: number): void {
  const ttl = ttlSec !== undefined ? ttlSec * 1000 : DEFAULT_TTL
  const expiresAt = Date.now() + ttl
  store.set(key, new CacheEntry(data, expiresAt))
}

function deleteExpiredKeys(): void {
  for (const [key, entry] of store.entries()) {
    if (entry.isExpired()) {
      store.delete(key)
    }
  }
}

setInterval(deleteExpiredKeys, 60000)
