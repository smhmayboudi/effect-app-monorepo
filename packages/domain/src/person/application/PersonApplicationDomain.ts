import { Schema } from "effect"
import { GroupId } from "../../group/application/GroupApplicationDomain.js"

export const PersonId = Schema.Number.pipe(Schema.brand("PersonId"))
export type PersonId = Schema.Schema.Type<typeof PersonId>

export class Person extends Schema.Class<Person>("Person")({
  id: PersonId.annotations({ description: "Person identification" }),
  groupId: GroupId.annotations({ description: "Group identification" }),
  birthday: Schema.Date.annotations({ description: "Birthday" }),
  firstName: Schema.NonEmptyTrimmedString.annotations({ description: "First name" }),
  lastName: Schema.NonEmptyTrimmedString.annotations({ description: "Last name" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
}) {
  static decodeUnknown = Schema.decodeUnknown(Person)
}
