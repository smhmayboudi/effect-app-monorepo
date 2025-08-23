import { Effect, Layer } from "effect"
import { HealthzPortDriving } from "./HealthzApplicationPortDriving.js"

export const HealthzUseCase = Layer.effect(
  HealthzPortDriving,
  Effect.sync(() =>
    HealthzPortDriving.of({
      check: () => Effect.succeed("OK")
    })
  )
)
