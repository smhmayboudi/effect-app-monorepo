import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"
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
