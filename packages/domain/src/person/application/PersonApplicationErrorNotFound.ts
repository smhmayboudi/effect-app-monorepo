import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { PersonId } from "./PersonApplicationDomain.js"

export class PersonErrorNotFound extends Schema.TaggedError<PersonErrorNotFound>("PersonErrorNotFound")(
  "PersonErrorNotFound",
  { id: PersonId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
