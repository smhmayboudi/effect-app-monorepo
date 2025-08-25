import { Schema } from "effect"

export const IdempotencyKeyClient = Schema.String.pipe(
  Schema.brand("IdempotencyKeyClient"),
  Schema.annotations({ description: "Idempotency Key" })
)
export type IdempotencyKeyClient = typeof IdempotencyKeyClient.Type
