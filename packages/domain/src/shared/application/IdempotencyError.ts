import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { IdempotencyKeyClient } from "./IdempotencyKeyClient.js"

export class IdempotencyError extends Schema.TaggedError<IdempotencyError>("IdempotencyError")(
  "IdempotencyError",
  {
    error: Schema.optionalWith(Schema.Unknown, { exact: true }),
    key: IdempotencyKeyClient,
    text: Schema.String
  },
  HttpApiSchema.annotations({ status: 400 })
) {
  get message() {
    return `${this.text} with idempotency key ${this.key}${this.error ? ` ${this.error}` : ""}.`
  }
}
