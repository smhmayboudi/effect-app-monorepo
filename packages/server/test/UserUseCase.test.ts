import { assert, describe, it } from "@effect/vitest"
import { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import {
  AccessToken,
  Email,
  User,
  UserId,
  UserWithSensitive
} from "@template/domain/user/application/UserApplicationDomain"
import { UserErrorEmailAlreadyTaken } from "@template/domain/user/application/UserApplicationErrorEmailAlreadyTaken"
import { UserErrorNotFound } from "@template/domain/user/application/UserApplicationErrorNotFound"
import { UserErrorNotFoundWithAccessToken } from "@template/domain/user/application/UserApplicationErrorNotFoundWithAccessToken"
import { AccountPortDriving } from "@template/server/domain/account/application/AccountApplicationPortDriving"
import { UserPortDriven } from "@template/server/domain/user/application/UserApplicationPortDriven"
import { UserPortDriving } from "@template/server/domain/user/application/UserApplicationPortDriving"
import { UserUseCase } from "@template/server/domain/user/application/UserApplicationUseCase"
import { EventEmitterTest } from "@template/server/infrastructure/adapter/EventEmitter"
import { RedisTest } from "@template/server/infrastructure/adapter/Redis"
import { UUIDTest } from "@template/server/infrastructure/adapter/UUID"
import { makeTestLayer } from "@template/server/util/Layer"
import { withSystemActor } from "@template/server/util/Policy"
import { Effect, Redacted } from "effect"

describe("UserUseCase", () => {
  it.scoped("should be created", () => {
    const now = new Date()
    const userWithSensitiveTest = new UserWithSensitive({
      id: UserId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
      email: Email.make("smhmayboudi@gmail.com"),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      accessToken: AccessToken.make(Redacted.make("v7"))
    })

    return Effect.gen(function*() {
      const users = yield* UserPortDriving
      const userWithSensitive = yield* users.create({
        email: Email.make("smhmayboudi@gmail.com")
      }).pipe(
        withSystemActor
      )
      assert.strictEqual(userWithSensitive, userWithSensitiveTest)
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          create: (_user) => Effect.succeed(UserId.make("00000000-0000-0000-0000-000000000000")),
          readByIdWithSensitive: (_id) => Effect.succeed(userWithSensitiveTest)
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(
        makeTestLayer(AccountPortDriving)({
          create: (_account) => Effect.succeed(AccountId.make("00000000-0000-0000-0000-000000000000"))
        })
      )
    )
  })

  it.scoped.fails("should be created with UserErrorEmailAlreadyTaken", () => {
    const now = new Date()

    return Effect.gen(function*() {
      const users = yield* UserPortDriving
      const userWithSensitive = yield* users.create({
        email: Email.make("smhmayboudi@gmail.com")
      }).pipe(
        withSystemActor
      )
      assert.strictEqual(
        userWithSensitive,
        new UserWithSensitive({
          id: UserId.make("00000000-0000-0000-0000-000000000000"),
          ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
          email: Email.make("smhmayboudi@gmail.com"),
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
          accessToken: AccessToken.make(Redacted.make("v7"))
        })
      )
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          create: (user) => Effect.fail(new UserErrorEmailAlreadyTaken({ email: user.email }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    )
  })

  it.scoped("should be deleted", () =>
    Effect.gen(function*() {
      const users = yield* UserPortDriving
      const userId = yield* users.delete(UserId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(userId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(makeTestLayer(UserPortDriven)({ delete: (id) => Effect.succeed(id) })),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    ))

  it.scoped.fails("should be deleted with UserErrorNotFound", () =>
    Effect.gen(function*() {
      const users = yield* UserPortDriving
      yield* users.delete(UserId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({ delete: (id) => Effect.fail(new UserErrorNotFound({ id })) })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    ))

  it.scoped("should be readAll", () => {
    const now = new Date()
    const userTest = new User({
      id: UserId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
      email: Email.make("smhmayboudi@gmail.com"),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const users = yield* UserPortDriving
      const userList = yield* users.readAll({}).pipe(
        withSystemActor
      )
      assert.deepStrictEqual(userList, {
        data: [userTest],
        total: 1
      })
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          readAll: (_urlParams) =>
            Effect.succeed({
              data: [userTest],
              total: 1
            })
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    )
  })

  it.scoped("should be readByAccessToken", () => {
    const now = new Date()
    const userTest = new User({
      id: UserId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
      email: Email.make("smhmayboudi@gmail.com"),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const users = yield* UserPortDriving
      const user = yield* users.readByAccessToken(AccessToken.make(Redacted.make("v7"))).pipe(
        withSystemActor
      )
      assert.strictEqual(user, userTest)
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          readByAccessToken: (_accessToken) => Effect.succeed(userTest),
          readByAccessTokens: (_accessTokens) => Effect.succeed([userTest])
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    )
  })

  it.scoped.fails("should be readByAccessToken with UserErrorNotFoundWithAccessToken", () =>
    Effect.gen(function*() {
      const users = yield* UserPortDriving
      yield* users.readByAccessToken(AccessToken.make(Redacted.make("v7"))).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          readByAccessToken: (accessToken) => Effect.fail(new UserErrorNotFoundWithAccessToken({ accessToken })),
          readByAccessTokens: (accessTokens) =>
            Effect.fail(new UserErrorNotFoundWithAccessToken({ accessToken: accessTokens[0] }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    ))

  it.scoped("should be readById", () => {
    const now = new Date()
    const userTest = new User({
      id: UserId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
      email: Email.make("smhmayboudi@gmail.com"),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    })

    return Effect.gen(function*() {
      const users = yield* UserPortDriving
      const user = yield* users.readById(UserId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
      assert.strictEqual(user, userTest)
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          readById: (_id) => Effect.succeed(userTest),
          readByIds: (_ids) => Effect.succeed([userTest])
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    )
  })

  it.scoped.fails("should be readById with UserErrorNotFound", () =>
    Effect.gen(function*() {
      const users = yield* UserPortDriving
      yield* users.readById(UserId.make("00000000-0000-0000-0000-000000000000")).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          readById: (id) => Effect.fail(new UserErrorNotFound({ id })),
          readByIds: (ids) => Effect.fail(new UserErrorNotFound({ id: ids[0] }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    ))

  it.scoped("should be readByIdWithSensitive", () => {
    const now = new Date()
    const userWithSensitiveTest = new UserWithSensitive({
      id: UserId.make("00000000-0000-0000-0000-000000000000"),
      ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
      email: Email.make("smhmayboudi@gmail.com"),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      accessToken: AccessToken.make(Redacted.make("v7"))
    })
    return Effect.gen(function*() {
      const users = yield* UserPortDriving
      const userWithSensitive = yield* users.readByIdWithSensitive(UserId.make("00000000-0000-0000-0000-000000000000"))
        .pipe(
          withSystemActor
        )
      assert.strictEqual(userWithSensitive, userWithSensitiveTest)
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          readByIdWithSensitive: (_id) => Effect.succeed(userWithSensitiveTest)
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    )
  })

  it.scoped("should be update", () =>
    Effect.gen(function*() {
      const users = yield* UserPortDriving
      const userId = yield* users.update(UserId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
      assert.strictEqual(userId, "00000000-0000-0000-0000-000000000000")
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          update: (id, _user) => Effect.succeed(UserId.make(id))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    ))

  it.scoped.fails("should be update with UserErrorEmailAlreadyTaken", () =>
    Effect.gen(function*() {
      const users = yield* UserPortDriving
      yield* users.update(UserId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          update: (_id, user) => Effect.fail(new UserErrorEmailAlreadyTaken({ email: user.email! }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    ))

  it.scoped.fails("should be update with UserErrorNotFound", () =>
    Effect.gen(function*() {
      const users = yield* UserPortDriving
      yield* users.update(UserId.make("00000000-0000-0000-0000-000000000000"), {}).pipe(
        withSystemActor
      )
    }).pipe(
      Effect.provide(UserUseCase),
      Effect.provide(UUIDTest),
      Effect.provide(
        makeTestLayer(UserPortDriven)({
          update: (id, _user) => Effect.fail(new UserErrorNotFound({ id }))
        })
      ),
      Effect.provide(EventEmitterTest()),
      Effect.provide(RedisTest),
      Effect.provide(makeTestLayer(AccountPortDriving)({}))
    ))
})
