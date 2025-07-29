import { Effect, Layer, Redacted } from "effect";
import { PortUserDriving } from "./port-user-driving.js";
import { PortUserDriven } from "./port-user-driven.js";
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { AccessToken, DomainUser, DomainUserWithSensitive, Email, UserId } from "@template/domain/user/application/domain-user"
import { AccountId } from "@template/domain/account/application/domain-account";

export const UserUseCase = Layer.effect(
  PortUserDriving,
  Effect.gen(function* () {
    const driven = yield* PortUserDriven

    const create = (user: Omit<DomainUser, "id">): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never> => 
      driven.create(user)

    const del = (id: UserId): Effect.Effect<UserId, ErrorUserNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.delete(id)

        return id
      })

    const readAll = (): Effect.Effect<DomainUser[], never, never> =>
      driven.readAll()

    const readById = (id: UserId): Effect.Effect<DomainUser, ErrorUserNotFound, never> =>
      driven.readById(id)

    const readMe = (id: UserId): Effect.Effect<DomainUserWithSensitive, never, never> =>
      Effect.succeed(DomainUserWithSensitive.make({
        id: UserId.make(0),
        accountId: AccountId.make(0),
        email: Email.make("smhmayboudi@gmail.com"),
        createdAt: new Date(),
        updatedAt: new Date(),
        accessToken: AccessToken.make(Redacted.make("0"))
      }))

    const update = (id: UserId, user: Partial<Omit<DomainUser, "id">>): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.update(id, user)

        return id
      })

    return {
      create,
      delete: del,
      readAll,
      readById,
      readMe,
      update,
    } as const
  })
)
