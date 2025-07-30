import { Effect, Layer } from "effect"
import { PortAccountDriving } from "./port-account-driving.js"
import { PortAccountDriven } from "./port-account-driven.js"
import { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { DomainAccount, AccountId } from "@template/domain/account/application/domain-account"

export const AccountUseCase = Layer.effect(
  PortAccountDriving,
  Effect.gen(function* () {
    const driven = yield* PortAccountDriven

    const create = (account: Omit<DomainAccount, "id" | "createdAt" | "updatedAt">): Effect.Effect<AccountId, never, never> =>
      driven.create(account)
        .pipe(Effect.withSpan("account.use-case.create", { attributes: { account } }))

    const del = (id: AccountId): Effect.Effect<AccountId, ErrorAccountNotFound, never> =>
      driven.delete(id)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("account.use-case.delete", { attributes: { id } }))

    const readAll = (): Effect.Effect<DomainAccount[], never, never> =>
      driven.readAll()
        .pipe(Effect.withSpan("account.use-case.readAll"))

    const readById = (id: AccountId): Effect.Effect<DomainAccount, ErrorAccountNotFound, never> =>
      driven.readById(id)
        .pipe(Effect.withSpan("account.use-case.readById", { attributes: { id } }))

    const update = (id: AccountId, account: Partial<Omit<DomainAccount, "id">>): Effect.Effect<AccountId, ErrorAccountNotFound, never> =>
      driven.update(id, account)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("account.use-case.update", { attributes: { id, account } }))

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
