import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { DomainPerson, PersonId } from "../application/domain-person.js"
import { ErrorGroupNotFound } from "../../group/application/error-group-not-found.js"
import { GroupIdFromString } from "../../group/adapter/group-driving.js"
import { ErrorPersonNotFound } from "../application/error-person-not-found.js"

export class PersonCreatePayload extends Schema.Class<PersonCreatePayload>("PersonCreatePayload")({
  birthday: Schema.Date,
  firstName: Schema.NonEmptyString,
  lastName: Schema.NonEmptyString,
}) {}

export const PersonIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(PersonId)
)

export class PersonDriving extends HttpApiGroup.make("person")
  .add(
    HttpApiEndpoint.post("create", "/:groupId/person")
      .addError(ErrorGroupNotFound)
      .addSuccess(DomainPerson)
      .setPath(Schema.Struct({ groupId: GroupIdFromString }))
      .setPayload(PersonCreatePayload)
  )
  .add(
    HttpApiEndpoint.get("readById", "/:id")
      .setPath(Schema.Struct({ id: PersonIdFromString }))
      .addSuccess(DomainPerson)
      .addError(ErrorPersonNotFound)
  )
  .prefix("/person")
  .annotate(OpenApi.Description, "Manage Person")
  .annotate(OpenApi.Title, "Person")
{}
