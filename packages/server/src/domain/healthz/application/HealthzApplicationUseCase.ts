import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { HealthzPortDriving } from "./HealthzApplicationPortDriving.js"

export const HealthzUseCase = Layer.effect(
  HealthzPortDriving,
  Effect.sync(() =>
    HealthzPortDriving.of({
      check: () => Effect.void
    })
  )
)
