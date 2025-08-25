import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export class IdempotencyErrorRequestInProgress
  extends Schema.TaggedError<IdempotencyErrorRequestInProgress>("IdempotencyErrorRequestInProgress")(
    "IdempotencyErrorRequestInProgress",
    {},
    HttpApiSchema.annotations({ status: 409 })
  )
{
  get message() {
    return "Request already in progress."
  }
}
