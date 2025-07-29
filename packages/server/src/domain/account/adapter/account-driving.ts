import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
// import { PortAccountDriving } from "../application/port-account-driving.js";
// import { AccountId } from "@template/domain/account/application/domain-account";

export const AccountDriving = HttpApiBuilder.group(Api, "account", (handlers) =>
  Effect.gen(function*() {
    // const driving = yield* PortAccountDriving

    return handlers
  }))
