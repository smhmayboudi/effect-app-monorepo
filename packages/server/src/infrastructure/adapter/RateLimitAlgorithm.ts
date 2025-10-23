import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import type { RateLimitResult } from "../application/PortRateLimitAlgorithm.js"
import { PortRateLimitAlgorithm } from "../application/PortRateLimitAlgorithm.js"
import { PortRateLimitStorage } from "../application/PortRateLimitStorage.js"

export const RateLimitAlgorithmFixedWindow = Layer.effect(
  PortRateLimitAlgorithm,
  PortRateLimitStorage.pipe(
    Effect.flatMap((storage) =>
      Effect.sync(() =>
        PortRateLimitAlgorithm.of({
          check(key, config) {
            const now = Date.now()
            const windowStart = Math.floor(now / config.windowMs) * config.windowMs
            const storageKey = `ratelimit:fixed_window:${key}:${windowStart}`

            return storage.get(storageKey).pipe(
              Effect.map((entry) => entry ?? { count: 0, timestamp: now, windowStart }),
              Effect.flatMap((entry) => {
                const newCount = (entry.count ?? 0) + 1
                const resetTime = windowStart + config.windowMs

                return storage.set(storageKey, { ...entry, count: newCount }, Math.ceil(config.windowMs / 1000)).pipe(
                  Effect.map(() =>
                    ({
                      allowed: newCount <= config.maxRequests,
                      remaining: Math.max(0, config.maxRequests - newCount),
                      resetTime,
                      retryAfter: newCount > config.maxRequests ? Math.ceil((resetTime - now) / 1000) : undefined
                    }) as RateLimitResult
                  )
                )
              })
            )
          }
        })
      )
    )
  )
)

export const RateLimitAlgorithmLeakyBucket = Layer.effect(
  PortRateLimitAlgorithm,
  PortRateLimitStorage.pipe(
    Effect.map((storage) =>
      PortRateLimitAlgorithm.of({
        check(key, config) {
          const now = Date.now()
          const storageKey = `ratelimit:leaky_bucket:${key}`
          const bucketSize = config.bucketSize ?? config.maxRequests
          const leakRate = config.leakRate ?? (config.maxRequests / (config.windowMs / 1000))

          return storage.get(storageKey).pipe(
            Effect.flatMap((entry) => {
              const base = entry ?? { count: 0, lastLeak: now, timestamp: now }
              const timePassed = (now - (base.lastLeak ?? now)) / 1000
              const leaked = Math.max(0, (base.count ?? 0) - timePassed * leakRate)
              const allowed = leaked < bucketSize
              const finalCount = allowed ? leaked + 1 : leaked

              return storage.set(storageKey, {
                ...base,
                count: finalCount,
                lastLeak: now
              }, Math.ceil(bucketSize / leakRate) + 60).pipe(
                Effect.map(() =>
                  ({
                    allowed,
                    remaining: Math.max(0, bucketSize - finalCount),
                    resetTime: now + (allowed ? 0 : Math.ceil((finalCount - bucketSize + 1) / leakRate * 1000)),
                    retryAfter: allowed ? undefined : Math.ceil((finalCount - bucketSize + 1) / leakRate)
                  }) as RateLimitResult
                )
              )
            })
          )
        }
      })
    )
  )
)

export const RateLimitAlgorithmSlidingLogs = Layer.effect(
  PortRateLimitAlgorithm,
  PortRateLimitStorage.pipe(
    Effect.map((storage) =>
      PortRateLimitAlgorithm.of({
        check(key, config) {
          const now = Date.now()
          const storageKey = `ratelimit:sliding_logs:${key}`

          return storage.get(storageKey).pipe(
            Effect.flatMap((entry) => {
              const logs = (entry?.logs && Array.isArray(entry.logs))
                ? entry.logs.filter((ts) => ts > now - config.windowMs)
                : []
              const newLogs = [...logs, now]
              const count = newLogs.length
              const allowed = count <= config.maxRequests
              const minTime = newLogs.length > 0 ? Math.min(...newLogs) : now
              const resetTime = minTime + config.windowMs

              return storage.set(
                storageKey,
                { logs: newLogs, timestamp: now },
                Math.ceil(config.windowMs / 1000)
              ).pipe(
                Effect.map(() =>
                  ({
                    allowed,
                    remaining: Math.max(0, config.maxRequests - count),
                    resetTime,
                    retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000)
                  }) as RateLimitResult
                )
              )
            })
          )
        }
      })
    )
  )
)

export const RateLimitAlgorithmSlidingWindow = Layer.effect(
  PortRateLimitAlgorithm,
  PortRateLimitStorage.pipe(
    Effect.map((storage) =>
      PortRateLimitAlgorithm.of({
        check(key, config) {
          const now = Date.now()
          const currentWindow = Math.floor(now / config.windowMs)
          const currentKey = `ratelimit:sliding_window:${key}:${currentWindow}`
          const previousKey = `ratelimit:sliding_window:${key}:${currentWindow - 1}`

          return Effect.all([storage.get(currentKey), storage.get(previousKey)]).pipe(
            Effect.flatMap(([current, previous]) => {
              const currentCount = current?.count ?? 0
              const previousCount = previous?.count ?? 0
              const progress = (now % config.windowMs) / config.windowMs
              const weightedPrevious = previousCount * (1 - progress)
              const total = currentCount + weightedPrevious

              if (total >= config.maxRequests) {
                const resetTime = (currentWindow + 1) * config.windowMs
                return Effect.succeed({
                  allowed: false,
                  remaining: 0,
                  resetTime,
                  retryAfter: Math.ceil((resetTime - now) / 1000)
                } as RateLimitResult)
              }

              return storage.set(
                currentKey,
                { count: currentCount + 1, timestamp: now },
                Math.ceil(config.windowMs * 2 / 1000)
              ).pipe(
                Effect.map(() =>
                  ({
                    allowed: true,
                    remaining: Math.floor(Math.max(0, config.maxRequests - (currentCount + 1 + weightedPrevious))),
                    resetTime: (currentWindow + 1) * config.windowMs,
                    retryAfter: undefined
                  }) as RateLimitResult
                )
              )
            })
          )
        }
      })
    )
  )
)

export const RateLimitAlgorithmTokenBucket = Layer.effect(
  PortRateLimitAlgorithm,
  PortRateLimitStorage.pipe(
    Effect.map((storage) =>
      PortRateLimitAlgorithm.of({
        check(key, config) {
          const now = Date.now()
          const storageKey = `ratelimit:token_bucket:${key}`
          const bucketSize = config.bucketSize ?? config.maxRequests
          const refillRate = config.refillRate ?? (config.maxRequests / (config.windowMs / 1000))

          return storage.get(storageKey).pipe(
            Effect.flatMap((entry) => {
              const base = entry ?? { tokens: bucketSize, lastRefill: now, timestamp: now }
              const elapsed = (now - (base.lastRefill ?? now)) / 1000
              const currentTokens = Math.min(bucketSize, (base.tokens ?? 0) + elapsed * refillRate)
              const allowed = currentTokens >= 1
              const finalTokens = allowed ? currentTokens - 1 : currentTokens

              return storage.set(
                storageKey,
                { ...base, tokens: finalTokens, lastRefill: now },
                Math.ceil(bucketSize / refillRate) + 60
              ).pipe(
                Effect.map(() => ({
                  allowed,
                  remaining: Math.floor(finalTokens),
                  resetTime: now + (allowed ? 0 : Math.ceil((1 - currentTokens) / refillRate * 1000)),
                  retryAfter: allowed ? undefined : Math.ceil((1 - currentTokens) / refillRate)
                }))
              )
            })
          )
        }
      })
    )
  )
)
