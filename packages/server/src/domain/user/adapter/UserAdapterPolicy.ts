import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { UserId } from "@template/domain/user/application/UserApplicationDomain"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/Policy.js"
import { UserPortPolicy } from "../application/UserApplicationPortPolicy.js"

const canCreate = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "create">, ActorErrorUnauthorized, Actor> =>
  policy("User", "create", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
    ))

const canDelete = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "delete">, ActorErrorUnauthorized, Actor> =>
  policy("User", "delete", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
    ))

const canReadAll = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "readAll">, ActorErrorUnauthorized, Actor> =>
  policy("User", "readAll", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
    ))

const canReadByAccessToken = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "readByAccessToken">, ActorErrorUnauthorized, Actor> =>
  policy("User", "readByAccessToken", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadByAccessToken", id, actor } })
    ))

const canReadById = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "readById">, ActorErrorUnauthorized, Actor> =>
  policy("User", "readById", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
    ))

const canReadByIdWithSensitive = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "readByIdWithSensitive">, ActorErrorUnauthorized, Actor> =>
  policy("User", "readByIdWithSensitive", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", {
        attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadByIdWithSensitive", id, actor }
      })
    ))

const canUpdate = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "update">, ActorErrorUnauthorized, Actor> =>
  policy("User", "update", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
    ))

export const UserPolicy = Layer.effect(
  UserPortPolicy,
  Effect.sync(() => ({
    canCreate,
    canDelete,
    canReadAll,
    canReadByAccessToken,
    canReadById,
    canReadByIdWithSensitive,
    canUpdate
  }))
)
