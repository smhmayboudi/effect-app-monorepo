import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"

export class ServiceErrorAlreadyExists
  extends Schema.TaggedError<ServiceErrorAlreadyExists>("ServiceErrorAlreadyExists")(
    "ServiceErrorAlreadyExists",
    { name: Schema.NonEmptyTrimmedString },
    HttpApiSchema.annotations({ status: 404 })
  )
{
  get message() {
    return `${this.name} is already exists.`
  }
}
