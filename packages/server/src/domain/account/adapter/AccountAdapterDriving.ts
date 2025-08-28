import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Effect } from "effect"
import { AccountPortDriving } from "../application/AccountApplicationPortDriving.js"
import { AccountPortPolicy } from "../application/AccountApplicationPortPolicy.js"

export const AccountDriving = HttpApiBuilder.group(
  Api,
  "account",
  (handlers) =>
    Effect.all([AccountPortDriving, AccountPortPolicy]).pipe(
      Effect.flatMap(([_driving, _policy]) => Effect.sync(() => handlers))
    )
)
