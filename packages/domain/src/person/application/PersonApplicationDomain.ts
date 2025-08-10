import { Schema } from "effect"
import { GroupId } from "../../group/application/GroupApplicationDomain.js"

export const PersonId = Schema.Number.pipe(
  Schema.brand("PersonId"),
  Schema.annotations({ description: "Person identification" })
)
export type PersonId = Schema.Schema.Type<typeof PersonId>

export const PersonSchema = Schema.Struct({
  id: PersonId,
  groupId: GroupId,
  birthday: Schema.Date.annotations({ description: "Birthday" }),
  firstName: Schema.NonEmptyTrimmedString.annotations({ description: "First name" }),
  lastName: Schema.NonEmptyTrimmedString.annotations({ description: "Last name" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
}).pipe(Schema.annotations({ description: "Person", identifier: "Person" }))
export type PersonSchema = Schema.Schema.Type<typeof PersonSchema>

export class Person extends Schema.Class<Person>("Person")(PersonSchema) {
  static decodeUnknown = Schema.decodeUnknown(Person)
}
