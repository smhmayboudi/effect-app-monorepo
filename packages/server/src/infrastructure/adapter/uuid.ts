import { PortUUID } from "@template/server/infrastructure/application/port/uuid"
import { Effect, Layer } from "effect"
import { v7 } from "uuid"

export const UUID = Layer.effect(
  PortUUID,
  Effect.sync(() => ({
    v7: () => Effect.sync(() => v7())
  }))
)

export const UUIDTest = Layer.effect(
  PortUUID,
  Effect.sync(() => ({
    v7: () => Effect.sync(() => "v7")
  }))
)
