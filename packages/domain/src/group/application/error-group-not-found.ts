import { HttpApiSchema } from "@effect/platform"
import { GroupId } from "@template/domain/group/application/domain-group"
import { Schema } from "effect"

export class ErrorGroupNotFound extends Schema.TaggedError<ErrorGroupNotFound>("ErrorGroupNotFound")(
  "ErrorGroupNotFound",
  { id: GroupId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
