import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { HealthzPortDriving } from "./HealthzApplicationPortDriving.js"

export const HealthzUseCase = Layer.succeed(
  HealthzPortDriving,
  HealthzPortDriving.of({
    check: () => Effect.void
  })
)
