import { Effect, Layer } from "effect"
import { PortUserDriving } from "./port-user-driving.js"
import { PortUserDriven } from "./port-user-driven.js"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { ErrorUserNotFoundWithAccessToken } from "@template/domain/user/application/error-user-not-found-with-access-token"
import { AccessToken, DomainUser, DomainUserWithSensitive, UserId } from "@template/domain/user/application/domain-user"
import { PortAccountDriving } from "../../account/application/port-account-driving.js"
import { policyRequire } from "../../../util/policy.js"
import { ActorAuthorized } from "@template/domain/actor"

export const UserUseCase = Layer.effect(
  PortUserDriving,
  Effect.gen(function* () {
    const account = yield* PortAccountDriving
    const driven = yield* PortUserDriven

    const create = (user: Omit<DomainUser, "id" | "ownerId" | "createdAt" | "updatedAt">): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, ActorAuthorized<"User", "create"> | ActorAuthorized<"Account", "create">> =>
      account.create({}).pipe(
        Effect.flatMap((accountId) =>
          driven.create({ ...user, ownerId: accountId}).pipe(
            Effect.withSpan("user.use-case.create", { attributes: { user, accountId } }),
            policyRequire("User", "create")
          )
        )
      )

    const del = (id: UserId): Effect.Effect<UserId, ErrorUserNotFound, ActorAuthorized<"User", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("user.use-case.delete", { attributes: { id } }),
          policyRequire("User", "delete")
        )

    const readAll = (): Effect.Effect<DomainUser[], never, ActorAuthorized<"User", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("user.use-case.readAll"),
          policyRequire("User", "readAll")
        )

    const readByAccessToken = (accessToken: AccessToken): Effect.Effect<DomainUser, ErrorUserNotFoundWithAccessToken, never> =>
      driven.readByAccessToken(accessToken)
        .pipe(
          Effect.withSpan("user.use-case.readById", { attributes: { accessToken } })
        )

    const readById = (id: UserId): Effect.Effect<DomainUser, ErrorUserNotFound, ActorAuthorized<"User", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("user.use-case.readById", { attributes: { id } }),
          policyRequire("User", "readById")
        )

    const readByIdWithSensitive = (id: UserId): Effect.Effect<DomainUserWithSensitive, never, ActorAuthorized<"User", "readByIdWithSensitive">> =>
      driven.readByIdWithSensitive(id)
        .pipe(
          Effect.withSpan("user.use-case.readByIdWithSensitive", { attributes: { id } }),
          policyRequire("User", "readByIdWithSensitive")
        )

    const update = (id: UserId, user: Partial<Omit<DomainUser, "id">>): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, ActorAuthorized<"User", "update">> =>
      driven.update(id, user)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("user.use-case.update", { attributes: { id, user } }),
          policyRequire("User", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readByAccessToken,
      readById,
      readByIdWithSensitive,
      update,
    } as const
  })
)
