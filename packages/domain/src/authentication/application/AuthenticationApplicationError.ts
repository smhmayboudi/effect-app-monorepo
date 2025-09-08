import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export class AuthenticationError extends Schema.TaggedError<AuthenticationError>("AuthenticationError")(
  "AuthenticationError",
  { error: Schema.Unknown },
  HttpApiSchema.annotations({ status: 500 })
) {}
