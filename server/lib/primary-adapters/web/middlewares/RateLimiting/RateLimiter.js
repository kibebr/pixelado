import { MemoryStore } from './MemoryStore.js'

const defaultOptions = {
  windowMs: 86400000,
  max: 500,
  statusCode: 429,
  message: 'Too many requests, try again later.'
}

export const createRateLimiter = _options => {
  const options = { ...defaultOptions, ..._options }
  const memoryStore = MemoryStore({ windowMs: options.windowMs })

  return (req, res, next) => {
    memoryStore.increment(req.ip)

    const current = memoryStore.getRemainingFromKey(req.ip)
    const remaining = Math.max(options.max - current, 0)

    if (!res.headersSent) {
      res.setHeader('X-RateLimit-Limit', options.max)
      res.setHeader('X-RateLimit-Remaining', remaining)
    }

    if (options.skipFailedRequests) {
      res.on('finish', () => {
        if (res.statusCode <= 400) {
          memoryStore.decrement(req.ip)
        }
      })
    }

    if (options.max && current >= options.max + 1) {
      return res.status(options.statusCode).json(options.message)
    } else {
      next()
    }
  }
}
