import { Context, Effect } from "effect"
import { DomainActor } from "@template/domain/actor"
import { AccountId } from "@template/domain/account/application/domain-account"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortAccountPolicy extends Context.Tag("PortAccountPolicy")<PortAccountPolicy, {
  canCreate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "create">, ErrorActorUnauthorized, DomainActor>
  canReadAll: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "readAll">, ErrorActorUnauthorized, DomainActor>
  canReadById: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "readById">, ErrorActorUnauthorized, DomainActor>
  canUpdate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "update">, ErrorActorUnauthorized, DomainActor>
}>() {}
