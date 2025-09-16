import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { Context, type Effect } from "effect"

export class ServicePortPolicy extends Context.Tag("ServicePortPolicy")<ServicePortPolicy, {
  canCreate: (id: ServiceId) => Effect.Effect<ActorAuthorized<"Service", "create">, ActorErrorUnauthorized, Actor>
  canDelete: (id: ServiceId) => Effect.Effect<ActorAuthorized<"Service", "delete">, ActorErrorUnauthorized, Actor>
  canReadAll: (id: ServiceId) => Effect.Effect<ActorAuthorized<"Service", "readAll">, ActorErrorUnauthorized, Actor>
  canReadById: (id: ServiceId) => Effect.Effect<ActorAuthorized<"Service", "readById">, ActorErrorUnauthorized, Actor>
  canUpdate: (id: ServiceId) => Effect.Effect<ActorAuthorized<"Service", "update">, ActorErrorUnauthorized, Actor>
}>() {}
