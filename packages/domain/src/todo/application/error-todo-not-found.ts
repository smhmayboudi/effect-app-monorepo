import { HttpApiSchema } from "@effect/platform"
import { TodoId } from "@template/domain/todo/application/domain-todo"
import { Schema } from "effect"

export class ErrorTodoNotFound extends Schema.TaggedError<ErrorTodoNotFound>("ErrorTodoNotFound")(
  "ErrorTodoNotFound",
  { id: TodoId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
