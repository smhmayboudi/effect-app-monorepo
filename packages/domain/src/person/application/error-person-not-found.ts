import { HttpApiSchema } from "@effect/platform"
import { PersonId } from "@template/domain/person/application/domain-person"
import { Schema } from "effect"

export class ErrorPersonNotFound extends Schema.TaggedError<ErrorPersonNotFound>("ErrorPersonNotFound")(
  "ErrorPersonNotFound",
  { id: PersonId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
