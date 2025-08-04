import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { AccessToken } from "@template/domain/user/application/domain-user"
import { DomainUser, DomainUserWithSensitive, UserId } from "@template/domain/user/application/domain-user"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { ErrorUserNotFoundWithAccessToken } from "@template/domain/user/application/error-user-not-found-with-access-token"
import { Effect, Layer, Redacted } from "effect"
import { PortUserDriven } from "../application/port-user-driven.js"

export const UserDriven = Layer.effect(
  PortUserDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (
      user: Omit<DomainUserWithSensitive, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never> =>
      sql<
        { id: number }
      >`INSERT INTO tbl_user ${sql.insert({ ...user, accessToken: Redacted.value(user.accessToken) })} RETURNING id`
        .pipe(
          Effect.catchTag("SqlError", (error) =>
            String(error.cause).includes("UNIQUE constraint failed: tbl_user.email")
              ? Effect.fail(new ErrorUserEmailAlreadyTaken({ email: user.email }))
              : Effect.die(error)),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.map((row) => UserId.make(row.id)),
          Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", user } })
        )

    const del = (id: UserId): Effect.Effect<void, ErrorUserNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql`DELETE FROM tbl_user WHERE id = ${id}`),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (): Effect.Effect<Array<DomainUser>, never, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at FROM tbl_user`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((users) => Effect.all(users.map((user) => DomainUser.decodeUnknown(user)))),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } })
      )

    const readByAccessToken = (
      accessToken: AccessToken
    ): Effect.Effect<DomainUser, ErrorUserNotFoundWithAccessToken, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at FROM tbl_user WHERE access_token = ${
        Redacted.value(accessToken)
      }`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new ErrorUserNotFoundWithAccessToken({ accessToken }))
            : Effect.succeed(rows[0])
        ),
        Effect.flatMap(DomainUser.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByAccessToken", accessToken } })
      )

    const readById = (id: UserId): Effect.Effect<DomainUser, ErrorUserNotFound, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at FROM tbl_user WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new ErrorUserNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.flatMap(DomainUser.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
      )

    const readByIdWithSensitive = (id: UserId): Effect.Effect<DomainUserWithSensitive, never, never> =>
      sql`SELECT id, owner_id, access_token, email, created_at, updated_at FROM tbl_user WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.flatMap(DomainUserWithSensitive.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive", id } })
      )

    const buildUpdateQuery = (
      id: UserId,
      user: Omit<DomainUser, "id" | "createdAt" | "updatedAt">
    ) => sql`UPDATE tbl_user SET ${sql.update(user)}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`

    const update = (
      id: UserId,
      user: Partial<Omit<DomainUser, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<void, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldUser) => buildUpdateQuery(id, { ...oldUser, ...user })),
        sql.withTransaction,
        Effect.catchTag("SqlError", (error) =>
          String(error.cause).includes("UNIQUE constraint failed: tbl_user.email")
            ? Effect.fail(new ErrorUserEmailAlreadyTaken({ email: user.email! }))
            : Effect.die(error)),
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
