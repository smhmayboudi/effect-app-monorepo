import { Effect, Layer } from "effect";
import { PortGroupDriving } from "./port-group-driving.js";
import { PortGroupDriven } from "./port-group-driven.js";
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"

export const GroupUseCase = Layer.effect(
  PortGroupDriving,
  Effect.gen(function* () {
    const driven = yield* PortGroupDriven

    const create = (group: Omit<DomainGroup, "id">): Effect.Effect<GroupId, never, never> => 
      driven.create(group)

    const del = (id: GroupId): Effect.Effect<GroupId, ErrorGroupNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.delete(id)

        return id
      })

    const readAll = (): Effect.Effect<DomainGroup[], never, never> =>
      driven.readAll()

    const readById = (id: GroupId): Effect.Effect<DomainGroup, ErrorGroupNotFound, never> =>
      driven.readById(id)

    const update = (id: GroupId, group: Partial<Omit<DomainGroup, "id">>): Effect.Effect<GroupId, ErrorGroupNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.update(id, group)

        return id
      })

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
