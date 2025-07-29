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
        .pipe(Effect.withSpan("user.use-case.create", { attributes: { user } }))

    const del = (id: UserId): Effect.Effect<UserId, ErrorUserNotFound, never> =>
      driven.delete(id)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("user.use-case.delete", { attributes: { id } }))

    const readAll = (): Effect.Effect<DomainUser[], never, never> =>
      driven.readAll()
        .pipe(Effect.withSpan("user.use-case.readAll"))

    const readById = (id: UserId): Effect.Effect<DomainUser, ErrorUserNotFound, never> =>
      driven.readById(id)
        .pipe(Effect.withSpan("user.use-case.readById", { attributes: { id } }))

    const readMe = (id: UserId): Effect.Effect<DomainUserWithSensitive, never, never> =>
      Effect.succeed(DomainUserWithSensitive.make({
        id: UserId.make(0),
        accountId: AccountId.make(0),
        email: Email.make("smhmayboudi@gmail.com"),
        createdAt: new Date(),
        updatedAt: new Date(),
        accessToken: AccessToken.make(Redacted.make("0"))
      }))
        .pipe(Effect.withSpan("user.use-case.readMe", { attributes: { id } }))

    const update = (id: UserId, user: Partial<Omit<DomainUser, "id">>): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, never> =>
      driven.update(id, user)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("user.use-case.update", { attributes: { id, user } }))

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
