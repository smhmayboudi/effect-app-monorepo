import type { ActorAuthorized } from "@template/domain/actor"
import type { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"
import type { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { Context, type Effect } from "effect"

export class PortGroupDriving extends Context.Tag("PortGroupDriving")<PortGroupDriving, {
  create: (
    group: Omit<DomainGroup, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<GroupId, never, ActorAuthorized<"Group", "create">>
  delete: (id: GroupId) => Effect.Effect<GroupId, ErrorGroupNotFound, ActorAuthorized<"Group", "delete">>
  readAll: () => Effect.Effect<Array<DomainGroup>, never, ActorAuthorized<"Group", "readAll">>
  readById: (id: GroupId) => Effect.Effect<DomainGroup, ErrorGroupNotFound, ActorAuthorized<"Group", "readById">>
  update: (
    id: GroupId,
    group: Partial<Omit<DomainGroup, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<GroupId, ErrorGroupNotFound, ActorAuthorized<"Group", "update">>
}>() {}
