import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Effect } from "effect"
import { PortUserDriving } from "../application/port-user-driving.js";

export const UserDriving = HttpApiBuilder.group(Api, "user", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortUserDriving

    return handlers
      .handle("signup", ({ payload }) => driving.signup(payload))
  }))
