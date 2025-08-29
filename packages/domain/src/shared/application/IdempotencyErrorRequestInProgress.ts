import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { IdempotencyKeyClient } from "./IdempotencyKeyClient.js"

export class IdempotencyErrorRequestInProgress
  extends Schema.TaggedError<IdempotencyErrorRequestInProgress>("IdempotencyErrorRequestInProgress")(
    "IdempotencyErrorRequestInProgress",
    { key: IdempotencyKeyClient },
    HttpApiSchema.annotations({ status: 409 })
  )
{
  get message() {
    return "Request already in progress."
  }
}
