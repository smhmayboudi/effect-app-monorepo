import { AccountId } from "@template/domain/account/application/domain-account"
import { Schema } from "effect"

export const GroupId = Schema.Number.pipe(Schema.brand("GroupId"))
export type GroupId = Schema.Schema.Type<typeof GroupId>

export class DomainGroup extends Schema.Class<DomainGroup>("DomainGroup")({
  id: GroupId,
  ownerId: AccountId,
  name: Schema.NonEmptyTrimmedString,
  createdAt: Schema.Date,
  updatedAt: Schema.Date
}) {
  static decodeUknown = Schema.decodeUnknown(DomainGroup)
}
