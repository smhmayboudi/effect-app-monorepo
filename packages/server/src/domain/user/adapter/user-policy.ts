import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized, DomainActor, ErrorActorUnauthorized } from "@template/domain/actor"
import type { UserId } from "@template/domain/user/application/domain-user"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { PortUserPolicy } from "../application/user-policy.js"

const canCreate = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "create">, ErrorActorUnauthorized, DomainActor> =>
  policy("User", "create", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
    ))

const canDelete = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "delete">, ErrorActorUnauthorized, DomainActor> =>
  policy("User", "delete", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
    ))

const canReadAll = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "readAll">, ErrorActorUnauthorized, DomainActor> =>
  policy("User", "readAll", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
    ))

const canReadById = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "readById">, ErrorActorUnauthorized, DomainActor> =>
  policy("User", "readById", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
    ))

const canReadByIdWithSensitive = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "readByIdWithSensitive">, ErrorActorUnauthorized, DomainActor> =>
  policy("User", "readByIdWithSensitive", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", {
        attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadByIdWithSensitive", id, actor }
      })
    ))

const canUpdate = (
  id: UserId
): Effect.Effect<ActorAuthorized<"User", "update">, ErrorActorUnauthorized, DomainActor> =>
  policy("User", "update", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
    ))

export const UserPolicy = Layer.effect(
  PortUserPolicy,
  Effect.sync(() => ({
    canCreate,
    canDelete,
    canReadAll,
    canReadById,
    canReadByIdWithSensitive,
    canUpdate
  }))
)
