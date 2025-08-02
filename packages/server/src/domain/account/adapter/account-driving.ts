import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { PortAccountPolicy } from "@template/server/domain/account/application/account-policy"
import { PortAccountDriving } from "@template/server/domain/account/application/port-account-driving"
import { Effect } from "effect"

export const AccountDriving = HttpApiBuilder.group(Api, "account", (handlers) =>
  Effect.gen(function*() {
    // @ts-ignore
    const _driving = yield* PortAccountDriving
    // @ts-ignore
    const _policy = yield* PortAccountPolicy

    return handlers
  }))
