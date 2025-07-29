import { Context, Effect } from "effect"
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"

export class PortGroupDriven extends Context.Tag("PortGroupDriven")<PortGroupDriven, {
  create: (group: Omit<DomainGroup, "id">) => Effect.Effect<GroupId, never, never>
  delete: (id: GroupId) => Effect.Effect<void, ErrorGroupNotFound, never>
  readAll: () => Effect.Effect<DomainGroup[], never, never>
  readById: (id: GroupId) => Effect.Effect<DomainGroup, ErrorGroupNotFound, never>
  update: (id: GroupId, group: Partial<Omit<DomainGroup, "id">>) => Effect.Effect<void, ErrorGroupNotFound, never>
}>() {}
