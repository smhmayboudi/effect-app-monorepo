import * as HttpApiBuilder from "@effect/platform/HttpApiBuilder"
import { Api } from "@template/domain/Api"
import * as Effect from "effect/Effect"
import { HealthzPortDriving } from "../application/HealthzApplicationPortDriving.js"

export const HealthzDriving = HttpApiBuilder.group(Api, "healthz", (handlers) =>
  HealthzPortDriving.pipe(
    Effect.andThen((driving) =>
      handlers
        .handle("check", () => driving.check())
    )
  ))
