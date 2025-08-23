import { assert, describe, it } from "@effect/vitest"
import { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import { GroupPortDriving } from "@template/server/domain/group/application/GroupApplicationPortDriving"
import { PersonPortDriven } from "@template/server/domain/person/application/PersonApplicationPortDriven"
import { PersonPortDriving } from "@template/server/domain/person/application/PersonApplicationPortDriving"
import { PersonUseCase } from "@template/server/domain/person/application/PersonApplicationUseCase"
import { EventEmitterTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { RedisTest } from "@template/server/infrastructure/adapter/Redis"
import { UUIDTest } from "@template/server/infrastructure/adapter/UUID"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import { Effect } from "effect"

describe("PersonUseCase", () => {
  it.scoped("should be created", () => {
    const now = new Date()

    return Effect.gen(function*() {
      const persons = yield* PersonPortDriving
      const personId = yield* persons.create({
        groupId: GroupId.make("00000000-0000-0000-0000-000000000000"),
        birthday: new Date(),
        firstName: "test",
        lastName: "test"
      }).pipe(
        withSystemActor
      )
      assert.strictEqual(personId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(PersonUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(PersonPortDriven)({
          create: (_person) => Effect.succeed(PersonId.make("00000000-0000-0000-0000-000000000000"))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(
        makeTestLayer(GroupPortDriving)({
          readById: (id) =>
            Effect.succeed(
              new Group({
                id,
                ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
                name: "test",
                createdAt: now,
                updatedAt: now,
                deletedAt: null
              })
            )
        })
      )
    )
  })

  it.scoped("should be deleted", () =>
    Effect.gen(function*() {
      const persons = yield* PersonPortDriving
      const personId = yield* persons.delete(PersonId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(personId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(PersonUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(makeTestLayer(PersonPortDriven)({ delete: (id) => Effect.succeed(id) })),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(GroupPortDriving)({}))
    ))

  it.scoped.fails("should be deleted with PersonErrorNotFound", () =>
    Effect.gen(function*() {
      const persons = yield* PersonPortDriving
      yield* persons.delete(PersonId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(PersonUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(PersonPortDriven)({ delete: (id) => Effect.fail(new PersonErrorNotFound({ id })) })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(GroupPortDriving)({}))
    ))

  it.scoped("should be readAll", () => {
    const now = new Date()
    const personTest = new Person({
      id: PersonId.make("00000000-0000-0000-0000-000000000000"),
      groupId: GroupId.make("00000000-0000-0000-0000-000000000000"),
      birthday: new Date(),
      firstName: "test",
      lastName: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const persons = yield* PersonPortDriving
      const personList = yield* persons.readAll({}).pipe(
        withSystemActor
      )
      assert.deepStrictEqual(personList, {
        data: [personTest],
        total: 1
      })
    }).pipe(
      Effect.provide(PersonUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(PersonPortDriven)({
          readAll: (_urlParams) =>
            Effect.succeed({
              data: [personTest],
              total: 1
            })
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(GroupPortDriving)({}))
    )
  })

  it.scoped("should be readById", () => {
    const now = new Date()
    const personTest = new Person({
      id: PersonId.make("00000000-0000-0000-0000-000000000000"),
      groupId: GroupId.make("00000000-0000-0000-0000-000000000000"),
      birthday: new Date(),
      firstName: "test",
      lastName: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const persons = yield* PersonPortDriving
      const person = yield* persons.readById(PersonId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(person, personTest)
    }).pipe(
      Effect.provide(PersonUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(PersonPortDriven)({
          readById: (_id) => Effect.succeed(personTest),
          readByIds: (_ids) => Effect.succeed([personTest])
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(GroupPortDriving)({}))
    )
  })

  it.scoped.fails("should be readById with PersonErrorNotFound", () =>
    Effect.gen(function*() {
      const persons = yield* PersonPortDriving
      yield* persons.readById(PersonId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(PersonUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(PersonPortDriven)({
          readById: (id) => Effect.fail(new PersonErrorNotFound({ id })),
          readByIds: (ids) => Effect.fail(new PersonErrorNotFound({ id: ids[0] }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(GroupPortDriving)({}))
    ))

  it.scoped("should be update", () =>
    Effect.gen(function*() {
      const persons = yield* PersonPortDriving
      const personId = yield* persons.update(PersonId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
      assert.strictEqual(personId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(PersonUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(PersonPortDriven)({
          update: (id, _person) => Effect.succeed(PersonId.make(id))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(GroupPortDriving)({}))
    ))

  it.scoped.fails("should be update with PersonErrorNotFound", () =>
    Effect.gen(function*() {
      const persons = yield* PersonPortDriving
      yield* persons.update(PersonId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(PersonUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(PersonPortDriven)({
          update: (id, _person) => Effect.fail(new PersonErrorNotFound({ id }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(GroupPortDriving)({}))
    ))
})
