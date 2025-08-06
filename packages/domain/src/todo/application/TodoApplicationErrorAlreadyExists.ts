import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export class TodoErrorAlreadyExists extends Schema.TaggedError<TodoErrorAlreadyExists>("TodoErrorAlreadyExists")(
  "TodoErrorAlreadyExists",
  { text: Schema.NonEmptyTrimmedString },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.text} is already exists.`
  }
}
