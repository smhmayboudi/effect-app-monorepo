import type { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import { Context, type Effect } from "effect"

export class PortAccountPolicy extends Context.Tag("PortAccountPolicy")<PortAccountPolicy, {
  canCreate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "create">, ActorErrorUnauthorized, Actor>
  canReadAll: (
    id: AccountId
  ) => Effect.Effect<ActorAuthorized<"Account", "readAll">, ActorErrorUnauthorized, Actor>
  canReadById: (
    id: AccountId
  ) => Effect.Effect<ActorAuthorized<"Account", "readById">, ActorErrorUnauthorized, Actor>
  canUpdate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "update">, ActorErrorUnauthorized, Actor>
}>() {}
