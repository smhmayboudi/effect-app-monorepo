import type { AccountId } from "@template/domain/account/application/domain-account"
import type { ActorAuthorized, DomainActor, ErrorActorUnauthorized } from "@template/domain/actor"
import { Context, type Effect } from "effect"

export class PortAccountPolicy extends Context.Tag("PortAccountPolicy")<PortAccountPolicy, {
  canCreate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "create">, ErrorActorUnauthorized, DomainActor>
  canReadAll: (
    id: AccountId
  ) => Effect.Effect<ActorAuthorized<"Account", "readAll">, ErrorActorUnauthorized, DomainActor>
  canReadById: (
    id: AccountId
  ) => Effect.Effect<ActorAuthorized<"Account", "readById">, ErrorActorUnauthorized, DomainActor>
  canUpdate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "update">, ErrorActorUnauthorized, DomainActor>
}>() {}
