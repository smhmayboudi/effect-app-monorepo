import { SqlClient } from "@effect/sql"
import { SqlError } from "@effect/sql/SqlError"
import { DomainUser, UserId } from "@template/domain/user/application/domain-user"
import { Context, Effect, Layer } from "effect"
import { ParseError } from "effect/ParseResult"
import { PortUUID } from "./UUID.js"
import { UserSignupPayload } from "@template/domain/user/api-group-user"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"

export class PortUser extends Context.Tag("PortUser")<PortUser, {
  addUser: (data: UserSignupPayload) => Effect.Effect.AsEffect<Effect.Effect<DomainUser, ParseError | SqlError | ErrorUserEmailAlreadyTaken, PortUUID>>
  findUserById: (userId: UserId) => Effect.Effect<DomainUser, ParseError | SqlError | ErrorUserNotFound, never>
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

    const addUser = Effect.fn(function*(data: UserSignupPayload) {
      const existingUserForEmail = yield* sql`SELECT email FROM users WHERE email = ${data.email}`
      if (existingUserForEmail.length > 0) {
        yield* Effect.fail(new ErrorUserEmailAlreadyTaken({ email: data.email }))
      }
      const uuid = yield* PortUUID
      const generate = yield* uuid.generate()
      const userId = UserId.make(generate)
      yield* sql`INSERT INTO users 
        (id, email, name, surname, birthday) 
        VALUES (${userId}, ${data.email}, ${data.name}, ${data.surname}, ${data.birthday.toISOString()})`
      const user = yield* findUserById(userId).pipe(Effect.catchTag(ErrorUserNotFound._tag, Effect.die))

      return user
    }, sql.withTransaction)

    const findUserById = Effect.fn(function*(id: UserId) {
      const users = yield* sql`SELECT * FROM users WHERE id = ${id}`

      return (users.length !== 1) ? 
        yield* Effect.fail(new ErrorUserNotFound({ id }))
        : yield* DomainUser.decodeUknown(users[0])
    })

    return { addUser, findUserById }
  })
)
