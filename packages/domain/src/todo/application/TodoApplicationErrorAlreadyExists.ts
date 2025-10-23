import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"

export class TodoErrorAlreadyExists extends Schema.TaggedError<TodoErrorAlreadyExists>("TodoErrorAlreadyExists")(
  "TodoErrorAlreadyExists",
  { text: Schema.NonEmptyTrimmedString },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.text} is already exists.`
  }
}
