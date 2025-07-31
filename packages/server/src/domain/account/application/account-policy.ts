import { Context, Effect } from "effect"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { AccountId } from "@template/domain/account/application/domain-account"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortAccountPolicy extends Context.Tag("PortAccountPolicy")<PortAccountPolicy, {
  canCreate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}
