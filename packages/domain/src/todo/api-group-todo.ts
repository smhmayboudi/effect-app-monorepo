import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { DomainTodo, TodoId } from "./application/domain-todo.js"
import { ErrorTodoAlreadyExists } from "./application/error-todo-already-exists.js"
import { ErrorTodoNotFound } from "./application/error-todo-not-found.js"

export class TodoCreatePayload extends Schema.Class<TodoCreatePayload>("TodoCreatePayload")({
  text: Schema.NonEmptyTrimmedString
}) {}

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)
export class TodoPath extends Schema.Class<TodoPath>("TodoPath")({
  id: TodoIdFromString
}) {}

export class ApiGroupTodo extends HttpApiGroup.make("todo")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(ErrorTodoAlreadyExists, { status: 404 })
      .addSuccess(TodoId)
      .setPayload(TodoCreatePayload)
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(TodoId)
      .setPath(TodoPath)
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(Schema.Array(DomainTodo))
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(DomainTodo)
      .setPath(TodoPath)
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(TodoId)
      .setPath(TodoPath)
  )
  .prefix("/todo")
  .annotate(OpenApi.Description, "Manage Todo")
  .annotate(OpenApi.Title, "Todo")
{}
