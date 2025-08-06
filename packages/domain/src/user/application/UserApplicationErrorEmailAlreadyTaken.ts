import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { Email } from "./UserApplicationDomain.js"

export class UserErrorEmailAlreadyTaken
  extends Schema.TaggedError<UserErrorEmailAlreadyTaken>("UserErrorEmailAlreadyTaken")(
    "UserErrorEmailAlreadyTaken",
    { email: Email },
    HttpApiSchema.annotations({ status: 404 })
  )
{
  get message() {
    return `${this.email} is already taken.`
  }
}
