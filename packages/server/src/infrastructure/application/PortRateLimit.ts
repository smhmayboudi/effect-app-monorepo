import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
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
