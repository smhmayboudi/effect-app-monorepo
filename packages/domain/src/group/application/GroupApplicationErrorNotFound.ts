import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"
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
