import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { GroupPortPolicy } from "../application/GroupApplicationPortPolicy.js"

const canCreate = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "create">, ActorErrorUnauthorized, Actor> =>
  policy("Group", "create", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
    ))

const canDelete = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "delete">, ActorErrorUnauthorized, Actor> =>
  policy("Group", "delete", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
    ))

const canReadAll = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "readAll">, ActorErrorUnauthorized, Actor> =>
  policy("Group", "readAll", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
    ))

const canReadById = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "readById">, ActorErrorUnauthorized, Actor> =>
  policy("Group", "readById", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
    ))

const canUpdate = (
  id: GroupId
): Effect.Effect<ActorAuthorized<"Group", "update">, ActorErrorUnauthorized, Actor> =>
  policy("Group", "update", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
    ))

export const GroupPolicy = Layer.effect(
  GroupPortPolicy,
  Effect.sync(() => ({
    canCreate,
    canDelete,
    canReadAll,
    canReadById,
    canUpdate
  }))
)
