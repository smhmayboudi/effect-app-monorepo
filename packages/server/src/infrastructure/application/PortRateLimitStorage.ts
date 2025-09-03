import { HttpApiSchema } from "@effect/platform"
import type { Effect } from "effect"
import { Context, Schema } from "effect"

export class RateLimitStorageError extends Schema.TaggedError<RateLimitStorageError>("RateLimitStorageError")(
  "RateLimitStorageError",
  {
    command: Schema.Literal(
      "decrement",
      "delete",
      "get",
      "getWithTtl",
      "increment",
      "set"
    ),
    error: Schema.Unknown
  },
  HttpApiSchema.annotations({ status: 500 })
) {
  get message() {
    return `Redis ${this.command} failed: ${this.error}.`
  }
}

export interface RateLimitEntry {
  count?: number
  timestamp: number
  windowStart?: number
  tokens?: number
  lastRefill?: number
  logs?: Array<number>
  lastLeak?: number
}

export class PortRateLimitStorage extends Context.Tag("PortRateLimitStorage")<PortRateLimitStorage, {
  readonly decrement: (key: string, amount?: number) => Effect.Effect<number, RateLimitStorageError>
  readonly delete: (key: string) => Effect.Effect<number, RateLimitStorageError>
  readonly get: (key: string) => Effect.Effect<RateLimitEntry | null, RateLimitStorageError>
  readonly getWithTtl: (
    key: string
  ) => Effect.Effect<{ ttl: number; value: RateLimitEntry | null }, RateLimitStorageError>
  readonly increment: (key: string, amount?: number) => Effect.Effect<number, RateLimitStorageError>
  readonly set: (key: string, entry: RateLimitEntry, ttl?: number) => Effect.Effect<void, RateLimitStorageError>
}>() {}
