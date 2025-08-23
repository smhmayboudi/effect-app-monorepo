import { assert, describe, it } from "@effect/vitest"
import { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import { GroupPortDriven } from "@template/server/domain/group/application/GroupApplicationPortDriven"
import { GroupPortDriving } from "@template/server/domain/group/application/GroupApplicationPortDriving"
import { GroupUseCase } from "@template/server/domain/group/application/GroupApplicationUseCase"
import { EventEmitterTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { RedisTest } from "@template/server/infrastructure/adapter/Redis"
import { UUIDTest } from "@template/server/infrastructure/adapter/UUID"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import { Effect } from "effect"

describe("GroupUseCase", () => {
  it.scoped("should be created", () =>
    Effect.gen(function*() {
      const groups = yield* GroupPortDriving
      const groupId = yield* groups.create({
        ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
        name: "test"
      }).pipe(
        withSystemActor
      )
      assert.strictEqual(groupId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(GroupUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(GroupPortDriven)({
          create: (_group) => Effect.succeed(GroupId.make("00000000-0000-0000-0000-000000000000"))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped("should be deleted", () =>
    Effect.gen(function*() {
      const groups = yield* GroupPortDriving
      const groupId = yield* groups.delete(GroupId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(groupId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(GroupUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(makeTestLayer(GroupPortDriven)({ delete: (id) => Effect.succeed(id) })),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped.fails("should be deleted with GroupErrorNotFound", () =>
    Effect.gen(function*() {
      const groups = yield* GroupPortDriving
      yield* groups.delete(GroupId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(GroupUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(GroupPortDriven)({ delete: (id) => Effect.fail(new GroupErrorNotFound({ id })) })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped("should be readAll", () => {
    const now = new Date()
    const groupTest = new Group({
      id: GroupId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
      name: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const groups = yield* GroupPortDriving
      const groupList = yield* groups.readAll({}).pipe(
        withSystemActor
      )
      assert.deepStrictEqual(groupList, {
        data: [groupTest],
        total: 1
      })
    }).pipe(
      Effect.provide(GroupUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(GroupPortDriven)({
          readAll: (_urlParams) =>
            Effect.succeed({
              data: [groupTest],
              total: 1
            })
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    )
  })

  it.scoped("should be readById", () => {
    const now = new Date()
    const groupTest = new Group({
      id: GroupId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
      name: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const groups = yield* GroupPortDriving
      const group = yield* groups.readById(GroupId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(group, groupTest)
    }).pipe(
      Effect.provide(GroupUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(GroupPortDriven)({
          readById: (_id) => Effect.succeed(groupTest),
          readByIds: (_ids) => Effect.succeed([groupTest])
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    )
  })

  it.scoped.fails("should be readById with GroupErrorNotFound", () =>
    Effect.gen(function*() {
      const groups = yield* GroupPortDriving
      yield* groups.readById(GroupId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(GroupUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(GroupPortDriven)({
          readById: (id) => Effect.fail(new GroupErrorNotFound({ id })),
          readByIds: (ids) => Effect.fail(new GroupErrorNotFound({ id: ids[0] }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped("should be update", () =>
    Effect.gen(function*() {
      const groups = yield* GroupPortDriving
      const groupId = yield* groups.update(GroupId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
      assert.strictEqual(groupId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(GroupUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(GroupPortDriven)({
          update: (id, _group) => Effect.succeed(GroupId.make(id))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped.fails("should be update with GroupErrorNotFound", () =>
    Effect.gen(function*() {
      const groups = yield* GroupPortDriving
      yield* groups.update(GroupId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(GroupUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(GroupPortDriven)({
          update: (id, _group) => Effect.fail(new GroupErrorNotFound({ id }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))
})
