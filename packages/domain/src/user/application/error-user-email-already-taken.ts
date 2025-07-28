import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export class ErrorUserEmailAlreadyTaken
  extends Schema.TaggedError<ErrorUserEmailAlreadyTaken>("ErrorUserEmailAlreadyTaken")(
    "ErrorUserEmailAlreadyTaken",
    { email: Schema.NonEmptyString },
    HttpApiSchema.annotations({ status: 404 })
  )
{
  get message() {
    return `${this.email} is already taken.`
  }
}
