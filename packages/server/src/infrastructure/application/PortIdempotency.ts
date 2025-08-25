import type { IdempotencyError } from "@template/domain/shared/application/IdempotencyError"
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient"
import type { Effect, Option } from "effect"
import { Context, Schema } from "effect"

export const IdempotencyKeyServer = Schema.Struct({
  clientKey: IdempotencyKeyClient,
  dataHash: Schema.String,
  value: Schema.String
})
  .pipe(
    Schema.brand("IdempotencyKeyServer"),
    Schema.annotations({ description: "Idempotency Key" })
  )
export type IdempotencyKeyServer = typeof IdempotencyKeyServer.Type

export interface IdempotencyRecord {
  readonly key: IdempotencyKeyServer
  readonly response?: unknown
  readonly status: "in_progress" | "completed" | "failed"
  readonly createdAt: Date
  readonly updatedAt: Date
}

export class PortIdempotency extends Context.Tag("PortIdempotency")<PortIdempotency, {
  readonly complete: (
    key: IdempotencyKeyServer,
    response: unknown
  ) => Effect.Effect<void, IdempotencyError>
  readonly fail: (
    key: IdempotencyKeyServer
  ) => Effect.Effect<void, IdempotencyError>
  readonly retrieve: (
    key: IdempotencyKeyServer
  ) => Effect.Effect<Option.Option<IdempotencyRecord>, IdempotencyError>
  readonly store: (
    key: IdempotencyKeyServer
  ) => Effect.Effect<void, IdempotencyError>
}>() {}
