import { Effect, Layer } from "effect";
import { PortAccountDriving } from "./port-account-driving.js";
import { PortAccountDriven } from "./port-account-driven.js";
import { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { DomainAccount, AccountId } from "@template/domain/account/application/domain-account"

export const AccountUseCase = Layer.effect(
  PortAccountDriving,
  Effect.gen(function* () {
    const driven = yield* PortAccountDriven

    const create = (account: Omit<DomainAccount, "id">): Effect.Effect<AccountId, never, never> => 
      driven.create(account)

    const del = (id: AccountId): Effect.Effect<AccountId, ErrorAccountNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.delete(id)

        return id
      })

    const readAll = (): Effect.Effect<DomainAccount[], never, never> =>
      driven.readAll()

    const readById = (id: AccountId): Effect.Effect<DomainAccount, ErrorAccountNotFound, never> =>
      driven.readById(id)

    const update = (id: AccountId, account: Partial<Omit<DomainAccount, "id">>): Effect.Effect<AccountId, ErrorAccountNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.update(id, account)

        return id
      })

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
