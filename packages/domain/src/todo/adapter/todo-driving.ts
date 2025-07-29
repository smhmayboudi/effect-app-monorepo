import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { DomainTodo, TodoId } from "../application/domain-todo.js"
import { ErrorTodoAlreadyExists } from "../application/error-todo-already-exists.js"
import { ErrorTodoNotFound } from "../application/error-todo-not-found.js"

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export class TodoDriving extends HttpApiGroup.make("todo")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(ErrorTodoAlreadyExists, { status: 404 })
      .addSuccess(TodoId)
      .setPayload(Schema.Struct({ text: Schema.NonEmptyTrimmedString }))
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(TodoId)
      .setPath(Schema.Struct({ id: TodoIdFromString }))
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(Schema.Array(DomainTodo))
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(DomainTodo)
      .setPath(Schema.Struct({ id: TodoIdFromString }))
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(TodoId)
      .setPath(Schema.Struct({ id: TodoIdFromString }))
  )
  .prefix("/todo")
  .annotate(OpenApi.Description, "Manage Todo")
  .annotate(OpenApi.Title, "Todo")
{}
