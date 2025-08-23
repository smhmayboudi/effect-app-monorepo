import { assert, describe, it } from "@effect/vitest"
import { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import { TodoPortDriven } from "@template/server/domain/todo/application/TodoApplicationPortDriven"
import { TodoPortDriving } from "@template/server/domain/todo/application/TodoApplicationPortDriving"
import { TodoUseCase } from "@template/server/domain/todo/application/TodoApplicationUseCase"
import { EventEmitterTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { RedisTest } from "@template/server/infrastructure/adapter/Redis"
import { UUIDTest } from "@template/server/infrastructure/adapter/UUID"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import { Effect } from "effect"

describe("TodoUseCase", () => {
  it.scoped("should be created", () =>
    Effect.gen(function*() {
      const todos = yield* TodoPortDriving
      const todoId = yield* todos.create({
        ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
        done: 0,
        text: "test"
      }).pipe(
        withSystemActor
      )
      assert.strictEqual(todoId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(TodoUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(TodoPortDriven)({
          create: (_todo) => Effect.succeed(TodoId.make("00000000-0000-0000-0000-000000000000"))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped("should be deleted", () =>
    Effect.gen(function*() {
      const todos = yield* TodoPortDriving
      const todoId = yield* todos.delete(TodoId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(todoId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(TodoUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(makeTestLayer(TodoPortDriven)({ delete: (id) => Effect.succeed(id) })),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped.fails("should be deleted with TodoErrorNotFound", () =>
    Effect.gen(function*() {
      const todos = yield* TodoPortDriving
      yield* todos.delete(TodoId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(TodoUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(TodoPortDriven)({ delete: (id) => Effect.fail(new TodoErrorNotFound({ id })) })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped("should be readAll", () => {
    const now = new Date()
    const todoTest = new Todo({
      id: TodoId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
      done: 0,
      text: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const todos = yield* TodoPortDriving
      const todoList = yield* todos.readAll({}).pipe(
        withSystemActor
      )
      assert.deepStrictEqual(todoList, {
        data: [todoTest],
        total: 1
      })
    }).pipe(
      Effect.provide(TodoUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(TodoPortDriven)({
          readAll: (_urlParams) =>
            Effect.succeed({
              data: [todoTest],
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
    const todoTest = new Todo({
      id: TodoId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
      done: 0,
      text: "test",
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const todos = yield* TodoPortDriving
      const todo = yield* todos.readById(TodoId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(todo, todoTest)
    }).pipe(
      Effect.provide(TodoUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(TodoPortDriven)({
          readById: (_id) => Effect.succeed(todoTest),
          readByIds: (_ids) => Effect.succeed([todoTest])
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    )
  })

  it.scoped.fails("should be readById with TodoErrorNotFound", () =>
    Effect.gen(function*() {
      const todos = yield* TodoPortDriving
      yield* todos.readById(TodoId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(TodoUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(TodoPortDriven)({
          readById: (id) => Effect.fail(new TodoErrorNotFound({ id })),
          readByIds: (ids) => Effect.fail(new TodoErrorNotFound({ id: ids[0] }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped("should be update", () =>
    Effect.gen(function*() {
      const todos = yield* TodoPortDriving
      const todoId = yield* todos.update(TodoId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
      assert.strictEqual(todoId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(TodoUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(TodoPortDriven)({
          update: (id, _todo) => Effect.succeed(TodoId.make(id))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))

  it.scoped.fails("should be update with TodoErrorNotFound", () =>
    Effect.gen(function*() {
      const todos = yield* TodoPortDriving
      yield* todos.update(TodoId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(TodoUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(TodoPortDriven)({
          update: (id, _todo) => Effect.fail(new TodoErrorNotFound({ id }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest)
    ))
})
