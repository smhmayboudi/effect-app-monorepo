import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { GroupId } from "@template/domain/group/application/domain-group"

export class ErrorGroupNotFound extends Schema.TaggedError<ErrorGroupNotFound>("ErrorGroupNotFound")(
  "ErrorGroupNotFound",
  { id: GroupId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
