import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"
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
