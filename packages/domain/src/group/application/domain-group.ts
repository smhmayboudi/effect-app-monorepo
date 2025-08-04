import { Schema } from "effect"
import { AccountId } from "../../account/application/domain-account.js"

export const GroupId = Schema.Number.pipe(Schema.brand("GroupId"))
export type GroupId = Schema.Schema.Type<typeof GroupId>

export class DomainGroup extends Schema.Class<DomainGroup>("DomainGroup")({
  id: GroupId,
  ownerId: AccountId,
  name: Schema.NonEmptyTrimmedString,
  createdAt: Schema.Date,
  updatedAt: Schema.Date
}) {
  static decodeUnknown = Schema.decodeUnknown(DomainGroup)
}
