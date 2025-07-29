import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { TodoId } from "./domain-todo.js"

export class ErrorTodoNotFound extends Schema.TaggedError<ErrorTodoNotFound>("ErrorTodoNotFound")(
  "ErrorTodoNotFound",
  { id: TodoId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
