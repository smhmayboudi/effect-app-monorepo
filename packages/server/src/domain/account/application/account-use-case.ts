import { Effect, Layer } from "effect"
import { PortAccountDriving } from "@template/server/domain/account/application/port-account-driving"
import { PortAccountDriven } from "@template/server/domain/account/application/port-account-driven"
import { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { DomainAccount, AccountId } from "@template/domain/account/application/domain-account"
import { policyRequire } from "@template/server/util/policy"
import { ActorAuthorized } from "@template/domain/actor"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const AccountUseCase = Layer.effect(
  PortAccountDriving,
  Effect.gen(function* () {
    const driven = yield* PortAccountDriven

    const create = (account: Omit<DomainAccount, "id" | "createdAt" | "updatedAt">): Effect.Effect<AccountId, never, ActorAuthorized<"Account", "create">> =>
      driven.create(account)
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", account }}),
          policyRequire("Account", "create")
        )

    const del = (id: AccountId): Effect.Effect<AccountId, ErrorAccountNotFound, ActorAuthorized<"Account", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
          policyRequire("Account", "delete")
        )

    const readAll = (): Effect.Effect<DomainAccount[], never, ActorAuthorized<"Account", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readlAll" }}),
          policyRequire("Account", "readAll")
        )

    const readById = (id: AccountId): Effect.Effect<DomainAccount, ErrorAccountNotFound, ActorAuthorized<"Account", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readlById", id }}),
          policyRequire("Account", "readById")
        )

    const update = (id: AccountId, account: Partial<Omit<DomainAccount, "id">>): Effect.Effect<AccountId, ErrorAccountNotFound, ActorAuthorized<"Account", "update">> =>
      driven.update(id, account)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("AccountUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, account }}),
          policyRequire("Account", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
