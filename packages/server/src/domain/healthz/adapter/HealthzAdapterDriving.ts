import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Effect } from "effect"
import { HealthzPortDriving } from "../application/HealthzApplicationPortDriving.js"

export const HealthzDriving = HttpApiBuilder.group(Api, "healthz", (handlers) =>
  HealthzPortDriving.pipe(
    Effect.flatMap((driving) =>
      Effect.sync(() =>
        handlers
          .handle("check", () => driving.check())
      )
    )
  ))
