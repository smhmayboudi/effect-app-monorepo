import type { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import type { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import { Context, type Effect } from "effect"

export class GroupPortDriven extends Context.Tag("GroupPortDriven")<GroupPortDriven, {
  create: (group: Omit<Group, "id" | "createdAt" | "updatedAt">) => Effect.Effect<GroupId, never, never>
  delete: (id: GroupId) => Effect.Effect<GroupId, GroupErrorNotFound, never>
  readAll: () => Effect.Effect<Array<Group>, never, never>
  readById: (id: GroupId) => Effect.Effect<Group, GroupErrorNotFound, never>
  update: (
    id: GroupId,
    group: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<GroupId, GroupErrorNotFound, never>
}>() {}
