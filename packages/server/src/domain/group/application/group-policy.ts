import { Context, Effect } from "effect"
import { DomainActor } from "@template/domain/actor"
import { GroupId } from "@template/domain/group/application/domain-group"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortGroupPolicy extends Context.Tag("PortGroupPolicy")<PortGroupPolicy, {
  canCreate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "create">, ErrorActorUnauthorized, DomainActor>
  canReadAll: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readAll">, ErrorActorUnauthorized, DomainActor>
  canReadById: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readById">, ErrorActorUnauthorized, DomainActor>
  canUpdate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "update">, ErrorActorUnauthorized, DomainActor>
}>() {}
