import { assert, describe, it } from "@effect/vitest"
import { ActorId } from "@template/domain/Actor"
import { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import { GroupPortDriving } from "@template/server/domain/group/application/GroupApplicationPortDriving"
import { PersonPortDriven } from "@template/server/domain/person/application/PersonApplicationPortDriven"
import { PersonPortDriving } from "@template/server/domain/person/application/PersonApplicationPortDriving"
import { PersonUseCase } from "@template/server/domain/person/application/PersonApplicationUseCase"
import { EventEmitterTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { ResultPersistenceTest } from "@template/server/infrastructure/adapter/ResultPersistence"
import { UUIDTest } from "@template/server/infrastructure/adapter/UUID"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"

describe("PersonUseCase", () => {
  it.scoped("should be created", () => {
    const now = new Date()

    return PersonPortDriving.pipe(
      Effect.flatMap((persons) =>
        persons.create({
          groupId: GroupId.make("00000000-0000-0000-0000-000000000000"),
          birthday: new Date(),
          firstName: "test",
          lastName: "test"
        }).pipe(
          withSystemActor,
          Effect.map((personId) => {
            assert.strictEqual(personId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        PersonUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(PersonPortDriven)({
            create: (_person) => Effect.succeed(PersonId.make("00000000-0000-0000-0000-000000000000"))
          }),
          EventEmitterTest(),
          ResultPersistenceTest,
          makeTestLayer(GroupPortDriving)({
            readById: (id) =>
              Effect.succeed(
                new Group({
                  id,
                  ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
                  name: "test",
                  createdAt: now,
                  updatedAt: now,
                  deletedAt: null
                })
              )
          })
        )
      ))
    )
  })

  it.scoped("should be deleted", () =>
    PersonPortDriving.pipe(
      Effect.flatMap((persons) =>
        persons.delete(PersonId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor,
          Effect.map((personId) => {
            assert.strictEqual(personId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        PersonUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(PersonPortDriven)({ delete: (id) => Effect.succeed(id) }),
          EventEmitterTest(),
          ResultPersistenceTest,
          makeTestLayer(GroupPortDriving)({})
        )
      ))
    ))

  it.scoped.fails("should be deleted with PersonErrorNotFound", () =>
    PersonPortDriving.pipe(
      Effect.flatMap((persons) =>
        persons.delete(PersonId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        PersonUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(PersonPortDriven)({ delete: (id) => Effect.fail(new PersonErrorNotFound({ id })) }),
          EventEmitterTest(),
          ResultPersistenceTest,
          makeTestLayer(GroupPortDriving)({})
        )
      ))
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

    return PersonPortDriving.pipe(
      Effect.flatMap((persons) =>
        persons.readAll({}).pipe(
          withSystemActor,
          Effect.map((personList) => {
            assert.deepStrictEqual(personList, {
              data: [personTest],
              total: 1
            })
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        PersonUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(PersonPortDriven)({
            readAll: (_urlParams) =>
              Effect.succeed({
                data: [personTest],
                total: 1
              })
          }),
          EventEmitterTest(),
          ResultPersistenceTest,
          makeTestLayer(GroupPortDriving)({})
        )
      ))
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

    return PersonPortDriving.pipe(
      Effect.flatMap((persons) =>
        persons.readById(PersonId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor,
          Effect.map((person) => {
            assert.strictEqual(person, personTest)
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        PersonUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(PersonPortDriven)({
            readById: (_id) => Effect.succeed(personTest),
            readByIds: (_ids) => Effect.succeed([personTest])
          }),
          EventEmitterTest(),
          ResultPersistenceTest,
          makeTestLayer(GroupPortDriving)({})
        )
      ))
    )
  })

  it.scoped.fails("should be readById with PersonErrorNotFound", () =>
    PersonPortDriving.pipe(
      Effect.flatMap((persons) =>
        persons.readById(PersonId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        PersonUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(PersonPortDriven)({
            readById: (id) => Effect.fail(new PersonErrorNotFound({ id })),
            readByIds: (ids) => Effect.fail(new PersonErrorNotFound({ id: ids[0] }))
          }),
          EventEmitterTest(),
          ResultPersistenceTest,
          makeTestLayer(GroupPortDriving)({})
        )
      ))
    ))

  it.scoped("should be update", () =>
    PersonPortDriving.pipe(
      Effect.flatMap((persons) =>
        persons.update(PersonId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
          withSystemActor,
          Effect.map((personId) => {
            assert.strictEqual(personId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        PersonUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(PersonPortDriven)({
            update: (id, _person) => Effect.succeed(PersonId.make(id))
          }),
          EventEmitterTest(),
          ResultPersistenceTest,
          makeTestLayer(GroupPortDriving)({})
        )
      ))
    ))

  it.scoped.fails("should be update with PersonErrorNotFound", () =>
    PersonPortDriving.pipe(
      Effect.flatMap((persons) =>
        persons.update(PersonId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        PersonUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(PersonPortDriven)({
            update: (id, _person) => Effect.fail(new PersonErrorNotFound({ id }))
          }),
          EventEmitterTest(),
          ResultPersistenceTest,
          makeTestLayer(GroupPortDriving)({})
        )
      ))
    ))
})
