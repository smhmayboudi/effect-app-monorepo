import { Effect, Layer } from "effect";
import { PortUserDriven } from "../application/port-user-driven.js";
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { DomainUser, Email, UserId } from "@template/domain/user/application/domain-user"
import { AccountId } from "@template/domain/account/application/domain-account";

export const UserDriven = Layer.effect(
  PortUserDriven,
  Effect.gen(function* () {
    const create = (user: Omit<DomainUser, "id">): Effect.Effect<UserId, never, never> =>
      Effect.succeed(UserId.make(0))

    const del = (id: UserId): Effect.Effect<void, ErrorUserNotFound, never> =>
      Effect.void

    const readAll = (): Effect.Effect<DomainUser[], never, never> =>
      Effect.succeed([DomainUser.make({
        id: UserId.make(0),
        accountId: AccountId.make(0),
        email: Email.make("smhmayboudi@gmail.com"),
        createdAt: new Date(),
        updatedAt: new Date()
      })])

    const readById = (id: UserId): Effect.Effect<DomainUser, ErrorUserNotFound, never> =>
      Effect.succeed(DomainUser.make({
        id: UserId.make(0),
        accountId: AccountId.make(0),
        email: Email.make("smhmayboudi@gmail.com"),
        createdAt: new Date(),
        updatedAt: new Date()
      }))

    const update = (id: UserId, user: Partial<Omit<DomainUser, "id">>): Effect.Effect<void, ErrorUserNotFound, never> =>
      Effect.succeed(UserId.make(0))

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
