import { Effect, Layer } from "effect"
import { policy } from "@template/server/util/policy"
import { DomainActor } from "@template/domain/actor"
import { PersonId } from "@template/domain/person/application/domain-person"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"
import { PortPersonPolicy } from "@template/server/domain/person/application/person-policy"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const PersonPolicy = Layer.effect(
  PortPersonPolicy,
  Effect.gen(function* () {
    const canCreate = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "create">, ErrorActorUnauthorized, DomainActor> =>
      policy("Person", "create", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor }})
      ))

    const canDelete = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "delete">, ErrorActorUnauthorized, DomainActor> =>
      policy("Person", "delete", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor }})
      ))

    const canReadAll = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "readAll">, ErrorActorUnauthorized, DomainActor> =>
      policy("Person", "readAll", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCcanReadAllreate", id, actor }})
      ))

    const canReadById = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "readById">, ErrorActorUnauthorized, DomainActor> =>
      policy("Person", "readById", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor }})
      ))

    const canUpdate = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "update">, ErrorActorUnauthorized, DomainActor> =>
      policy("Person", "update", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor }})
      ))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
