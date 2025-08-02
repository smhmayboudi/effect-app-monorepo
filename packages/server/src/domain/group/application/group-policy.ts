import type { ActorAuthorized, DomainActor, ErrorActorUnauthorized } from "@template/domain/actor"
import type { GroupId } from "@template/domain/group/application/domain-group"
import { Context, type Effect } from "effect"

export class PortGroupPolicy extends Context.Tag("PortGroupPolicy")<PortGroupPolicy, {
  canCreate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "create">, ErrorActorUnauthorized, DomainActor>
  canReadAll: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readAll">, ErrorActorUnauthorized, DomainActor>
  canReadById: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readById">, ErrorActorUnauthorized, DomainActor>
  canUpdate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "update">, ErrorActorUnauthorized, DomainActor>
}>() {}
