import { HttpApiSchema } from "@effect/platform"
import { Email } from "@template/domain/user/application/domain-user"
import { Schema } from "effect"

export class ErrorUserEmailAlreadyTaken
  extends Schema.TaggedError<ErrorUserEmailAlreadyTaken>("ErrorUserEmailAlreadyTaken")(
    "ErrorUserEmailAlreadyTaken",
    { email: Email },
    HttpApiSchema.annotations({ status: 404 })
  )
{
  get message() {
    return `${this.email} is already taken.`
  }
}
