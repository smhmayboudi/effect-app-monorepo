import { Context, Effect } from "effect"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { GroupId } from "@template/domain/group/application/domain-group"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortGroupPolicy extends Context.Tag("PortGroupPolicy")<PortGroupPolicy, {
  canCreate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (id: GroupId) => Effect.Effect<ActorAuthorized<"Group", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}
