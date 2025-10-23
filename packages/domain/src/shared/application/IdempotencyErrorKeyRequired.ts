import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"

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
