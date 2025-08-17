import { Context, type Effect } from "effect"

export class HealthzPortDriving extends Context.Tag("HealthzPortDriving")<HealthzPortDriving, {
  check: () => Effect.Effect<string, never, never>
}>() {}
