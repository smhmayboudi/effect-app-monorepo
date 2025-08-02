import { HttpApiSchema } from "@effect/platform"
import { UserId } from "@template/domain/user/application/domain-user"
import { Schema } from "effect"

export class ErrorUserNotFound extends Schema.TaggedError<ErrorUserNotFound>("ErrorUserNotFound")(
  "ErrorUserNotFound",
  { id: UserId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
