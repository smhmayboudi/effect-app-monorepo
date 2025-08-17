import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Effect } from "effect"
import { HealthzPortDriving } from "../application/HealthzApplicationPortDriving.js"

export const HealthzDriving = HttpApiBuilder.group(Api, "healthz", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* HealthzPortDriving

    return handlers
      .handle("check", () => driving.check())
  }))
