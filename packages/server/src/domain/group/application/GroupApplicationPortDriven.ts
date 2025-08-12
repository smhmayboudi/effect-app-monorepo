import type { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import type { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Context, type Effect } from "effect"

export class GroupPortDriven extends Context.Tag("GroupPortDriven")<GroupPortDriven, {
  create: (group: Omit<Group, "id" | "createdAt" | "updatedAt">) => Effect.Effect<GroupId, never, never>
  delete: (id: GroupId) => Effect.Effect<GroupId, GroupErrorNotFound, never>
  readAll: (urlParams: URLParams<Group>) => Effect.Effect<SuccessArray<Group, never, never>, never, never>
  readById: (id: GroupId) => Effect.Effect<Group, GroupErrorNotFound, never>
  readByIds: (ids: Array<GroupId>) => Effect.Effect<Array<Group>, GroupErrorNotFound, never>
  update: (
    id: GroupId,
    group: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<GroupId, GroupErrorNotFound, never>
}>() {}
