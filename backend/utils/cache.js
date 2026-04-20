export const createTTLCache = ({ ttlMs = 3000, maxEntries = 100 } = {}) => {
  const store = new Map()

  const pruneExpired = () => {
    const now = Date.now()

    for (const [key, entry] of store.entries()) {
      if (entry.expiresAt <= now) {
        store.delete(key)
      }
    }
  }

  const ensureCapacity = () => {
    while (store.size > maxEntries) {
      const oldestKey = store.keys().next().value
      store.delete(oldestKey)
    }
  }

  return {
    get(key) {
      const entry = store.get(key)
      if (!entry) {
        return null
      }

      if (entry.expiresAt <= Date.now()) {
        store.delete(key)
        return null
      }

      return entry.value
    },
    set(key, value) {
      pruneExpired()
      store.set(key, {
        value,
        expiresAt: Date.now() + ttlMs
      })
      ensureCapacity()
      return value
    },
    clear() {
      store.clear()
    }
  }
}
