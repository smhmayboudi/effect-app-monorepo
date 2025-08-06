import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import type { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import { Effect, Layer } from "effect"
import { policyRequire } from "../../../util/policy.js"
import { PortGroupDriven } from "./port-group-driven.js"
import { PortGroupDriving } from "./port-group-driving.js"

export const GroupUseCase = Layer.effect(
  PortGroupDriving,
  Effect.gen(function*() {
    const driven = yield* PortGroupDriven

    const create = (
      group: Omit<Group, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<GroupId, never, ActorAuthorized<"Group", "create">> =>
      driven.create(group)
        .pipe(
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", group } }),
          policyRequire("Group", "create")
        )

    const del = (id: GroupId): Effect.Effect<GroupId, GroupErrorNotFound, ActorAuthorized<"Group", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyRequire("Group", "delete")
        )

    const readAll = (): Effect.Effect<Array<Group>, never, ActorAuthorized<"Group", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } }),
          policyRequire("Group", "readAll")
        )

    const readById = (
      id: GroupId
    ): Effect.Effect<Group, GroupErrorNotFound, ActorAuthorized<"Group", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
          policyRequire("Group", "readById")
        )

    const update = (
      id: GroupId,
      group: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<GroupId, GroupErrorNotFound, ActorAuthorized<"Group", "update">> =>
      driven.update(id, group)
        .pipe(
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, group } }),
          policyRequire("Group", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
