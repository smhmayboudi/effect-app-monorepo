import type { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"
import type { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { Context, type Effect } from "effect"

export class PortGroupDriven extends Context.Tag("PortGroupDriven")<PortGroupDriven, {
  create: (group: Omit<DomainGroup, "id" | "createdAt" | "updatedAt">) => Effect.Effect<GroupId, never, never>
  delete: (id: GroupId) => Effect.Effect<void, ErrorGroupNotFound, never>
  readAll: () => Effect.Effect<Array<DomainGroup>, never, never>
  readById: (id: GroupId) => Effect.Effect<DomainGroup, ErrorGroupNotFound, never>
  update: (id: GroupId, group: Partial<Omit<DomainGroup, "id">>) => Effect.Effect<void, ErrorGroupNotFound, never>
}>() {}
