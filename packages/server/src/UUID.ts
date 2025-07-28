import { Context, Effect, Layer } from "effect"
import { v7 } from "uuid"

export class PortUUID extends Context.Tag("PortUUID")<PortUUID, {
  generate: () => Effect.Effect<string, never, never>
}>() {}

export const AdapterUUID = Layer.effect(
  PortUUID,
  Effect.gen(function* () {
    return {
      generate: () => Effect.sync(() => v7())
    }
  })
)

export const AdapterUUIDTest = Layer.effect(
  PortUUID,
  Effect.gen(function* () {
    return {
      generate: () => Effect.succeed("test-uuid")
    }
  })
)
