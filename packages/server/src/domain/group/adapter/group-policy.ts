import { Effect, Layer } from "effect"
import { policy } from "@template/server/util/policy"
import { DomainActor } from "@template/domain/actor"
import { GroupId } from "@template/domain/group/application/domain-group"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"
import { PortGroupPolicy } from "@template/server/domain/group/application/group-policy"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const GroupPolicy = Layer.effect(
  PortGroupPolicy,
  Effect.gen(function* () {
    const canCreate = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "create">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "create", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor }})
      ))

    const canDelete = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "delete">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "delete", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor }})
      ))

    const canReadAll = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "readAll">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "readAll", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor }})
      ))

    const canReadById = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "readById">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "readById", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor }})
      ))

    const canUpdate = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "update">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "update", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor }})
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
