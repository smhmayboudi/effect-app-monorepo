import { Effect, Layer } from "effect";
import { PortGroupDriven } from "../application/port-group-driven.js";
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"
import { AccountId } from "@template/domain/account/application/domain-account";

export const GroupDriven = Layer.effect(
  PortGroupDriven,
  Effect.gen(function* () {
    const create = (group: Omit<DomainGroup, "id">): Effect.Effect<GroupId, never, never> =>
      Effect.succeed(GroupId.make(0))

    const del = (id: GroupId): Effect.Effect<void, ErrorGroupNotFound, never> =>
      Effect.void

    const readAll = (): Effect.Effect<DomainGroup[], never, never> =>
      Effect.succeed([DomainGroup.make({
        id: GroupId.make(0),
        ownerId: AccountId.make(0),
        name: "",
        createdAt: new Date(),
        updatedAt: new Date()
      })])

    const readById = (id: GroupId): Effect.Effect<DomainGroup, ErrorGroupNotFound, never> =>
      Effect.succeed(DomainGroup.make({
        id: GroupId.make(0),
        ownerId: AccountId.make(0),
        name: "",
        createdAt: new Date(),
        updatedAt: new Date()
      }))

    const update = (id: GroupId, group: Partial<Omit<DomainGroup, "id">>): Effect.Effect<void, ErrorGroupNotFound, never> =>
      Effect.succeed(GroupId.make(0))

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
