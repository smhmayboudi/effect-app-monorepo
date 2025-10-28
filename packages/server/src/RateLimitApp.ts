import * as Config from "effect/Config"
import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { ConfigLive } from "./Config.js"
import { RateLimit } from "./infrastructure/adapter/RateLimit.js"
import { RateLimitStorageRedis } from "./infrastructure/adapter/RateLimitStorage.js"
import { Redis } from "./infrastructure/adapter/Redis.js"
import { PortRateLimit } from "./infrastructure/application/PortRateLimit.js"
import type { RateLimitConfig } from "./infrastructure/application/PortRateLimitAlgorithm.js"

export class PortRateLimitDefaultConfig extends Context.Tag(
  "PortRateLimitDefaultConfig"
)<
  PortRateLimitDefaultConfig,
  {
    readonly defaultConfigs: Record<string, RateLimitConfig>
  }
>() {}

const RateLimitDefaultConfig = Layer.succeed(
  PortRateLimitDefaultConfig,
  PortRateLimitDefaultConfig.of({
    defaultConfigs: {
      "fixed-window": {
        algorithm: "fixed-window",
        maxRequests: 5,
        windowMs: 60000 // 1 minute
      },
      "leaky-bucket": {
        algorithm: "leaky-bucket",
        bucketSize: 5,
        leakRate: 0.2, // requests per second
        maxRequests: 5,
        windowMs: 60000
      },
      "sliding-window": {
        algorithm: "sliding-window",
        maxRequests: 5,
        windowMs: 60000 // 1 minute
      },
      "sliding-logs": {
        algorithm: "sliding-logs",
        maxRequests: 5,
        windowMs: 3600000 // 1 hour
      },
      "token-bucket": {
        algorithm: "token-bucket",
        bucketSize: 5,
        maxRequests: 5,
        refillRate: 0.1, // tokens per second
        windowMs: 60000
      }
    }
  })
)

export const provideLayer = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(
    Effect.provide(
      Layer.mergeAll(
        RateLimitDefaultConfig,
        RateLimit.pipe(
          Layer.provide(RateLimitStorageRedis),
          Layer.provide(
            Redis(ConfigLive.pipe(Config.map((opts) => opts.redis)))
          )
        )
      )
    )
  )

// Helper function to check rate limits with specific algorithm
export const checkRateLimit = (
  identifier: string,
  algorithm: RateLimitConfig["algorithm"],
  customConfig?: Partial<RateLimitConfig>
) =>
  Effect.all([PortRateLimitDefaultConfig, PortRateLimit]).pipe(
    Effect.andThen(([defaultConfig, rateLimiter]) =>
      rateLimiter.check(identifier, {
        ...defaultConfig.defaultConfigs[algorithm],
        ...customConfig,
        algorithm
      })
    )
  )
