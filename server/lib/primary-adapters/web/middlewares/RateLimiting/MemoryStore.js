export const MemoryStore = options => {
  const keys = new Map()
  const resetAll = () => keys.clear()
  setInterval(resetAll, options.windowMs)

  return {
    increment: key => {
      if (keys.has(key)) {
        keys.set(key, (keys.get(key) + 1))
      } else {
        keys.set(key, 1)
      }
    },

    decrement: key => keys.set(key, (keys.get(key) - 1)),

    getRemainingFromKey: key => keys.get(key)
  }
}
