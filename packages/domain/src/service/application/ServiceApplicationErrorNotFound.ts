import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
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
