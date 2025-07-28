import { SqlClient } from "@effect/sql"
import { SqlError } from "@effect/sql/SqlError"
import { DomainUser, UserId } from "@template/domain/user/application/domain-user"
import { Context, Effect, Layer } from "effect"
import { ParseError } from "effect/ParseResult"
import { UserSignupPayload } from "@template/domain/user/api-group-user"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { PortUUID } from "./infrastructure/application/port/UUID.js"

export class PortUser extends Context.Tag("PortUser")<PortUser, {
  create: (data: UserSignupPayload) => Effect.Effect<DomainUser, ErrorUserEmailAlreadyTaken | ParseError | SqlError, never>
  readById: (userId: UserId) => Effect.Effect<DomainUser, ErrorUserNotFound | ParseError | SqlError, never>
}>() {}

export const User = Layer.effect(
  PortUser,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient
    yield* sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        birthday DATE,
        email TEXT,
        name TEXT,
        surname TEXT
      )
    `
    const uuid = yield* PortUUID

    const create = (data: UserSignupPayload): Effect.Effect<DomainUser, ErrorUserEmailAlreadyTaken | ParseError | SqlError, never> =>
      Effect.gen(function*() {
        const existingUserForEmail = yield* sql`
          SELECT email FROM users WHERE email = ${data.email}
        `
        if (existingUserForEmail.length > 0) {
          yield* Effect.fail(new ErrorUserEmailAlreadyTaken({ email: data.email }))
        }
        const v7 = yield* uuid.v7()
        const id = UserId.make(v7)
        yield* sql`
          INSERT INTO users (id, birthday, email, name, surname) VALUES (${id}, ${data.birthday.toISOString()}, ${data.email}, ${data.name}, ${data.surname})
        `
        const user = yield* readById(id).pipe(Effect.catchTag(ErrorUserNotFound._tag, Effect.die))

        return user
      }).pipe(sql.withTransaction)

    const readById = (id: UserId): Effect.Effect<DomainUser, ErrorUserNotFound | ParseError | SqlError, never> =>
      Effect.gen(function*() {
        const users = yield* sql`SELECT * FROM users WHERE id = ${id}`

        return (users.length !== 1) ? 
          yield* Effect.fail(new ErrorUserNotFound({ id }))
          : yield* DomainUser.decodeUknown(users[0])
      })

    return {
      create,
      readById
    } as const
  })
)
