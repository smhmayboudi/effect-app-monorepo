import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { TodoId } from "@template/domain/todo/application/domain-todo"

export class ErrorTodoNotFound extends Schema.TaggedError<ErrorTodoNotFound>("ErrorTodoNotFound")(
  "ErrorTodoNotFound",
  { id: TodoId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
