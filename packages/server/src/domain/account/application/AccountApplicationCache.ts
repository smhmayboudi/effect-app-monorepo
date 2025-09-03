import { persisted } from "@effect/experimental/RequestResolver"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import { Effect, Exit, PrimaryKey, RequestResolver, Schema } from "effect"
import { AccountConfig } from "./AccountApplicationConfig.js"
import { AccountPortDriven } from "./AccountApplicationPortDriven.js"

export class AccountReadById extends Schema.TaggedRequest<AccountReadById>("AccountReadById")("AccountReadById", {
  failure: AccountErrorNotFound,
  payload: { id: AccountId },
  success: Account
}) {
  [PrimaryKey.symbol]() {
    return `AccountReadById:${this.id}`
  }
}

export const makeAccountReadResolver = Effect.all([AccountConfig, AccountPortDriven]).pipe(
  Effect.flatMap(([{ cacheTTLMs }, driven]) =>
    RequestResolver.fromEffectTagged<AccountReadById>()({
      AccountReadById: (requests) =>
        driven.readByIds(requests.map((req) => req.id)).pipe(
          Effect.withSpan("AccountUseCase", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "AccountReadById", requests }
          }),
          Effect.tap(() => Effect.logDebug(`DB hit: AccountReadById ${requests.length}`))
        )
    }).pipe(
      persisted({
        storeId: "Account",
        timeToLive: (_req, exit) => Exit.isSuccess(exit) ? cacheTTLMs : 0
      })
    )
  )
)
