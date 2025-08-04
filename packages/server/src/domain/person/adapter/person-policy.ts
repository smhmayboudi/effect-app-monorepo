import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized, DomainActor, ErrorActorUnauthorized } from "@template/domain/actor"
import type { PersonId } from "@template/domain/person/application/domain-person"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { PortPersonPolicy } from "../application/person-policy.js"

const canCreate = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "create">, ErrorActorUnauthorized, DomainActor> =>
  policy("Person", "create", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
    ))

const canDelete = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "delete">, ErrorActorUnauthorized, DomainActor> =>
  policy("Person", "delete", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
    ))

const canReadAll = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "readAll">, ErrorActorUnauthorized, DomainActor> =>
  policy("Person", "readAll", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", {
        attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCcanReadAllreate", id, actor }
      })
    ))

const canReadById = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "readById">, ErrorActorUnauthorized, DomainActor> =>
  policy("Person", "readById", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
    ))

const canUpdate = (
  id: PersonId
): Effect.Effect<ActorAuthorized<"Person", "update">, ErrorActorUnauthorized, DomainActor> =>
  policy("Person", "update", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
    ))

export const PersonPolicy = Layer.effect(
  PortPersonPolicy,
  Effect.sync(() => ({
    canCreate,
    canDelete,
    canReadAll,
    canReadById,
    canUpdate
  }))
)
