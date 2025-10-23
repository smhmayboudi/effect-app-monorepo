import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class HealthzPortDriving extends Context.Tag("HealthzPortDriving")<HealthzPortDriving, {
  check: () => Effect.Effect<void>
}>() {}
