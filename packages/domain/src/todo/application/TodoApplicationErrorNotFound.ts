import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { TodoId } from "./TodoApplicationDomain.js"

export class TodoErrorNotFound extends Schema.TaggedError<TodoErrorNotFound>("TodoErrorNotFound")(
  "TodoErrorNotFound",
  { id: TodoId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
