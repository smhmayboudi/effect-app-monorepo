import { assert, describe, it } from "@effect/vitest"
import { ActorId } from "@template/domain/Actor"
import { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import { TodoPortDriven } from "@template/server/domain/todo/application/TodoApplicationPortDriven"
import { TodoPortDriving } from "@template/server/domain/todo/application/TodoApplicationPortDriving"
import { TodoUseCase } from "@template/server/domain/todo/application/TodoApplicationUseCase"
import { EventEmitterTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { ResultPersistenceTest } from "@template/server/infrastructure/adapter/ResultPersistence"
import { UUIDTest } from "@template/server/infrastructure/adapter/UUID"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import { Effect, Layer } from "effect"

describe("TodoUseCase", () => {
  it.scoped("should be created", () =>
    TodoPortDriving.pipe(
      Effect.flatMap((todos) =>
        todos.create({
          ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
          done: 0,
          text: "test"
        }).pipe(
          withSystemActor,
          Effect.map((todoId) => {
            assert.strictEqual(todoId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        TodoUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(TodoPortDriven)({
            create: (_todo) => Effect.succeed(TodoId.make("00000000-0000-0000-0000-000000000000"))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped("should be deleted", () =>
    TodoPortDriving.pipe(
      Effect.flatMap((todos) =>
        todos.delete(TodoId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor,
          Effect.map((todoId) => {
            assert.strictEqual(todoId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        TodoUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(TodoPortDriven)({ delete: (id) => Effect.succeed(id) }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped.fails("should be deleted with TodoErrorNotFound", () =>
    TodoPortDriving.pipe(
      Effect.flatMap((todos) =>
        todos.delete(TodoId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        TodoUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(TodoPortDriven)({ delete: (id) => Effect.fail(new TodoErrorNotFound({ id })) }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped("should be readAll", () => {
    const now = new Date()
    const todoTest = new Todo({
      id: TodoId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
      done: 0,
      text: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return TodoPortDriving.pipe(
      Effect.flatMap((todos) =>
        todos.readAll({}).pipe(
          withSystemActor,
          Effect.map((todoList) => {
            assert.deepStrictEqual(todoList, {
              data: [todoTest],
              total: 1
            })
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        TodoUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(TodoPortDriven)({
            readAll: (_urlParams) =>
              Effect.succeed({
                data: [todoTest],
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
    const todoTest = new Todo({
      id: TodoId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: ActorId.make("00000000-0000-0000-0000-000000000000"),
      done: 0,
      text: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return TodoPortDriving.pipe(
      Effect.flatMap((todos) =>
        todos.readById(TodoId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor,
          Effect.map((todo) => {
            assert.strictEqual(todo, todoTest)
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        TodoUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(TodoPortDriven)({
            readById: (_id) => Effect.succeed(todoTest),
            readByIds: (_ids) => Effect.succeed([todoTest])
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    )
  })

  it.scoped.fails("should be readById with TodoErrorNotFound", () =>
    TodoPortDriving.pipe(
      Effect.flatMap((todos) =>
        todos.readById(TodoId.make("00000000-0000-0000-0000-000000000000")).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        TodoUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(TodoPortDriven)({
            readById: (id) => Effect.fail(new TodoErrorNotFound({ id })),
            readByIds: (ids) => Effect.fail(new TodoErrorNotFound({ id: ids[0] }))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped("should be update", () =>
    TodoPortDriving.pipe(
      Effect.flatMap((todos) =>
        todos.update(TodoId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
          withSystemActor,
          Effect.map((todoId) => {
            assert.strictEqual(todoId, "00000000-0000-0000-0000-000000000000")
          })
        )
      ),
      Effect.provide(Layer.provideMerge(
        TodoUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(TodoPortDriven)({
            update: (id, _todo) => Effect.succeed(TodoId.make(id))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))

  it.scoped.fails("should be update with TodoErrorNotFound", () =>
    TodoPortDriving.pipe(
      Effect.flatMap((todos) =>
        todos.update(TodoId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
          withSystemActor
        )
      ),
      Effect.provide(Layer.provideMerge(
        TodoUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(TodoPortDriven)({
            update: (id, _todo) => Effect.fail(new TodoErrorNotFound({ id }))
          }),
          EventEmitterTest(),
          ResultPersistenceTest
        )
      ))
    ))
})
