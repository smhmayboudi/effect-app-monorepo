import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { PortRateLimitStorage, RateLimitStorageError } from "../application/PortRateLimitStorage.js"
import { PortRedis } from "../application/PortRedis.js"

export const RateLimitStorageRedis = Layer.effect(
  PortRateLimitStorage,
  PortRedis.pipe(
    Effect.flatMap((redis) =>
      Effect.sync(() =>
        PortRateLimitStorage.of({
          decrement: (key, amount = 1) => {
            return Effect.tryPromise({
              try: async () => await redis.decrby(key, amount),
              catch: (error) => new RateLimitStorageError({ command: "decrement", error })
            })
          },
          delete: (key) =>
            Effect.tryPromise({
              try: async () => await redis.del(key),
              catch: (error) => new RateLimitStorageError({ command: "delete", error })
            }),
          get: (key) => {
            return Effect.tryPromise({
              try: async () => {
                const data = await redis.get(key)

                return data ? JSON.parse(data) : null
              },
              catch: (error) => new RateLimitStorageError({ command: "get", error })
            })
          },
          getWithTtl: (key) => {
            return Effect.tryPromise({
              try: async () => {
                const [ttl, value] = await Promise.all([
                  redis.ttl(key),
                  redis.get(key)
                ])

                return {
                  ttl: ttl > 0 ? ttl * 1000 : -1,
                  value: value ? JSON.parse(value) : null
                }
              },
              catch: (error) => new RateLimitStorageError({ command: "getWithTtl", error })
            })
          },
          increment: (key, amount = 1) => {
            return Effect.tryPromise({
              try: async () => await redis.incrby(key, amount),
              catch: (error) => new RateLimitStorageError({ command: "increment", error })
            })
          },
          set: (key, entry, ttl) => {
            return Effect.tryPromise({
              try: async () => {
                const serialized = JSON.stringify(entry)
                if (ttl) {
                  await redis.setex(key, ttl, serialized)
                } else {
                  await redis.set(key, serialized)
                }
              },
              catch: (error) => new RateLimitStorageError({ command: "set", error })
            })
          }
        })
      )
    )
  )
)
