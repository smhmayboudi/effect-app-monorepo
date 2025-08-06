import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Effect } from "effect"
import { AccountPortDriving } from "../application/AccountApplicationPortDriving.js"
import { AccountPortPolicy } from "../application/AccountApplicationPortPolicy.js"

export const AccountDriving = HttpApiBuilder.group(Api, "account", (handlers) =>
  Effect.gen(function*() {
    // @ts-ignore
    const _driving = yield* AccountPortDriving
    // @ts-ignore
    const _policy = yield* AccountPortPolicy

    return handlers
  }))
