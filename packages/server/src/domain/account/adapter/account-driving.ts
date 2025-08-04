import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortAccountPolicy } from "../application/account-policy.js"
import { PortAccountDriving } from "../application/port-account-driving.js"

export const AccountDriving = HttpApiBuilder.group(Api, "account", (handlers) =>
  Effect.gen(function*() {
    // @ts-ignore
    const _driving = yield* PortAccountDriving
    // @ts-ignore
    const _policy = yield* PortAccountPolicy

    return handlers
  }))
