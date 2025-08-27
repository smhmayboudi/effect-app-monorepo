import { assert, describe, it } from "@effect/vitest"
import { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import { AccountPortDriven } from "@template/server/domain/account/application/AccountApplicationPortDriven"
import { AccountPortDriving } from "@template/server/domain/account/application/AccountApplicationPortDriving"
import { AccountUseCase } from "@template/server/domain/account/application/AccountApplicationUseCase"
import { EventEmitterTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { ResultPersistenceRedisTest } from "@template/server/infrastructure/adapter/ResultPersistenceRedis"
import { UUIDTest } from "@template/server/infrastructure/adapter/UUID"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import { Effect, Layer } from "effect"

describe("AccountUseCase", () => {
  it.scoped("should be created", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const accountId = yield* accounts.create({}).pipe(
        withSystemActor
      )
      assert.strictEqual(accountId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(Layer.provideMerge(
        AccountUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(AccountPortDriven)({
            create: (_account) => Effect.succeed(AccountId.make("00000000-0000-0000-0000-000000000000"))
          }),
          EventEmitterTest(),
          ResultPersistenceRedisTest
        )
      ))
    ))

  it.scoped("should be deleted", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const accountId = yield* accounts.delete(AccountId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(accountId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(Layer.provideMerge(
        AccountUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(AccountPortDriven)({ delete: (id) => Effect.succeed(id) }),
          EventEmitterTest(),
          ResultPersistenceRedisTest
        )
      ))
    ))

  it.scoped.fails("should be deleted with AccountErrorNotFound", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      yield* accounts.delete(AccountId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(Layer.provideMerge(
        AccountUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(AccountPortDriven)({ delete: (id) => Effect.fail(new AccountErrorNotFound({ id })) }),
          EventEmitterTest(),
          ResultPersistenceRedisTest
        )
      ))
    ))

  it.scoped("should be readAll", () => {
    const now = new Date()
    const AccountTest = new Account({
      id: AccountId.make("00000000-0000-0000-0000-000000000000"),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const accountList = yield* accounts.readAll({}).pipe(
        withSystemActor
      )
      assert.deepStrictEqual(accountList, {
        data: [AccountTest],
        total: 1
      })
    }).pipe(
      Effect.provide(Layer.provideMerge(
        AccountUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(AccountPortDriven)({
            readAll: (_urlParams) =>
              Effect.succeed({
                data: [AccountTest],
                total: 1
              })
          }),
          EventEmitterTest(),
          ResultPersistenceRedisTest
        )
      ))
    )
  })

  it.scoped("should be readById", () => {
    const now = new Date()
    const AccountTest = new Account({
      id: AccountId.make("00000000-0000-0000-0000-000000000000"),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const account = yield* accounts.readById(AccountId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(account, AccountTest)
    }).pipe(
      Effect.provide(Layer.provideMerge(
        AccountUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(AccountPortDriven)({
            readById: (_id) => Effect.succeed(AccountTest),
            readByIds: (_ids) => Effect.succeed([AccountTest])
          }),
          EventEmitterTest(),
          ResultPersistenceRedisTest
        )
      ))
    )
  })

  it.scoped.fails("should be readById with AccountErrorNotFound", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      yield* accounts.readById(AccountId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(Layer.provideMerge(
        AccountUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(AccountPortDriven)({
            readById: (id) => Effect.fail(new AccountErrorNotFound({ id })),
            readByIds: (ids) => Effect.fail(new AccountErrorNotFound({ id: ids[0] }))
          }),
          EventEmitterTest(),
          ResultPersistenceRedisTest
        )
      ))
    ))

  it.scoped("should be update", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const accountId = yield* accounts.update(AccountId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
      assert.strictEqual(accountId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(Layer.provideMerge(
        AccountUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(AccountPortDriven)({
            update: (id, _account) => Effect.succeed(AccountId.make(id))
          }),
          EventEmitterTest(),
          ResultPersistenceRedisTest
        )
      ))
    ))

  it.scoped.fails("should be update with AccountErrorNotFound", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      yield* accounts.update(AccountId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(Layer.provideMerge(
        AccountUseCase,
        Layer.mergeAll(
          UUIDTest,
          makeTestLayer(AccountPortDriven)({
            update: (id, _account) => Effect.fail(new AccountErrorNotFound({ id }))
          }),
          EventEmitterTest(),
          ResultPersistenceRedisTest
        )
      ))
    ))
})
