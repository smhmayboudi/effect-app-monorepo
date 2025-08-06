import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { AccessToken } from "@template/domain/user/application/UserApplicationDomain"
import { User, UserId, UserWithSensitive } from "@template/domain/user/application/UserApplicationDomain"
import { UserErrorEmailAlreadyTaken } from "@template/domain/user/application/UserApplicationErrorEmailAlreadyTaken"
import { UserErrorNotFound } from "@template/domain/user/application/UserApplicationErrorNotFound"
import { UserErrorNotFoundWithAccessToken } from "@template/domain/user/application/UserApplicationErrorNotFoundWithAccessToken"
import { Effect, Layer, Redacted } from "effect"
import { PortUserDriven } from "../application/port-user-driven.js"

export const UserDriven = Layer.effect(
  PortUserDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (
      user: Omit<UserWithSensitive, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<UserId, UserErrorEmailAlreadyTaken, never> =>
      sql<
        { id: number }
      >`INSERT INTO tbl_user ${sql.insert({ ...user, accessToken: Redacted.value(user.accessToken) })} RETURNING id`
        .pipe(
          Effect.catchTag("SqlError", (error) =>
            String(error.cause).includes("UNIQUE constraint failed: tbl_user.email")
              ? Effect.fail(new UserErrorEmailAlreadyTaken({ email: user.email }))
              : Effect.die(error)),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.map((row) => UserId.make(row.id)),
          Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", user } })
        )

    const del = (id: UserId): Effect.Effect<UserId, UserErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql<{ id: number }>`DELETE FROM tbl_user WHERE id = ${id} RETURNING id`),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => UserId.make(row.id)),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (): Effect.Effect<Array<User>, never, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at FROM tbl_user`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((users) => Effect.all(users.map((user) => User.decodeUnknown(user)))),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } })
      )

    const readByAccessToken = (
      accessToken: AccessToken
    ): Effect.Effect<User, UserErrorNotFoundWithAccessToken, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at FROM tbl_user WHERE access_token = ${
        Redacted.value(accessToken)
      }`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new UserErrorNotFoundWithAccessToken({ accessToken }))
            : Effect.succeed(rows[0])
        ),
        Effect.flatMap(User.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByAccessToken", accessToken } })
      )

    const readById = (id: UserId): Effect.Effect<User, UserErrorNotFound, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at FROM tbl_user WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new UserErrorNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.flatMap(User.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
      )

    const readByIdWithSensitive = (id: UserId): Effect.Effect<UserWithSensitive, never, never> =>
      sql`SELECT id, owner_id, access_token, email, created_at, updated_at FROM tbl_user WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.flatMap(UserWithSensitive.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive", id } })
      )

    const buildUpdateQuery = (
      id: UserId,
      user: Omit<User, "id" | "createdAt" | "updatedAt">
    ) =>
      sql<{ id: number }>`UPDATE tbl_user SET ${
        sql.update(user)
      }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: UserId,
      user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<UserId, UserErrorEmailAlreadyTaken | UserErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldUser) => buildUpdateQuery(id, { ownerId: oldUser.ownerId, email: oldUser.email, ...user })),
        Effect.catchTag("SqlError", (error) =>
          String(error.cause).includes("UNIQUE constraint failed: tbl_user.email")
            ? Effect.fail(new UserErrorEmailAlreadyTaken({ email: user.email! }))
            : Effect.die(error)),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => UserId.make(row.id)),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, user } })
      )

    return {
      create,
      delete: del,
      readAll,
      readByAccessToken,
      readById,
      readByIdWithSensitive,
      update
    } as const
  })
)
