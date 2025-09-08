import { Schema } from "effect"
import { ActorId } from "../../Actor.js"

export const GroupId = Schema.UUID.pipe(
  Schema.brand("GroupId"),
  Schema.annotations({ description: "Group identification" })
)
export type GroupId = typeof GroupId.Type

export const GroupSchema = Schema.Struct({
  id: GroupId,
  ownerId: ActorId,
  name: Schema.NonEmptyTrimmedString.annotations({ description: "Name" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" }),
  deletedAt: Schema.NullOr(Schema.Date).annotations({ description: "Delete at" })
}).pipe(Schema.annotations({ description: "Group", identifier: "Group" }))
export type GroupSchema = typeof GroupSchema.Type

export class Group extends Schema.Class<Group>("Group")(GroupSchema) {
  static decodeUnknown = Schema.decodeUnknown(Group)
}
