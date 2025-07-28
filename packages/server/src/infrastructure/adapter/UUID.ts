import { Effect, Layer } from "effect"
import { v7 } from "uuid"
import { PortUUID } from "../application/port/UUID.js"

export const UUID = Layer.effect(
  PortUUID,
  Effect.gen(function* () {
    return {
      v7: () => Effect.sync(() => v7())
    }
  })
)

export const UUIDTest = Layer.effect(
  PortUUID,
  Effect.gen(function* () {
    return {
      v7: () => Effect.succeed("v7")
    }
  })
)
