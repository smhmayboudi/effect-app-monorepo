import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { PersonPortPolicy } from "../application/PersonApplicationPortPolicy.js"

const canCreate = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "create">, ActorErrorUnauthorized, Actor> =>
  policy("Person", "create", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
    ))

const canDelete = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "delete">, ActorErrorUnauthorized, Actor> =>
  policy("Person", "delete", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
    ))

const canReadAll = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "readAll">, ActorErrorUnauthorized, Actor> =>
  policy("Person", "readAll", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", {
        attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCcanReadAllreate", id, actor }
      })
    ))

const canReadById = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "readById">, ActorErrorUnauthorized, Actor> =>
  policy("Person", "readById", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
    ))

const canUpdate = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "update">, ActorErrorUnauthorized, Actor> =>
  policy("Person", "update", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
    ))

export const PersonPolicy = Layer.effect(
  PersonPortPolicy,
  Effect.sync(() => ({
    canCreate,
    canDelete,
    canReadAll,
    canReadById,
    canUpdate
  }))
)
