import { Schema } from "effect"
import { GroupId } from "../../group/application/domain-group.js"

export const PersonId = Schema.Number.pipe(Schema.brand("PersonId"))
export type PersonId = Schema.Schema.Type<typeof PersonId>

export class DomainPerson extends Schema.Class<DomainPerson>("DomainPerson")({
  id: PersonId,
  groupId: GroupId,
  birthday: Schema.Date,
  firstName: Schema.NonEmptyTrimmedString,
  lastName: Schema.NonEmptyTrimmedString,
  createdAt: Schema.Date,
  updatedAt: Schema.Date
}) {
  static decodeUknown = Schema.decodeUnknown(DomainPerson)
}
