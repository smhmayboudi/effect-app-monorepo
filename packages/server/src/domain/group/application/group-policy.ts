import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { Context, type Effect } from "effect"

export class PortGroupPolicy extends Context.Tag("PortGroupPolicy")<PortGroupPolicy, {
  canCreate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "create">, ActorErrorUnauthorized, Actor>
  canReadAll: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readAll">, ActorErrorUnauthorized, Actor>
  canReadById: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readById">, ActorErrorUnauthorized, Actor>
  canUpdate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "update">, ActorErrorUnauthorized, Actor>
}>() {}
