import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { UserId } from "@template/domain/user/application/domain-user"

export class ErrorUserNotFound extends Schema.TaggedError<ErrorUserNotFound>("ErrorUserNotFound")(
  "ErrorUserNotFound",
  { id: UserId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
