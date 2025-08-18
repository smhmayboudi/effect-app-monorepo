import { assert, describe, it } from "@effect/vitest"
import { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { AccountPortDriven } from "@template/server/domain/account/application/AccountApplicationPortDriven"
import { AccountPortDriving } from "@template/server/domain/account/application/AccountApplicationPortDriving"
import { AccountUseCase } from "@template/server/domain/account/application/AccountApplicationUseCase"
import { makeTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { RedisTest } from "@template/server/infrastructure/adapter/Redis"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import { Effect } from "effect"
import { AccountErrorNotFound } from "../../domain/src/account/application/AccountApplicationErrorNotFound.js"

describe("AccountUseCase", () => {
  it.scoped("should be created", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const accountId = yield* accounts.create({}).pipe(
        withSystemActor
      )
      assert.strictEqual(accountId, 1)
    }).pipe(
      Effect.provide(AccountUseCase),
      Effect.provide(makeTest()),
      Effect.provide(makeTestLayer(AccountPortDriven)({ create: (_account) => Effect.succeed(AccountId.make(1)) })),
      Effect.provide(RedisTest)
    ))

  it.scoped("should be deleted", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const accountId = yield* accounts.delete(AccountId.make(1)).pipe(
        withSystemActor
      )
      assert.strictEqual(accountId, 1)
    }).pipe(
      Effect.provide(AccountUseCase),
      Effect.provide(makeTest()),
      Effect.provide(makeTestLayer(AccountPortDriven)({ delete: (id) => Effect.succeed(id) })),
      Effect.provide(RedisTest)
    ))

  it.scoped.fails("should be deleted with AccountErrorNotFound", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const _accountId = yield* accounts.delete(AccountId.make(1)).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(AccountUseCase),
      Effect.provide(makeTest()),
      Effect.provide(
        makeTestLayer(AccountPortDriven)({ delete: (id) => Effect.fail(new AccountErrorNotFound({ id })) })
      ),
      Effect.provide(RedisTest)
    ))

  it.scoped("should be readAll", () => {
    const now = new Date()
    const acc = new Account({
      id: AccountId.make(1),
      createdAt: now,
      updatedAt: now
    })

    return Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const accountList = yield* accounts.readAll({}).pipe(
        withSystemActor
      )
      assert.deepStrictEqual(accountList, {
        data: [acc],
        total: 1
      })
    }).pipe(
      Effect.provide(AccountUseCase),
      Effect.provide(makeTest()),
      Effect.provide(
        makeTestLayer(AccountPortDriven)({
          readAll: (_urlParams) =>
            Effect.succeed({
              data: [acc],
              total: 1
            })
        })
      ),
      Effect.provide(RedisTest)
    )
  })

  it.scoped("should be readById", () => {
    const now = new Date()
    const acc = new Account({
      id: AccountId.make(1),
      createdAt: now,
      updatedAt: now
    })

    return Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const account = yield* accounts.readById(AccountId.make(1)).pipe(
        withSystemActor
      )
      assert.strictEqual(account, acc)
    }).pipe(
      Effect.provide(AccountUseCase),
      Effect.provide(makeTest()),
      Effect.provide(
        makeTestLayer(AccountPortDriven)({
          readById: (_id) => Effect.succeed(acc),
          readByIds: (_ids) => Effect.succeed([acc])
        })
      ),
      Effect.provide(RedisTest)
    )
  })

  it.scoped.fails("should be readById with AccountErrorNotFound", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const _account = yield* accounts.readById(AccountId.make(1)).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(AccountUseCase),
      Effect.provide(makeTest()),
      Effect.provide(
        makeTestLayer(AccountPortDriven)({
          readById: (id) => Effect.fail(new AccountErrorNotFound({ id })),
          readByIds: (ids) => Effect.fail(new AccountErrorNotFound({ id: ids[0] }))
        })
      ),
      Effect.provide(RedisTest)
    ))

  it.scoped("should be update", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const accountId = yield* accounts.update(AccountId.make(1), {}).pipe(
        withSystemActor
      )
      assert.strictEqual(accountId, 1)
    }).pipe(
      Effect.provide(AccountUseCase),
      Effect.provide(makeTest()),
      Effect.provide(
        makeTestLayer(AccountPortDriven)({
          update: (id, _account) => Effect.succeed(AccountId.make(id))
        })
      ),
      Effect.provide(RedisTest)
    ))

  it.scoped.fails("should be update with AccountErrorNotFound", () =>
    Effect.gen(function*() {
      const accounts = yield* AccountPortDriving
      const _accountId = yield* accounts.update(AccountId.make(1), {}).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(AccountUseCase),
      Effect.provide(makeTest()),
      Effect.provide(
        makeTestLayer(AccountPortDriven)({
          update: (id, _account) => Effect.fail(new AccountErrorNotFound({ id }))
        })
      ),
      Effect.provide(RedisTest)
    ))
})
