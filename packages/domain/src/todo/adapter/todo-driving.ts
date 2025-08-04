import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { MiddlewareAuthentication } from "../../middleware-authentication.js"
import { ResponseSuccess } from "../../shared/adapter/response.js"
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
      .addSuccess(ResponseSuccess(TodoId))
      .setPayload(DomainTodo.pipe(Schema.pick("text")))
      .annotate(OpenApi.Description, "Todo create")
      .annotate(OpenApi.Summary, "Todo create")
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(ResponseSuccess(TodoId))
      .setPath(Schema.Struct({ id: TodoIdFromString }))
      .annotate(OpenApi.Description, "Todo delete")
      .annotate(OpenApi.Summary, "Todo delete")
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
      .setPath(Schema.Struct({ id: TodoIdFromString }))
      .annotate(OpenApi.Description, "Todo readById")
      .annotate(OpenApi.Summary, "Todo readById")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(ErrorTodoNotFound, { status: 404 })
      .addSuccess(ResponseSuccess(TodoId))
      .setPath(Schema.Struct({ id: TodoIdFromString }))
      .annotate(OpenApi.Description, "Todo update")
      .annotate(OpenApi.Summary, "Todo update")
  )
  .middlewareEndpoints(MiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Todo")
  .annotate(OpenApi.Summary, "Manage Todo")
  .annotate(OpenApi.Title, "Todo")
  .prefix("/todo")
{}
