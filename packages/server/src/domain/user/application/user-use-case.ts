import { Effect, Layer } from "effect"
import { PortUserDriving } from "./port-user-driving.js"
import { PortUserDriven } from "./port-user-driven.js"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { ErrorUserNotFoundWithAccessToken } from "@template/domain/user/application/error-user-not-found-with-access-token"
import { AccessToken, DomainUser, DomainUserWithSensitive, UserId } from "@template/domain/user/application/domain-user"
import { PortAccountDriving } from "../../account/application/port-account-driving.js"

export const UserUseCase = Layer.effect(
  PortUserDriving,
  Effect.gen(function* () {
    const account = yield* PortAccountDriving
    const driven = yield* PortUserDriven

    const create = (user: Omit<DomainUser, "id" | "ownerId" | "createdAt" | "updatedAt">): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never> =>
      account.create({}).pipe(
        Effect.flatMap((accountId) => driven.create({ ...user, ownerId: accountId}).pipe(
          Effect.withSpan("user.use-case.create", { attributes: { user, accountId } })
        )),
      )

    const del = (id: UserId): Effect.Effect<UserId, ErrorUserNotFound, never> =>
      driven.delete(id)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("user.use-case.delete", { attributes: { id } }))

    const readAll = (): Effect.Effect<DomainUser[], never, never> =>
      driven.readAll()
        .pipe(Effect.withSpan("user.use-case.readAll"))

    const readByAccessToken = (accessToken: AccessToken): Effect.Effect<DomainUser, ErrorUserNotFoundWithAccessToken, never> =>
      driven.readByAccessToken(accessToken)
        .pipe(Effect.withSpan("user.use-case.readById", { attributes: { accessToken } }))

    const readById = (id: UserId): Effect.Effect<DomainUser, ErrorUserNotFound, never> =>
      driven.readById(id)
        .pipe(Effect.withSpan("user.use-case.readById", { attributes: { id } }))

    const readByMe = (id: UserId): Effect.Effect<DomainUserWithSensitive, never, never> =>
      driven.readByMe(id)
        .pipe(Effect.withSpan("user.use-case.readByMe", { attributes: { id } }))

    const update = (id: UserId, user: Partial<Omit<DomainUser, "id">>): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, never> =>
      driven.update(id, user)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("user.use-case.update", { attributes: { id, user } }))

    return {
      create,
      delete: del,
      readAll,
      readByAccessToken,
      readById,
      readByMe,
      update,
    } as const
  })
)
