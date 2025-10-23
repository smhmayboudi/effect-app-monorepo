import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as Schema from "effect/Schema"
import { ServiceId } from "./ServiceApplicationDomain.js"

export class ServiceErrorNotFound extends Schema.TaggedError<ServiceErrorNotFound>("ServiceErrorNotFound")(
  "ServiceErrorNotFound",
  { id: ServiceId },
  HttpApiSchema.annotations({ status: 404 })
) {
  get message() {
    return `${this.id} not found.`
  }
}
