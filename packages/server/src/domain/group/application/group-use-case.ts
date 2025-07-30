import { Effect, Layer } from "effect"
import { PortGroupDriving } from "./port-group-driving.js"
import { PortGroupDriven } from "./port-group-driven.js"
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"
import { policyRequire } from "../../../util/policy.js"
import { ActorAuthorized } from "@template/domain/actor"

export const GroupUseCase = Layer.effect(
  PortGroupDriving,
  Effect.gen(function* () {
    const driven = yield* PortGroupDriven

    const create = (group: Omit<DomainGroup, "id" | "createdAt" | "updatedAt">): Effect.Effect<GroupId, never, ActorAuthorized<"Group", "create">> =>
      driven.create(group)
        .pipe(
          Effect.withSpan("group.use-case.create", { attributes: { group } }),
          policyRequire("Group", "create")
        )

    const del = (id: GroupId): Effect.Effect<GroupId, ErrorGroupNotFound, ActorAuthorized<"Group", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("group.use-case.delete", { attributes: { id } }),
          policyRequire("Group", "delete")
        )

    const readAll = (): Effect.Effect<DomainGroup[], never, ActorAuthorized<"Group", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("group.use-case.readAll"),
          policyRequire("Group", "readAll")
        )

    const readById = (id: GroupId): Effect.Effect<DomainGroup, ErrorGroupNotFound, ActorAuthorized<"Group", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("group.use-case.readById", { attributes: { id } }),
          policyRequire("Group", "readById")
        )

    const update = (id: GroupId, group: Partial<Omit<DomainGroup, "id">>): Effect.Effect<GroupId, ErrorGroupNotFound, ActorAuthorized<"Group", "update">> =>
      driven.update(id, group)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("group.use-case.update", { attributes: { id, group } }),
          policyRequire("Group", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
