import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"
import { IdempotencyKeyClient } from "./IdempotencyKeyClient.js"

export class IdempotencyErrorKeyMismatch
  extends Schema.TaggedError<IdempotencyErrorKeyMismatch>("IdempotencyErrorKeyMismatch")(
    "IdempotencyErrorKeyMismatch",
    { key: IdempotencyKeyClient },
    HttpApiSchema.annotations({ status: 409 })
  )
{
  get message() {
    return `Idempotency key ${this.key} already used with different data. Please use a new idempotency key.`
  }
}
