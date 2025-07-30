import { Context, Effect } from "effect"
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"
import { ActorAuthorized } from "@template/domain/actor"

export class PortGroupDriving extends Context.Tag("PortGroupDriving")<PortGroupDriving, {
  create: (group: Omit<DomainGroup, "id" | "createdAt" | "updatedAt">) => Effect.Effect<GroupId, never, ActorAuthorized<"Group", "create">>
  delete: (id: GroupId) => Effect.Effect<GroupId, ErrorGroupNotFound, ActorAuthorized<"Group", "delete">>
  readAll: () => Effect.Effect<DomainGroup[], never, ActorAuthorized<"Group", "readAll">>
  readById: (id: GroupId) => Effect.Effect<DomainGroup, ErrorGroupNotFound, ActorAuthorized<"Group", "readById">>
  update: (id: GroupId, group: Partial<Omit<DomainGroup, "id">>) => Effect.Effect<GroupId, ErrorGroupNotFound, ActorAuthorized<"Group", "update">>
}>() {}
