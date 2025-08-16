import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { User, UserId, UserWithSensitive } from "@template/domain/user/application/UserApplicationDomain"
import { AccessToken } from "@template/domain/user/application/UserApplicationDomain"
import type { UserErrorEmailAlreadyTaken } from "@template/domain/user/application/UserApplicationErrorEmailAlreadyTaken"
import type { UserErrorNotFound } from "@template/domain/user/application/UserApplicationErrorNotFound"
import type { UserErrorNotFoundWithAccessToken } from "@template/domain/user/application/UserApplicationErrorNotFoundWithAccessToken"
import { Effect, Exit, Layer, Redacted } from "effect"
import { PortUUID } from "../../../infrastructure/application/PortUUID.js"
import { policyRequire } from "../../../util/Policy.js"
import { AccountPortDriving } from "../../account/application/AccountApplicationPortDriving.js"
import { UserEventEmitter } from "../adapter/UserAdapterEventEmitter.js"
import { makeUserReadResolver, UserReadByAccessToken, UserReadById } from "./UserApplicationCache.js"
import { UserPortDriven } from "./UserApplicationPortDriven.js"
import { UserPortDriving } from "./UserApplicationPortDriving.js"

export const UserUseCase = Layer.effect(
  UserPortDriving,
  Effect.gen(function*() {
    const eventEmitter = yield* UserEventEmitter
    const account = yield* AccountPortDriving
    const driven = yield* UserPortDriven
    const uuid = yield* PortUUID
    const resolver = yield* makeUserReadResolver

    const create = (
      user: Omit<User, "id" | "ownerId" | "createdAt" | "updatedAt">
    ): Effect.Effect<
      UserWithSensitive,
      UserErrorEmailAlreadyTaken,
      | ActorAuthorized<"Account", "create">
      | ActorAuthorized<"User", "create">
      | ActorAuthorized<"User", "readByIdWithSensitive">
    > =>
      uuid.v7().pipe(
        Effect.flatMap((v7) =>
          account.create({}).pipe(
            Effect.flatMap((accountId) =>
              driven.create({ ...user, accessToken: AccessToken.make(Redacted.make(v7)), ownerId: accountId }).pipe(
                Effect.flatMap((userId) => readByIdWithSensitive(userId)),
                Effect.tap((out) =>
                  eventEmitter.emit("UserUseCaseCreate", {
                    in: { user: { ...user, ownerId: accountId } },
                    out: Exit.succeed(out)
                  })
                ),
                Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", user } }),
                policyRequire("User", "create")
              )
            )
          )
        )
      )

    const del = (id: UserId): Effect.Effect<UserId, UserErrorNotFound, ActorAuthorized<"User", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("UserUseCaseDelete", {
              in: { id },
              out: Exit.succeed(out)
            })
          ),
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyRequire("User", "delete")
        )

    const readAll = (
      urlParams: URLParams<User>
    ): Effect.Effect<SuccessArray<User, never, never>, never, ActorAuthorized<"User", "readAll">> =>
      driven.readAll(urlParams)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("UserUseCaseReadAll", {
              in: { urlParams },
              out: Exit.succeed(out)
            })
          ),
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
          policyRequire("User", "readAll")
        )

    const readByAccessToken = (
      accessToken: AccessToken
    ): Effect.Effect<User, UserErrorNotFoundWithAccessToken, ActorAuthorized<"User", "readByAccessToken">> =>
      Effect.request(new UserReadByAccessToken({ accessToken }), resolver)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("UserUseCaseReadByAccessToken", {
              in: { accessToken },
              out: Exit.succeed(out)
            })
          ),
          Effect.withSpan("UserUseCase", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByAccessToken", accessToken }
          }),
          policyRequire("User", "readByAccessToken")
        )

    const readById = (id: UserId): Effect.Effect<User, UserErrorNotFound, ActorAuthorized<"User", "readById">> =>
      Effect.request(new UserReadById({ id }), resolver)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("UserUseCaseReadById", {
              in: { id },
              out: Exit.succeed(out)
            })
          ),
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
          policyRequire("User", "readById")
        )

    const readByIdWithSensitive = (
      id: UserId
    ): Effect.Effect<UserWithSensitive, never, ActorAuthorized<"User", "readByIdWithSensitive">> =>
      driven.readByIdWithSensitive(id)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("UserUseCaseReadByIdWithSensitive", {
              in: { id },
              out: Exit.succeed(out)
            })
          ),
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive", id } }),
          policyRequire("User", "readByIdWithSensitive")
        )

    const update = (
      id: UserId,
      user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<UserId, UserErrorEmailAlreadyTaken | UserErrorNotFound, ActorAuthorized<"User", "update">> =>
      driven.update(id, user)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("UserUseCaseUpdate", {
              in: { id, user },
              out: Exit.succeed(out)
            })
          ),
          Effect.withSpan("UserUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, user } }),
          policyRequire("User", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readByAccessToken,
      readById,
      readByIdWithSensitive,
      update
    } as const
  })
)
