import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { AccountId } from "./AccountApplicationDomain.js"

export class AccountErrorNotFound extends Schema.TaggedError<AccountErrorNotFound>("AccountErrorNotFound")(
  "AccountErrorNotFound",
  { id: AccountId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
