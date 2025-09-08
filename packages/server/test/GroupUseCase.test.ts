import { assert, describe, it } from "@effect/vitest"
import { ActorId } from "@template/domain/Actor"
import { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import { GroupPortDriven } from "@template/server/domain/group/application/GroupApplicationPortDriven"
import { GroupPortDriving } from "@template/server/domain/group/application/GroupApplicationPortDriving"
import { GroupUseCase } from "@template/server/domain/group/application/GroupApplicationUseCase"
import { EventEmitterTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { ResultPersistenceTest } from "@template/server/infrastructure/adapter/ResultPersistence"
import { UUIDTest } from "@template/server/infrastructure/adapter/UUID"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import { Effect, Layer } from "effect"

describe("GroupUseCase", () => {
  it.scoped("should be created", () =>
    GroupPortDriving.pipe(
      Effect.flatMap((groups) =>
        groups.create({
          ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
          name: "test"
        }).pipe(
          withSystemActor,
          Effect.map((groupId) => {
            assert.strictEqual(groupId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        GroupUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(GroupPortDriven)({
            create: (_group) => Effect.succeed(GroupId.make("00000000-0000-0000-0000-000000000000"))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped("should be deleted", () =>
    GroupPortDriving.pipe(
      Effect.flatMap((groups) =>
        groups.delete(GroupId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor,
          Effect.map((groupId) => {
            assert.strictEqual(groupId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        GroupUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(GroupPortDriven)({ delete: (id) => Effect.succeed(id) }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped.fails("should be deleted with GroupErrorNotFound", () =>
    GroupPortDriving.pipe(
      Effect.flatMap((groups) =>
        groups.delete(GroupId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        GroupUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(GroupPortDriven)({ delete: (id) => Effect.fail(new GroupErrorNotFound({ id })) }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped("should be readAll", () => {
    const now = new Date()
    const groupTest = new Group({
      id: GroupId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
      name: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return GroupPortDriving.pipe(
      Effect.flatMap((groups) =>
        groups.readAll({}).pipe(
          withSystemActor,
          Effect.map((groupList) => {
            assert.deepStrictEqual(groupList, {
              data: [groupTest],
              total: 1
            })
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        GroupUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(GroupPortDriven)({
            readAll: (_urlParams) =>
              Effect.succeed({
                data: [groupTest],
                total: 1
              })
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    )
  })

  it.scoped("should be readById", () => {
    const now = new Date()
    const groupTest = new Group({
      id: GroupId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
      name: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return GroupPortDriving.pipe(
      Effect.flatMap((groups) =>
        groups.readById(GroupId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor,
          Effect.map((group) => {
            assert.strictEqual(group, groupTest)
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        GroupUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(GroupPortDriven)({
            readById: (_id) => Effect.succeed(groupTest),
            readByIds: (_ids) => Effect.succeed([groupTest])
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    )
  })

  it.scoped.fails("should be readById with GroupErrorNotFound", () =>
    GroupPortDriving.pipe(
      Effect.flatMap((groups) =>
        groups.readById(GroupId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        GroupUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(GroupPortDriven)({
            readById: (id) => Effect.fail(new GroupErrorNotFound({ id })),
            readByIds: (ids) => Effect.fail(new GroupErrorNotFound({ id: ids[0] }))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped("should be update", () =>
    GroupPortDriving.pipe(
      Effect.flatMap((groups) =>
        groups.update(GroupId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
          withSystemActor,
          Effect.map((groupId) => {
            assert.strictEqual(groupId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        GroupUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(GroupPortDriven)({
            update: (id, _group) => Effect.succeed(GroupId.make(id))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped.fails("should be update with GroupErrorNotFound", () =>
    GroupPortDriving.pipe(
      Effect.flatMap((groups) =>
        groups.update(GroupId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        GroupUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(GroupPortDriven)({
            update: (id, _group) => Effect.fail(new GroupErrorNotFound({ id }))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))
})
