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
import { ServiceId, ServiceSchema } from "../application/ServiceApplicationDomain.js"
import { ServiceErrorAlreadyExists } from "../application/ServiceApplicationErrorAlreadyExists.js"
import { ServiceErrorNotFound } from "../application/ServiceApplicationErrorNotFound.js"

export class ServiceDriving extends HttpApiGroup.make("service")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(IdempotencyError)
      .addError(IdempotencyErrorKeyMismatch)
      .addError(IdempotencyErrorKeyRequired)
      .addError(IdempotencyErrorRequestInProgress)
      .addError(ServiceErrorAlreadyExists)
      .addSuccess(ResponseSuccess(ServiceId))
      .setHeaders(Schema.Struct({ "idempotency-key": IdempotencyKeyClient }))
      .setPayload(ServiceSchema.pipe(Schema.pick("name")))
      .annotate(OpenApi.Description, "Service create")
      .annotate(OpenApi.Summary, "Service create")
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id")
      .addError(ServiceErrorNotFound)
      .addSuccess(ResponseSuccess(ServiceId))
      .setPath(Schema.Struct({ id: ServiceId }))
      .annotate(OpenApi.Description, "Service delete")
      .annotate(OpenApi.Summary, "Service delete")
  )
  .add(
    HttpApiEndpoint.get("readAll", "/")
      .addSuccess(ResponseSuccessArray(ServiceSchema))
      .setUrlParams(URLParams(ServiceSchema))
      .annotate(OpenApi.Description, "Service readAll")
      .annotate(OpenApi.Summary, "Service readAll")
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(ServiceErrorNotFound)
      .addSuccess(ResponseSuccess(ServiceSchema))
      .setPath(Schema.Struct({ id: ServiceId }))
      .annotate(OpenApi.Description, "Service readById")
      .annotate(OpenApi.Summary, "Service readById")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(IdempotencyError)
      .addError(IdempotencyErrorKeyMismatch)
      .addError(IdempotencyErrorKeyRequired)
      .addError(IdempotencyErrorRequestInProgress)
      .addError(ServiceErrorAlreadyExists)
      .addError(ServiceErrorNotFound)
      .addSuccess(ResponseSuccess(ServiceId))
      .setHeaders(Schema.Struct({ "idempotency-key": IdempotencyKeyClient }))
      .setPath(Schema.Struct({ id: ServiceId }))
      .setPayload(ServiceSchema.pipe(Schema.pick("name")))
      .annotate(OpenApi.Description, "Service update")
      .annotate(OpenApi.Summary, "Service update")
  )
  .middlewareEndpoints(PortMiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Service")
  .annotate(OpenApi.Summary, "Manage Service")
  .annotate(OpenApi.Title, "Service")
  .prefix("/service")
{}
