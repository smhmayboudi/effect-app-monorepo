import { Schema } from "effect"

export const ServiceId = Schema.UUID.pipe(
  Schema.brand("ServiceId"),
  Schema.annotations({ description: "Service Identification" })
)
export type ServiceId = typeof ServiceId.Type
