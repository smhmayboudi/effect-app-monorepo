import * as HttpApiEndpoint from "@effect/platform/HttpApiEndpoint"
import * as HttpApiGroup from "@effect/platform/HttpApiGroup"
import * as OpenApi from "@effect/platform/OpenApi"
import * as Schema from "effect/Schema"
import { PortMiddlewareAuthentication } from "../../PortMiddlewareAuthentication.js"
import { ResponseSuccess } from "../../shared/adapter/Response.js"
import { IdempotencyError } from "../../shared/application/IdempotencyError.js"
import { IdempotencyErrorKeyMismatch } from "../../shared/application/IdempotencyErrorKeyMismatch.js"
import { IdempotencyErrorKeyRequired } from "../../shared/application/IdempotencyErrorKeyRequired.js"
import { IdempotencyErrorRequestInProgress } from "../../shared/application/IdempotencyErrorRequestInProgress.js"
import { IdempotencyKeyClient } from "../../shared/application/IdempotencyKeyClient.js"
import { GroupId, GroupSchema } from "../application/GroupApplicationDomain.js"
import { GroupErrorNotFound } from "../application/GroupApplicationErrorNotFound.js"

export class GroupDriving extends HttpApiGroup.make("group")
  .add(
    HttpApiEndpoint.post("create", "/")
      .addError(IdempotencyError)
      .addError(IdempotencyErrorKeyMismatch)
      .addError(IdempotencyErrorKeyRequired)
      .addError(IdempotencyErrorRequestInProgress)
      .addSuccess(ResponseSuccess(GroupId))
      .setHeaders(Schema.Struct({ "idempotency-key": IdempotencyKeyClient }))
      .setPayload(GroupSchema.pipe(Schema.pick("name")))
      .annotate(OpenApi.Description, "Group create")
      .annotate(OpenApi.Summary, "Group create")
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id")
      .addError(GroupErrorNotFound)
      .addError(IdempotencyError)
      .addError(IdempotencyErrorKeyMismatch)
      .addError(IdempotencyErrorKeyRequired)
      .addError(IdempotencyErrorRequestInProgress)
      .addSuccess(ResponseSuccess(GroupId))
      .setHeaders(Schema.Struct({ "idempotency-key": IdempotencyKeyClient }))
      .setPath(Schema.Struct({ id: GroupId }))
      .setPayload(GroupSchema.pipe(Schema.pick("name")))
      .annotate(OpenApi.Description, "Group update")
      .annotate(OpenApi.Summary, "Group update")
  )
  .middlewareEndpoints(PortMiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Group")
  .annotate(OpenApi.Summary, "Manage Group")
  .annotate(OpenApi.Title, "Group")
  .prefix("/group")
{}
