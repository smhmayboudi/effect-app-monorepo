import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class PortUUID extends Context.Tag("PortUUID")<PortUUID, {
  v7: () => Effect.Effect<string>
}>() {}
