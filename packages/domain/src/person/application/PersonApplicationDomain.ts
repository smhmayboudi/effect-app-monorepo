import * as Schema from "effect/Schema"
import { GroupId } from "../../group/application/GroupApplicationDomain.js"

export const PersonId = Schema.UUID.pipe(
  Schema.brand("PersonId"),
  Schema.annotations({ description: "Person Identification" })
)
export type PersonId = typeof PersonId.Type

export const PersonSchema = Schema.Struct({
  id: PersonId,
  groupId: GroupId,
  birthday: Schema.Date.annotations({ description: "Birthday" }),
  firstName: Schema.NonEmptyTrimmedString.pipe(Schema.maxLength(255)).annotations({ description: "First name" }),
  lastName: Schema.NonEmptyTrimmedString.pipe(Schema.maxLength(255)).annotations({ description: "Last name" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" }),
  deletedAt: Schema.NullOr(Schema.Date).annotations({ description: "Delete at" })
}).pipe(Schema.annotations({ description: "Person", identifier: "Person" }))
export type PersonSchema = typeof PersonSchema.Type

export class Person extends Schema.Class<Person>("Person")(PersonSchema) {
  static decodeUnknown = Schema.decodeUnknown(Person)
}
