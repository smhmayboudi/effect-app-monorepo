import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { GroupIdFromString } from "../../group/adapter/group-driving.js"
import { ErrorGroupNotFound } from "../../group/application/error-group-not-found.js"
import { MiddlewareAuthentication } from "../../middleware-authentication.js"
import { ResponseSuccess } from "../../shared/adapter/response.js"
import { DomainPerson, PersonId } from "../application/domain-person.js"
import { ErrorPersonNotFound } from "../application/error-person-not-found.js"

export const PersonIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(PersonId)
)

export class PersonDriving extends HttpApiGroup.make("person")
  .add(
    HttpApiEndpoint.post("create", "/:groupId/person")
      .addError(ErrorGroupNotFound)
      .addSuccess(ResponseSuccess(PersonId))
      .setPath(Schema.Struct({ groupId: GroupIdFromString }))
      .setPayload(Schema.Struct({
        birthday: Schema.Date,
        firstName: Schema.NonEmptyString,
        lastName: Schema.NonEmptyString
      }))
      .annotate(OpenApi.Description, "Person create")
      .annotate(OpenApi.Summary, "Person create")
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .setPath(Schema.Struct({ id: PersonIdFromString }))
      .addSuccess(ResponseSuccess(DomainPerson))
      .addError(ErrorPersonNotFound)
      .annotate(OpenApi.Description, "Person readById")
      .annotate(OpenApi.Summary, "Person readById")
  )
  .middlewareEndpoints(MiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Person")
  .annotate(OpenApi.Summary, "Manage Person")
  .annotate(OpenApi.Title, "Person")
  .prefix("/person")
{}
