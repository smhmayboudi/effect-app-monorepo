import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { UserId } from "./UserApplicationDomain.js"

export class UserErrorNotFound extends Schema.TaggedError<UserErrorNotFound>("UserErrorNotFound")(
  "UserErrorNotFound",
  { id: UserId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
