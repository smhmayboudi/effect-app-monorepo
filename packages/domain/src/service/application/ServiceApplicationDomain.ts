import * as Schema from "effect/Schema"
import { ActorId } from "../../Actor.js"

export const ServiceId = Schema.UUID.pipe(
  Schema.brand("ServiceId"),
  Schema.annotations({ description: "Service Identification" })
)
export type ServiceId = typeof ServiceId.Type

export const ServiceSchema = Schema.Struct({
  id: ServiceId,
  ownerId: ActorId,
  name: Schema.NonEmptyTrimmedString.pipe(Schema.maxLength(255)).annotations({ description: "Text" }),
  createdAt: Schema.Date.annotations({ description: "Created at" }),
  updatedAt: Schema.Date.annotations({ description: "Updated at" }),
  deletedAt: Schema.NullOr(Schema.Date).annotations({ description: "Delete at" })
}).pipe(Schema.annotations({ description: "Service", identifier: "Service" }))
export type ServiceSchema = typeof ServiceSchema.Type

export class Service extends Schema.Class<Service>("Service")(ServiceSchema) {
  static decodeUnknown = Schema.decodeUnknown(Service)
}
