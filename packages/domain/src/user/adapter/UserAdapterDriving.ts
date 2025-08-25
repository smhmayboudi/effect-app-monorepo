import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { PortMiddlewareAuthentication } from "../../PortMiddlewareAuthentication.js"
import { ResponseSuccess, ResponseSuccessArray } from "../../shared/adapter/Response.js"
import { URLParams } from "../../shared/adapter/URLParams.js"
import { IdempotencyError } from "../../shared/application/IdempotencyError.js"
import { IdempotencyErrorKeyMismatch } from "../../shared/application/IdempotencyErrorKeyMismatch.js"
import { IdempotencyErrorKeyRequired } from "../../shared/application/IdempotencyErrorKeyRequired.js"
import { IdempotencyErrorRequestInProgress } from "../../shared/application/IdempotencyErrorRequestInProgress.js"
import { IdempotencyKeyClient } from "../../shared/application/IdempotencyKeyClient.js"
import { UserId, UserSchema, UserWithSensitiveSchema } from "../application/UserApplicationDomain.js"
import { UserErrorEmailAlreadyTaken } from "../application/UserApplicationErrorEmailAlreadyTaken.js"
import { UserErrorNotFound } from "../application/UserApplicationErrorNotFound.js"

export class UserDriving extends HttpApiGroup.make("user")
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(UserErrorNotFound)
      .addSuccess(ResponseSuccess(UserId))
      .setPath(Schema.Struct({ id: UserId }))
      .annotate(OpenApi.Description, "User delete")
      .annotate(OpenApi.Summary, "User delete")
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(ResponseSuccessArray(UserSchema))
      .setUrlParams(URLParams(UserSchema))
      .annotate(OpenApi.Description, "User readAll")
      .annotate(OpenApi.Summary, "User readAll")
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(UserErrorNotFound)
      .addSuccess(ResponseSuccess(UserSchema))
      .setPath(Schema.Struct({ id: UserId }))
      .annotate(OpenApi.Description, "User readById")
      .annotate(OpenApi.Summary, "User readById")
  )
  .add(
    HttpApiEndpoint.get("readByIdWithSensitive", "/me")
      .addSuccess(ResponseSuccess(UserWithSensitiveSchema))
      .annotate(OpenApi.Description, "User readByIdWithSensitive")
      .annotate(OpenApi.Summary, "User readByIdWithSensitive")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(IdempotencyError)
      .addError(IdempotencyErrorKeyMismatch)
      .addError(IdempotencyErrorRequestInProgress)
      .addError(IdempotencyErrorKeyRequired)
      .addError(UserErrorEmailAlreadyTaken)
      .addError(UserErrorNotFound)
      .addSuccess(ResponseSuccess(UserId))
      .setHeaders(Schema.Struct({ "idempotency-key": IdempotencyKeyClient }))
      .setPath(Schema.Struct({ id: UserId }))
      .setPayload(UserSchema.pipe(Schema.pick("email")))
      .annotate(OpenApi.Description, "User update")
      .annotate(OpenApi.Summary, "User update")
  )
  .middlewareEndpoints(PortMiddlewareAuthentication)
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(IdempotencyError)
      .addError(IdempotencyErrorKeyMismatch)
      .addError(IdempotencyErrorRequestInProgress)
      .addError(IdempotencyErrorKeyRequired)
      .addError(UserErrorEmailAlreadyTaken)
      .addSuccess(ResponseSuccess(UserWithSensitiveSchema))
      .setHeaders(Schema.Struct({ "idempotency-key": IdempotencyKeyClient }))
      .setPayload(UserSchema.pipe(Schema.pick("email")))
      .annotate(OpenApi.Description, "User create")
      .annotate(OpenApi.Summary, "User create")
  )
  .annotate(OpenApi.Description, "Manage User")
  .annotate(OpenApi.Summary, "Manage User")
  .annotate(OpenApi.Title, "User")
  .prefix("/user")
{}
