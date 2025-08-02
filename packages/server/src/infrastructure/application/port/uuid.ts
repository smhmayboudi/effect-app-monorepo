import { Context, type Effect } from "effect"

export class PortUUID extends Context.Tag("PortUUID")<PortUUID, {
  v7: () => Effect.Effect<string, never, never>
}>() {}
