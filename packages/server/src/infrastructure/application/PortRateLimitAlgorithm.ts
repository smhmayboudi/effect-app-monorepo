import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"
import type { RateLimitStorageError } from "./PortRateLimitStorage.js"

export interface RateLimitConfig {
  algorithm: "fixed-window" | "sliding-logs" | "sliding-window" | "leaky-bucket" | "token-bucket"
  bucketSize?: number // For leaky bucket and token bucket
  leakRate?: number // For leaky bucket (requests per second)
  maxRequests: number
  refillRate?: number // For token bucket (tokens per second)
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number | undefined
}

export class PortRateLimitAlgorithm extends Context.Tag("PortRateLimitAlgorithm")<PortRateLimitAlgorithm, {
  check: (key: string, config: RateLimitConfig) => Effect.Effect<RateLimitResult, RateLimitStorageError>
}>() {}
