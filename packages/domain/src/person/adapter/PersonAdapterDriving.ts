import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { GroupId } from "../../group/application/GroupApplicationDomain.js"
import { GroupErrorNotFound } from "../../group/application/GroupApplicationErrorNotFound.js"
import { PortMiddlewareAuthentication } from "../../PortMiddlewareAuthentication.js"
import { ResponseSuccess } from "../../shared/adapter/Response.js"
import { IdempotencyError } from "../../shared/application/IdempotencyError.js"
import { IdempotencyErrorKeyMismatch } from "../../shared/application/IdempotencyErrorKeyMismatch.js"
import { IdempotencyErrorKeyRequired } from "../../shared/application/IdempotencyErrorKeyRequired.js"
import { IdempotencyErrorRequestInProgress } from "../../shared/application/IdempotencyErrorRequestInProgress.js"
import { IdempotencyKeyClient } from "../../shared/application/IdempotencyKeyClient.js"
import { PersonId, PersonSchema } from "../application/PersonApplicationDomain.js"
import { PersonErrorNotFound } from "../application/PersonApplicationErrorNotFound.js"

export class PersonDriving extends HttpApiGroup.make("person")
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(PersonErrorNotFound)
      .addSuccess(ResponseSuccess(PersonSchema))
      .annotate(OpenApi.Description, "Person readById")
      .annotate(OpenApi.Summary, "Person readById")
      .setPath(Schema.Struct({ id: PersonId }))
  )
  .annotate(OpenApi.Description, "Manage Person")
  .annotate(OpenApi.Summary, "Manage Person")
  .annotate(OpenApi.Title, "Person")
  .prefix("/person")
  .add(
    HttpApiEndpoint.post("create", "/group/:groupId/person")
      .addError(GroupErrorNotFound)
      .addError(IdempotencyError)
      .addError(IdempotencyErrorKeyMismatch)
      .addError(IdempotencyErrorKeyRequired)
      .addError(IdempotencyErrorRequestInProgress)
      .addSuccess(ResponseSuccess(PersonId))
      .setHeaders(Schema.Struct({ "idempotency-key": IdempotencyKeyClient }))
      .setPath(Schema.Struct({ groupId: GroupId }))
      .setPayload(PersonSchema.pipe(Schema.pick("birthday", "firstName", "lastName")))
      .annotate(OpenApi.Description, "Person create")
      .annotate(OpenApi.Summary, "Person create")
  )
  .middlewareEndpoints(PortMiddlewareAuthentication)
{}
