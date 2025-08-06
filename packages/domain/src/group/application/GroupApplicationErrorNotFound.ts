import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { GroupId } from "./GroupApplicationDomain.js"

export class GroupErrorNotFound extends Schema.TaggedError<GroupErrorNotFound>("GroupErrorNotFound")(
  "GroupErrorNotFound",
  { id: GroupId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
