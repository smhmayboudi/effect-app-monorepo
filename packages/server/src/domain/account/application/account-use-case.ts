import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { AccountId, DomainAccount } from "@template/domain/account/application/domain-account"
import type { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import type { ActorAuthorized } from "@template/domain/actor"
import { Effect, Layer } from "effect"
import { policyRequire } from "../../../util/policy.js"
import { PortAccountDriven } from "./port-account-driven.js"
import { PortAccountDriving } from "./port-account-driving.js"

export const AccountUseCase = Layer.effect(
  PortAccountDriving,
  Effect.gen(function*() {
    const driven = yield* PortAccountDriven

    const create = (
      account: Omit<DomainAccount, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<AccountId, never, ActorAuthorized<"Account", "create">> =>
      driven.create(account)
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", account } }),
          policyRequire("Account", "create")
        )

    const del = (id: AccountId): Effect.Effect<AccountId, ErrorAccountNotFound, ActorAuthorized<"Account", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyRequire("Account", "delete")
        )

    const readAll = (): Effect.Effect<Array<DomainAccount>, never, ActorAuthorized<"Account", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readlAll" } }),
          policyRequire("Account", "readAll")
        )

    const readById = (
      id: AccountId
    ): Effect.Effect<DomainAccount, ErrorAccountNotFound, ActorAuthorized<"Account", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readlById", id } }),
          policyRequire("Account", "readById")
        )

    const update = (
      id: AccountId,
      account: Partial<Omit<DomainAccount, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<AccountId, ErrorAccountNotFound, ActorAuthorized<"Account", "update">> =>
      driven.update(id, account)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
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
