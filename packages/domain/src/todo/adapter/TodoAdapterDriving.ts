import * as HttpApiEndpoint from "@effect/platform/HttpApiEndpoint"
import * as HttpApiGroup from "@effect/platform/HttpApiGroup"
import * as OpenApi from "@effect/platform/OpenApi"
import * as Schema from "effect/Schema"
import { PortMiddlewareAuthentication } from "../../PortMiddlewareAuthentication.js"
import { ResponseSuccess, ResponseSuccessArray } from "../../shared/adapter/Response.js"
import { URLParams } from "../../shared/adapter/URLParams.js"
import { IdempotencyError } from "../../shared/application/IdempotencyError.js"
import { IdempotencyErrorKeyMismatch } from "../../shared/application/IdempotencyErrorKeyMismatch.js"
import { IdempotencyErrorKeyRequired } from "../../shared/application/IdempotencyErrorKeyRequired.js"
import { IdempotencyErrorRequestInProgress } from "../../shared/application/IdempotencyErrorRequestInProgress.js"
import { IdempotencyKeyClient } from "../../shared/application/IdempotencyKeyClient.js"
import { TodoId, TodoSchema } from "../application/TodoApplicationDomain.js"
import { TodoErrorAlreadyExists } from "../application/TodoApplicationErrorAlreadyExists.js"
import { TodoErrorNotFound } from "../application/TodoApplicationErrorNotFound.js"

export class TodoDriving extends HttpApiGroup.make("todo")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(IdempotencyError)
      .addError(IdempotencyErrorKeyMismatch)
      .addError(IdempotencyErrorKeyRequired)
      .addError(IdempotencyErrorRequestInProgress)
      .addError(TodoErrorAlreadyExists)
      .addSuccess(ResponseSuccess(TodoId))
      .setHeaders(Schema.Struct({ "idempotency-key": IdempotencyKeyClient }))
      .setPayload(TodoSchema.pipe(Schema.pick("text")))
      .annotate(OpenApi.Description, "Todo create")
      .annotate(OpenApi.Summary, "Todo create")
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(TodoErrorNotFound)
      .addSuccess(ResponseSuccess(TodoId))
      .setPath(Schema.Struct({ id: TodoId }))
      .annotate(OpenApi.Description, "Todo delete")
      .annotate(OpenApi.Summary, "Todo delete")
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(ResponseSuccessArray(TodoSchema))
      .setUrlParams(URLParams(TodoSchema))
      .annotate(OpenApi.Description, "Todo readAll")
      .annotate(OpenApi.Summary, "Todo readAll")
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(TodoErrorNotFound)
      .addSuccess(ResponseSuccess(TodoSchema))
      .setPath(Schema.Struct({ id: TodoId }))
      .annotate(OpenApi.Description, "Todo readById")
      .annotate(OpenApi.Summary, "Todo readById")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(IdempotencyError)
      .addError(IdempotencyErrorKeyMismatch)
      .addError(IdempotencyErrorKeyRequired)
      .addError(IdempotencyErrorRequestInProgress)
      .addError(TodoErrorAlreadyExists)
      .addError(TodoErrorNotFound)
      .addSuccess(ResponseSuccess(TodoId))
      .setHeaders(Schema.Struct({ "idempotency-key": IdempotencyKeyClient }))
      .setPath(Schema.Struct({ id: TodoId }))
      .annotate(OpenApi.Description, "Todo update")
      .annotate(OpenApi.Summary, "Todo update")
  )
  .middlewareEndpoints(PortMiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Todo")
  .annotate(OpenApi.Summary, "Manage Todo")
  .annotate(OpenApi.Title, "Todo")
  .prefix("/todo")
{}
