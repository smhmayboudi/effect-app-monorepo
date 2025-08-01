import { Effect, Layer, Redacted } from "effect"
import { PortUserDriving } from "./port-user-driving.js"
import { PortUserDriven } from "./port-user-driven.js"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { ErrorUserNotFoundWithAccessToken } from "@template/domain/user/application/error-user-not-found-with-access-token"
import { AccessToken, DomainUser, DomainUserWithSensitive, UserId } from "@template/domain/user/application/domain-user"
import { PortAccountDriving } from "../../account/application/port-account-driving.js"
import { policyRequire } from "../../../util/policy.js"
import { ActorAuthorized } from "@template/domain/actor"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { PortUUID } from "../../../infrastructure/application/port/uuid.js"

export const UserUseCase = Layer.effect(
  PortUserDriving,
  Effect.gen(function* () {
    const account = yield* PortAccountDriving
    const driven = yield* PortUserDriven
    const uuid = yield* PortUUID

    const create = (user: Omit<DomainUser, "id" | "ownerId" | "createdAt" | "updatedAt">): Effect.Effect<DomainUserWithSensitive, ErrorUserEmailAlreadyTaken, ActorAuthorized<"Account", "create"> | ActorAuthorized<"User", "create"> | ActorAuthorized<"User", "readByIdWithSensitive">> =>
      uuid.v7().pipe(Effect.flatMap((v7) => account.create({}).pipe(
        Effect.flatMap((accountId) =>
          driven.create({ ...user, accessToken: AccessToken.make(Redacted.make(v7)), ownerId: accountId}).pipe(
            Effect.flatMap((userId) => readByIdWithSensitive(userId)),
            Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", user }}),
            policyRequire("User", "create")
          )
        )
      )))

    const del = (id: UserId): Effect.Effect<UserId, ErrorUserNotFound, ActorAuthorized<"User", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
          policyRequire("User", "delete")
        )

    const readAll = (): Effect.Effect<DomainUser[], never, ActorAuthorized<"User", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
          policyRequire("User", "readAll")
        )

    const readByAccessToken = (accessToken: AccessToken): Effect.Effect<DomainUser, ErrorUserNotFoundWithAccessToken, never> =>
      driven.readByAccessToken(accessToken)
        .pipe(
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByAccessToken", accessToken }}),
        )

    const readById = (id: UserId): Effect.Effect<DomainUser, ErrorUserNotFound, ActorAuthorized<"User", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id }}),
          policyRequire("User", "readById")
        )

    const readByIdWithSensitive = (id: UserId): Effect.Effect<DomainUserWithSensitive, never, ActorAuthorized<"User", "readByIdWithSensitive">> =>
      driven.readByIdWithSensitive(id)
        .pipe(
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive", id }}),
          policyRequire("User", "readByIdWithSensitive")
        )

    const update = (id: UserId, user: Partial<Omit<DomainUser, "id">>): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, ActorAuthorized<"User", "update">> =>
      driven.update(id, user)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, user }}),
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
