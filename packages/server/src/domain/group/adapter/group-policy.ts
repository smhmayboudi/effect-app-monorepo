import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainActor } from "@template/domain/actor"
import { GroupId } from "@template/domain/group/application/domain-group"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"
import { PortGroupPolicy } from "../application/group-policy.js"

export const GroupPolicy = Layer.effect(
  PortGroupPolicy,
  Effect.gen(function* () {
    const canCreate = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "create">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "create", (actor) => Effect.succeed(true))

    const canDelete = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "delete">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "readAll">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "readById">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "readById", (actor) => Effect.succeed(true))

    const canUpdate = (id: GroupId): Effect.Effect<ActorAuthorized<"Group", "update">, ErrorActorUnauthorized, DomainActor> =>
      policy("Group", "update", (actor) => Effect.succeed(true))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
