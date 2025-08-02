import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { GroupIdFromString } from "@template/domain/group/adapter/group-driving"
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { MiddlewareAuthentication } from "@template/domain/middleware-authentication"
import { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"
import { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { ResponseSuccess } from "@template/domain/shared/adapter/response"
import { Schema } from "effect"

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
