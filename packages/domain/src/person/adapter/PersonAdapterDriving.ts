import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { GroupIdFromString } from "../../group/adapter/GroupAdapterDriving.js"
import { GroupErrorNotFound } from "../../group/application/GroupApplicationErrorNotFound.js"
import { MiddlewareAuthentication } from "../../MiddlewareAuthentication.js"
import { ResponseSuccess } from "../../shared/adapter/Response.js"
import { Person, PersonId } from "../application/PersonApplicationDomain.js"
import { PersonErrorNotFound } from "../application/PersonApplicationErrorNotFound.js"

export const PersonIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(PersonId)
)

export class PersonDriving extends HttpApiGroup.make("person")
  .add(
    HttpApiEndpoint.post("create", "/:groupId/person")
      .addError(GroupErrorNotFound)
      .addSuccess(ResponseSuccess(PersonId))
      .setPath(Schema.Struct({ groupId: GroupIdFromString }))
      .setPayload(Person.pipe(Schema.pick("birthday", "firstName", "lastName")))
      .annotate(OpenApi.Description, "Person create")
      .annotate(OpenApi.Summary, "Person create")
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .addError(PersonErrorNotFound)
      .addSuccess(ResponseSuccess(Person))
      .annotate(OpenApi.Description, "Person readById")
      .annotate(OpenApi.Summary, "Person readById")
      .setPath(Schema.Struct({ id: PersonIdFromString }))
  )
  .middlewareEndpoints(MiddlewareAuthentication)
  .annotate(OpenApi.Description, "Manage Person")
  .annotate(OpenApi.Summary, "Manage Person")
  .annotate(OpenApi.Title, "Person")
  .prefix("/person")
{}
