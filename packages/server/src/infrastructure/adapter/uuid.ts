import { Effect, Layer } from "effect"
import { v7 } from "uuid"
import { PortUUID } from "@template/server/infrastructure/application/port/uuid"

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
