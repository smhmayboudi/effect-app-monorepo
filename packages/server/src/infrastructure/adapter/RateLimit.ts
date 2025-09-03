import { Effect, Layer, Option } from "effect"
import { PortRateLimit, RateLimitError } from "../application/PortRateLimit.js"
import { PortRateLimitAlgorithm, type RateLimitConfig } from "../application/PortRateLimitAlgorithm.js"
import { PortRateLimitStorage } from "../application/PortRateLimitStorage.js"
import {
  RateLimitAlgorithmFixedWindow,
  RateLimitAlgorithmLeakyBucket,
  RateLimitAlgorithmSlidingLogs,
  RateLimitAlgorithmSlidingWindow,
  RateLimitAlgorithmTokenBucket
} from "./RateLimitAlgorithm.js"

export const RateLimit = Layer.effect(
  PortRateLimit,
  PortRateLimitStorage.pipe(Effect.flatMap((storage) =>
    Effect.sync(() => {
      const algorithmLayers: Record<string, Layer.Layer<PortRateLimitAlgorithm, never, PortRateLimitStorage>> = {
        "fixed-window": RateLimitAlgorithmFixedWindow,
        "leaky-bucket": RateLimitAlgorithmLeakyBucket,
        "sliding-logs": RateLimitAlgorithmSlidingLogs,
        "sliding-window": RateLimitAlgorithmSlidingWindow,
        "token-bucket": RateLimitAlgorithmTokenBucket
      }

      return PortRateLimit.of({
        check: (identifier: string, config: RateLimitConfig) => {
          const algorithmLayer = algorithmLayers[config.algorithm]
          if (!algorithmLayer) {
            return Effect.fail(
              new RateLimitError({ message: `Unknown algorithm: ${config.algorithm}`, retryAfter: 60 })
            )
          }

          return Effect.serviceOption(PortRateLimitAlgorithm).pipe(
            Effect.provide(algorithmLayer.pipe(
              Layer.provide(Layer.succeed(PortRateLimitStorage, storage))
            )),
            Effect.flatMap(Option.match({
              onNone: () =>
                Effect.fail(
                  new RateLimitError({
                    message: `Algorithm service not available: ${config.algorithm}`,
                    retryAfter: 60
                  })
                ),
              onSome: Effect.succeed
            }))
          ).pipe(
            Effect.flatMap((alg) =>
              alg.check(identifier, config).pipe(
                Effect.mapError((error) =>
                  new RateLimitError({ message: `Rate limit check failed: ${error}`, retryAfter: 60 })
                ),
                Effect.flatMap((result) => {
                  if (!result.allowed) {
                    return Effect.fail(
                      new RateLimitError({ message: "Rate limit exceeded", retryAfter: result.retryAfter || 60 })
                    )
                  }

                  return Effect.succeed(result)
                })
              )
            )
          )
        }
      })
    })
  ))
)
