import { HttpApiSchema } from "@effect/platform"
import type { Effect } from "effect"
import { Context, Schema } from "effect"
import type { RateLimitConfig, RateLimitResult } from "./PortRateLimitAlgorithm.js"

export class RateLimitError extends Schema.TaggedError<RateLimitError>("RateLimitError")(
  "RateLimitError",
  {
    message: Schema.String,
    retryAfter: Schema.Number
  },
  HttpApiSchema.annotations({ status: 429 })
) {}

export class PortRateLimit extends Context.Tag("PortRateLimit")<PortRateLimit, {
  check: (identifier: string, config: RateLimitConfig) => Effect.Effect<RateLimitResult, RateLimitError>
}>() {}
