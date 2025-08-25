import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export class IdempotencyErrorKeyRequired
  extends Schema.TaggedError<IdempotencyErrorKeyRequired>("IdempotencyErrorKeyRequired")(
    "IdempotencyErrorKeyRequired",
    {},
    HttpApiSchema.annotations({ status: 400 })
  )
{
  get message() {
    return "Idempotency-Key header required."
  }
}
