import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { v7 } from "uuid"
import { PortUUID } from "../application/PortUUID.js"

export const UUID = Layer.succeed(
  PortUUID,
  PortUUID.of({
    v7: () => Effect.sync(() => v7())
  })
)

export const UUIDTest = Layer.succeed(
  PortUUID,
  PortUUID.of({
    v7: () => Effect.succeed("00000000-0000-0000-0000-000000000000")
  })
)
