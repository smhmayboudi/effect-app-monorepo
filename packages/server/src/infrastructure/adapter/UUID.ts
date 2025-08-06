import { Effect, Layer } from "effect"
import { v7 } from "uuid"
import { PortUUID } from "../application/PortUUID.js"

export const UUID = Layer.effect(
  PortUUID,
  Effect.sync(() => ({
    v7: (): Effect.Effect<string, never, never> => Effect.sync(() => v7())
  }))
)

export const UUIDTest = Layer.effect(
  PortUUID,
  Effect.sync(() => ({
    v7: (): Effect.Effect<string, never, never> => Effect.sync(() => "v7")
  }))
)
