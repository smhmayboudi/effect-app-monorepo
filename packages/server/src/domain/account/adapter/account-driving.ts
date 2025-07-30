import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"

export const AccountDriving = HttpApiBuilder.group(Api, "account", (handlers) =>
  Effect.gen(function*() {
    // const driving = yield* PortAccountDriving
    // const policy = yield* PortAccountPolicy

    return handlers
  }))
