import { Schema } from "effect"
import { AccountId } from "../../account/application/domain-account.js"

export const GroupId = Schema.Number.pipe(Schema.brand("GroupId"))
export type GroupId = Schema.Schema.Type<typeof GroupId>

export class DomainGroup extends Schema.Class<DomainGroup>("DomainGroup")({
  id: GroupId.annotations({ description: "Group identification" }),
  ownerId: AccountId.annotations({ description: "Owner identification" }),
  name: Schema.NonEmptyTrimmedString.annotations({ description: "Name" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
}) {
  static decodeUnknown = Schema.decodeUnknown(DomainGroup)
}
