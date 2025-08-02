import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { DomainTodo, TodoId } from "../application/domain-todo.js"
import { ErrorTodoAlreadyExists } from "../application/error-todo-already-exists.js"
import { ErrorTodoNotFound } from "../application/error-todo-not-found.js"
import { MiddlewareAuthentication } from "../../middleware-authentication.js"
import { ResponseSuccess } from "../../shared/adapter/response.js"

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export class TodoDriving extends HttpApiGroup.make("todo")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(ErrorTodoAlreadyExists, { status: 404 })
      .addSuccess(ResponseSuccess(TodoId))
      .annotate(OpenApi.Description, "Todo create")
      .annotate(OpenApi.Summary, "Todo create")
      .setPayload(Schema.Struct({ text: Schema.NonEmptyTrimmedString }))
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(ResponseSuccess(TodoId))
      .annotate(OpenApi.Description, "Todo delete")
      .annotate(OpenApi.Summary, "Todo delete")
      .setPath(Schema.Struct({ id: TodoIdFromString }))
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(ResponseSuccess(Schema.Array(DomainTodo)))
      .annotate(OpenApi.Description, "Todo readAll")
      .annotate(OpenApi.Summary, "Todo readAll")
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(ResponseSuccess(DomainTodo))
      .annotate(OpenApi.Description, "Todo readById")
      .annotate(OpenApi.Summary, "Todo readById")
      .setPath(Schema.Struct({ id: TodoIdFromString }))
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(ResponseSuccess(TodoId))
      .annotate(OpenApi.Description, "Todo update")
      .annotate(OpenApi.Summary, "Todo update")
      .setPath(Schema.Struct({ id: TodoIdFromString }))
  )
  .middlewareEndpoints(MiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Todo")
  .annotate(OpenApi.Summary, "Manage Todo")
  .annotate(OpenApi.Title, "Todo")
  .prefix("/todo")
{}
