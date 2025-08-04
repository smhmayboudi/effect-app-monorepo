import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { PersonId } from "./domain-person.js"

export class ErrorPersonNotFound extends Schema.TaggedError<ErrorPersonNotFound>("ErrorPersonNotFound")(
  "ErrorPersonNotFound",
  { id: PersonId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
