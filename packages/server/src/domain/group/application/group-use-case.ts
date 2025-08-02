import { Effect, Layer } from "effect"
import { PortGroupDriving } from "@template/server/domain/group/application/port-group-driving"
import { PortGroupDriven } from "@template/server/domain/group/application/port-group-driven"
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"
import { policyRequire } from "@template/server/util/policy"
import { ActorAuthorized } from "@template/domain/actor"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const GroupUseCase = Layer.effect(
  PortGroupDriving,
  Effect.gen(function* () {
    const driven = yield* PortGroupDriven

    const create = (group: Omit<DomainGroup, "id" | "createdAt" | "updatedAt">): Effect.Effect<GroupId, never, ActorAuthorized<"Group", "create">> =>
      driven.create(group)
        .pipe(
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", group }}),
          policyRequire("Group", "create")
        )

    const del = (id: GroupId): Effect.Effect<GroupId, ErrorGroupNotFound, ActorAuthorized<"Group", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
          policyRequire("Group", "delete")
        )

    const readAll = (): Effect.Effect<DomainGroup[], never, ActorAuthorized<"Group", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
          policyRequire("Group", "readAll")
        )

    const readById = (id: GroupId): Effect.Effect<DomainGroup, ErrorGroupNotFound, ActorAuthorized<"Group", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id }}),
          policyRequire("Group", "readById")
        )

    const update = (id: GroupId, group: Partial<Omit<DomainGroup, "id">>): Effect.Effect<GroupId, ErrorGroupNotFound, ActorAuthorized<"Group", "update">> =>
      driven.update(id, group)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, group }}),
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
