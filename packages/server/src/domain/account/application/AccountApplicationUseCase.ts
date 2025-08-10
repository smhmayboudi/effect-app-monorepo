import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import type { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Effect, Layer } from "effect"
import { policyRequire } from "../../../util/Policy.js"
import { AccountPortDriven } from "./AccountApplicationPortDriven.js"
import { AccountPortDriving } from "./AccountApplicationPortDriving.js"

export const AccountUseCase = Layer.effect(
  AccountPortDriving,
  Effect.gen(function*() {
    const driven = yield* AccountPortDriven

    const create = (
      account: Omit<Account, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<AccountId, never, ActorAuthorized<"Account", "create">> =>
      driven.create(account)
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", account } }),
          policyRequire("Account", "create")
        )

    const del = (id: AccountId): Effect.Effect<AccountId, AccountErrorNotFound, ActorAuthorized<"Account", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyRequire("Account", "delete")
        )

    const readAll = (
      urlParams: URLParams<Account>
    ): Effect.Effect<Array<Account>, never, ActorAuthorized<"Account", "readAll">> =>
      driven.readAll(urlParams)
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readlAll" } }),
          policyRequire("Account", "readAll")
        )

    const readById = (
      id: AccountId
    ): Effect.Effect<Account, AccountErrorNotFound, ActorAuthorized<"Account", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readlById", id } }),
          policyRequire("Account", "readById")
        )

    const update = (
      id: AccountId,
      account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<AccountId, AccountErrorNotFound, ActorAuthorized<"Account", "update">> =>
      driven.update(id, account)
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, account } }),
          policyRequire("Account", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
