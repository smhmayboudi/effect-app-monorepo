import { Effect, Layer } from "effect"
import { v7 } from "uuid"
import { PortUUID } from "../application/PortUUID.js"

export const UUID = Layer.effect(
  PortUUID,
  Effect.sync(() =>
    PortUUID.of({
      v7: () => Effect.sync(() => v7())
    })
  )
)

export const UUIDTest = Layer.effect(
  PortUUID,
  Effect.sync(() =>
    PortUUID.of({
      v7: () => Effect.sync(() => "00000000-0000-0000-0000-000000000000")
    })
  )
)
