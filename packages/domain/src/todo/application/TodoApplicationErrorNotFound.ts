import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"
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
