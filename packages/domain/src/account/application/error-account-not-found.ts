import { HttpApiSchema } from "@effect/platform"
import { AccountId } from "@template/domain/account/application/domain-account"
import { Schema } from "effect"

export class ErrorAccountNotFound extends Schema.TaggedError<ErrorAccountNotFound>("ErrorAccountNotFound")(
  "ErrorAccountNotFound",
  { id: AccountId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
