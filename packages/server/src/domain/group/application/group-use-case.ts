import { Effect, Layer } from "effect"
import { PortGroupDriving } from "./port-group-driving.js"
import { PortGroupDriven } from "./port-group-driven.js"
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"

export const GroupUseCase = Layer.effect(
  PortGroupDriving,
  Effect.gen(function* () {
    const driven = yield* PortGroupDriven

    const create = (group: Omit<DomainGroup, "id" | "createdAt" | "updatedAt">): Effect.Effect<GroupId, never, never> => 
      driven.create(group)
        .pipe(Effect.withSpan("group.use-case.create", { attributes: { group } }))

    const del = (id: GroupId): Effect.Effect<GroupId, ErrorGroupNotFound, never> =>
      driven.delete(id)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("group.use-case.delete", { attributes: { id } }))

    const readAll = (): Effect.Effect<DomainGroup[], never, never> =>
      driven.readAll()
        .pipe(Effect.withSpan("group.use-case.readAll"))

    const readById = (id: GroupId): Effect.Effect<DomainGroup, ErrorGroupNotFound, never> =>
      driven.readById(id)
        .pipe(Effect.withSpan("group.use-case.readById", { attributes: { id } }))

    const update = (id: GroupId, group: Partial<Omit<DomainGroup, "id">>): Effect.Effect<GroupId, ErrorGroupNotFound, never> =>
      driven.update(id, group)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("group.use-case.update", { attributes: { id, group } }))

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
