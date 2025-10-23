import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"

export class AuthenticationError extends Schema.TaggedError<AuthenticationError>("AuthenticationError")(
  "AuthenticationError",
  { error: Schema.Unknown },
  HttpApiSchema.annotations({ status: 500 })
) {}
