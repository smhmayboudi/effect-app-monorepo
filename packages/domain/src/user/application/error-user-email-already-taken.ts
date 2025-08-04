import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { Email } from "./domain-user.js"

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
