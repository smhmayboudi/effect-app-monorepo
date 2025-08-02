import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized, DomainActor, ErrorActorUnauthorized } from "@template/domain/actor"
import type { GroupId } from "@template/domain/group/application/domain-group"
import { PortGroupPolicy } from "@template/server/domain/group/application/group-policy"
import { policy } from "@template/server/util/policy"
import { Effect, Layer } from "effect"

const canCreate = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "create">, ErrorActorUnauthorized, DomainActor> =>
  policy("Group", "create", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
    ))

const canDelete = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "delete">, ErrorActorUnauthorized, DomainActor> =>
  policy("Group", "delete", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
    ))

const canReadAll = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "readAll">, ErrorActorUnauthorized, DomainActor> =>
  policy("Group", "readAll", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
    ))

const canReadById = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "readById">, ErrorActorUnauthorized, DomainActor> =>
  policy("Group", "readById", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
    ))

const canUpdate = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "update">, ErrorActorUnauthorized, DomainActor> =>
  policy("Group", "update", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
    ))

export const GroupPolicy = Layer.effect(
  PortGroupPolicy,
  Effect.sync(() => ({
    canCreate,
    canDelete,
    canReadAll,
    canReadById,
    canUpdate
  }))
)
