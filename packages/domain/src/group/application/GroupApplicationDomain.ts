import { Schema } from "effect"
import { AccountId } from "../../account/application/AccountApplicationDomain.js"

export const GroupId = Schema.Number.pipe(
  Schema.brand("GroupId"),
  Schema.annotations({ description: "Group identification" })
)
export type GroupId = Schema.Schema.Type<typeof GroupId>

export const GroupSchema = Schema.Struct({
  id: GroupId,
  ownerId: AccountId,
  name: Schema.NonEmptyTrimmedString.annotations({ description: "Name" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" })
}).pipe(Schema.annotations({ description: "Group", identifier: "Group" }))
export type GroupSchema = Schema.Schema.Type<typeof GroupSchema>

export class Group extends Schema.Class<Group>("Group")(GroupSchema) {
  static decodeUnknown = Schema.decodeUnknown(Group)
}
