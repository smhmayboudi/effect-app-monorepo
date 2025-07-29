import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { AccountId } from "./domain-account.js"

export class ErrorAccountNotFound extends Schema.TaggedError<ErrorAccountNotFound>("ErrorAccountNotFound")(
  "ErrorAccountNotFound",
  { id: AccountId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
