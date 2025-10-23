import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class GroupPortPolicy extends Context.Tag("GroupPortPolicy")<GroupPortPolicy, {
  canCreate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "create">, ActorErrorUnauthorized, Actor>
  canDelete: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "delete">, ActorErrorUnauthorized, Actor>
  canReadAll: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readAll">, ActorErrorUnauthorized, Actor>
  canReadById: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readById">, ActorErrorUnauthorized, Actor>
  canUpdate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "update">, ActorErrorUnauthorized, Actor>
}>() {}
