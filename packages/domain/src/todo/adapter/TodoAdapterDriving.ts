import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { MiddlewareAuthentication } from "../../MiddlewareAuthentication.js"
import { ResponseSuccess } from "../../shared/adapter/Response.js"
import { URLParams } from "../../shared/adapter/URLParams.js"
import { Todo, TodoId } from "../application/TodoApplicationDomain.js"
import { TodoErrorAlreadyExists } from "../application/TodoApplicationErrorAlreadyExists.js"
import { TodoErrorNotFound } from "../application/TodoApplicationErrorNotFound.js"

export const TodoIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(TodoId)
)

export class TodoDriving extends HttpApiGroup.make("todo")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(TodoErrorAlreadyExists, { status: 404 })
      .addSuccess(ResponseSuccess(TodoId))
      .setPayload(Todo.pipe(Schema.pick("text")))
      .annotate(OpenApi.Description, "Todo create")
      .annotate(OpenApi.Summary, "Todo create")
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(TodoErrorNotFound, { status: 404 })
      .addSuccess(ResponseSuccess(TodoId))
      .setPath(Schema.Struct({ id: TodoIdFromString }))
      .annotate(OpenApi.Description, "Todo delete")
      .annotate(OpenApi.Summary, "Todo delete")
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(ResponseSuccess(Schema.Array(Todo)))
      .setUrlParams(URLParams(Todo))
      .annotate(OpenApi.Description, "Todo readAll")
      .annotate(OpenApi.Summary, "Todo readAll")
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(TodoErrorNotFound, { status: 404 })
      .addSuccess(ResponseSuccess(Todo))
      .setPath(Schema.Struct({ id: TodoIdFromString }))
      .annotate(OpenApi.Description, "Todo readById")
      .annotate(OpenApi.Summary, "Todo readById")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(TodoErrorNotFound, { status: 404 })
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
