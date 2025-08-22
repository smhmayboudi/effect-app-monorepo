import type { ActorAuthorized } from "@template/domain/Actor"
import type { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import type { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Context, type Effect } from "effect"

export class GroupPortDriving extends Context.Tag("GroupPortDriving")<GroupPortDriving, {
  create: (
    group: Omit<Group, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) => Effect.Effect<GroupId, never, ActorAuthorized<"Group", "create">>
  delete: (id: GroupId) => Effect.Effect<GroupId, GroupErrorNotFound, ActorAuthorized<"Group", "delete">>
  readAll: (
    urlParams: URLParams<Group>
  ) => Effect.Effect<SuccessArray<Group, never, never>, never, ActorAuthorized<"Group", "readAll">>
  readById: (id: GroupId) => Effect.Effect<Group, GroupErrorNotFound, ActorAuthorized<"Group", "readById">>
  update: (
    id: GroupId,
    group: Partial<Omit<Group, "id" | "createdAt" | "updatedAt" | "deletedAt">>
  ) => Effect.Effect<GroupId, GroupErrorNotFound, ActorAuthorized<"Group", "update">>
}>() {}
