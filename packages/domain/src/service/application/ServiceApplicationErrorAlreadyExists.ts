import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"

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
