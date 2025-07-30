import { Effect, Layer } from "effect"
import { PortAccountDriving } from "./port-account-driving.js"
import { PortAccountDriven } from "./port-account-driven.js"
import { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { DomainAccount, AccountId } from "@template/domain/account/application/domain-account"
import { policyRequire } from "../../../util/policy.js"
import { ActorAuthorized } from "@template/domain/actor"

export const AccountUseCase = Layer.effect(
  PortAccountDriving,
  Effect.gen(function* () {
    const driven = yield* PortAccountDriven

    const create = (account: Omit<DomainAccount, "id" | "createdAt" | "updatedAt">): Effect.Effect<AccountId, never, ActorAuthorized<"Account", "create">> =>
      driven.create(account)
        .pipe(
          Effect.withSpan("account.use-case.create", { attributes: { account } }),
          policyRequire("Account", "create")
        )

    const del = (id: AccountId): Effect.Effect<AccountId, ErrorAccountNotFound, ActorAuthorized<"Account", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("account.use-case.delete", { attributes: { id } }),
          policyRequire("Account", "delete")
        )

    const readAll = (): Effect.Effect<DomainAccount[], never, ActorAuthorized<"Account", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("account.use-case.readAll"),
          policyRequire("Account", "readAll")
        )

    const readById = (id: AccountId): Effect.Effect<DomainAccount, ErrorAccountNotFound, ActorAuthorized<"Account", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("account.use-case.readById", { attributes: { id } }),
          policyRequire("Account", "readById")
        )

    const update = (id: AccountId, account: Partial<Omit<DomainAccount, "id">>): Effect.Effect<AccountId, ErrorAccountNotFound, ActorAuthorized<"Account", "update">> =>
      driven.update(id, account)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("account.use-case.update", { attributes: { id, account } }),
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
