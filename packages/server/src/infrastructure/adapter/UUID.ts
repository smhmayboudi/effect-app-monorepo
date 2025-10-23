import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
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
