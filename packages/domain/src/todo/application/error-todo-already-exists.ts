import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export class ErrorTodoAlreadyExists extends Schema.TaggedError<ErrorTodoAlreadyExists>("TodoErrorAlreadyExists")(
  "ErrorTodoAlreadyExists",
  { text: Schema.NonEmptyTrimmedString },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.text} is already exists.`
  }
}
