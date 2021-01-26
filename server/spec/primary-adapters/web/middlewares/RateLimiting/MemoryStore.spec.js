import { MemoryStore } from '../../../../../lib/primary-adapters/web/middlewares/RateLimiting/MemoryStore.js'

beforeAll(() => jest.useFakeTimers())

describe('Rate Limiter - Memory Store', () => {
  it('sets a new key`s value to 1 by default', () => {
    const sut = MemoryStore({ windowMs: 500 })
    const key = 'ip'
    sut.increment(key)

    const value = sut.getRemainingFromKey(key)

    expect(value).toBe(1)
  })

  it('increments a key if key already exists', () => {
    const sut = MemoryStore({ windowMs: 500 })
    const key = 'ip'
    sut.increment(key)
    sut.increment(key)

    const value = sut.getRemainingFromKey(key)

    expect(value).toBe(2)
  })

  it('decrements a key', () => {
    const sut = MemoryStore({ windowMs: 500 })
    const key = 'ip'
    sut.increment(key)
    sut.increment(key)
    sut.decrement(key)

    const value = sut.getRemainingFromKey(key)

    expect(value).toBe(1)
  })

  it('resets the key after the specified window time', () => {
    const sut = MemoryStore({ windowMs: 500 })
    const key = 'ip'
    sut.increment(key)

    setTimeout(() => {
      const value = sut.getRemainingFromKey(key)
      expect(value).toBeNull()
    }, 501)
  })
})
