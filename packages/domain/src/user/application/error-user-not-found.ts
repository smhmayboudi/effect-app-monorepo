import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { UserId } from "./domain-user.js"

export class ErrorUserNotFound extends Schema.TaggedError<ErrorUserNotFound>("ErrorUserNotFound")(
  "ErrorUserNotFound",
  { id: UserId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
