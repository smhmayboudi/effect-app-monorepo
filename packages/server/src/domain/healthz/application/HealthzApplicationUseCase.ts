import { Effect, Layer } from "effect"
import { HealthzPortDriving } from "./HealthzApplicationPortDriving.js"

export const HealthzUseCase = Layer.effect(
  HealthzPortDriving,
  Effect.sync(() => ({
    check: (): Effect.Effect<string> => Effect.succeed("OK")
  }))
)
