import { Effect, Layer } from "effect";
import { PortAccountDriven } from "../application/port-account-driven.js";
import { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { DomainAccount, AccountId } from "@template/domain/account/application/domain-account"

export const AccountDriven = Layer.effect(
  PortAccountDriven,
  Effect.gen(function* () {
    const create = (account: Omit<DomainAccount, "id">): Effect.Effect<AccountId, never, never> =>
      Effect.succeed(AccountId.make(0))

    const del = (id: AccountId): Effect.Effect<void, ErrorAccountNotFound, never> =>
      Effect.void

    const readAll = (): Effect.Effect<DomainAccount[], never, never> =>
      Effect.succeed([DomainAccount.make({
        id: AccountId.make(0),
        createdAt: new Date(),
        updatedAt: new Date()
      })])

    const readById = (id: AccountId): Effect.Effect<DomainAccount, ErrorAccountNotFound, never> =>
      Effect.succeed(DomainAccount.make({
        id: AccountId.make(0),
        createdAt: new Date(),
        updatedAt: new Date()
      }))

    const update = (id: AccountId, account: Partial<Omit<DomainAccount, "id">>): Effect.Effect<void, ErrorAccountNotFound, never> =>
      Effect.succeed(AccountId.make(0))

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
