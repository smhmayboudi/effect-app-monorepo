import { SqlClient } from "@effect/sql"
import { SqlError } from "@effect/sql/SqlError"
import {
  User,
  UserErrorEmailAlreadyTaken,
  UserErrorNotFound,
  UserId,
  type UserSignupRequestData
} from "@template/domain/UserApi"
import { Context, Effect, Layer } from "effect"
import { ParseError } from "effect/ParseResult"
import { PortUUID } from "./Uuid.js"

export class PortUser extends Context.Tag("PortUser")<PortUser, {
  addUser: (data: UserSignupRequestData) => Effect.Effect.AsEffect<Effect.Effect<User, ParseError | SqlError | UserErrorEmailAlreadyTaken, PortUUID>>
  findUserById: (userId: UserId) => Effect.Effect<User, ParseError | SqlError | UserErrorNotFound, never>
}>() {}

export const AdapterUser = Layer.effect(
  PortUser,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient
    yield* sql`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT,
            name TEXT,
            surname TEXT,
            birthday DATE
        )
    `

    const addUser = Effect.fn(function*(data: UserSignupRequestData) {
      const existingUserForEmail = yield* sql`SELECT email FROM users WHERE email = ${data.email}`
      if (existingUserForEmail.length > 0) {
        yield* Effect.fail(new UserErrorEmailAlreadyTaken({ email: data.email }))
      }
      const uuid = yield* PortUUID
      const generate = yield* uuid.generate()
      const userId = UserId.make(generate)
      yield* sql`INSERT INTO users 
        (id, email, name, surname, birthday) 
        VALUES (${userId}, ${data.email}, ${data.name}, ${data.surname}, ${data.birthday.toISOString()})`
      const user = yield* findUserById(userId).pipe(Effect.catchTag(UserErrorNotFound._tag, Effect.die))

      return user
    }, sql.withTransaction)

    const findUserById = Effect.fn(function*(userId: UserId) {
      const users = yield* sql`SELECT * FROM users WHERE id = ${userId}`

      return (users.length !== 1) ? 
        yield* Effect.fail(new UserErrorNotFound({ userId }))
        : yield* User.decodeUknown({ _tag: User._tag, ...users[0] })
    })

    return { addUser, findUserById }
  })
)
