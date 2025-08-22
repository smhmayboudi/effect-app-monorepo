import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { AccessToken } from "@template/domain/user/application/UserApplicationDomain"
import { User, UserId, UserWithSensitive } from "@template/domain/user/application/UserApplicationDomain"
import { UserErrorEmailAlreadyTaken } from "@template/domain/user/application/UserApplicationErrorEmailAlreadyTaken"
import { UserErrorNotFound } from "@template/domain/user/application/UserApplicationErrorNotFound"
import { UserErrorNotFoundWithAccessToken } from "@template/domain/user/application/UserApplicationErrorNotFoundWithAccessToken"
import { Effect, Layer, Redacted } from "effect"
import { buildSelectCountQuery, buildSelectQuery } from "../../../shared/adapter/URLParams.js"
import { formatDateTimeForSQL } from "../../../util/Date.js"
import { UserPortDriven } from "../application/UserApplicationPortDriven.js"

export const UserDriven = Layer.effect(
  UserPortDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (
      user: Omit<UserWithSensitive, "createdAt" | "updatedAt" | "deletedAt">
    ): Effect.Effect<UserId, UserErrorEmailAlreadyTaken, never> =>
      sql<
        { id: string }
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
      update(id, { deletedAt: new Date() }).pipe(Effect.catchTag("UserErrorEmailAlreadyTaken", Effect.die))

    const readAll = (
      urlParams: URLParams<User>
    ): Effect.Effect<SuccessArray<User, never, never>> =>
      Effect.all({
        data: buildSelectQuery<User>(sql, "tbl_user", urlParams).pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((users) => Effect.all(users.map((user) => User.decodeUnknown(user)))),
          Effect.catchTag("ParseError", Effect.die)
        ),
        total: buildSelectCountQuery(sql, "tbl_user").pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.map((rows) => rows[0]?.countId ?? 0)
        )
      }).pipe(
        Effect.withSpan("UserDriven", {
          attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams }
        })
      )

    const readByAccessToken = (
      accessToken: AccessToken
    ): Effect.Effect<User, UserErrorNotFoundWithAccessToken, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at, deleted_at FROM tbl_user WHERE access_token = ${
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

    const readByAccessTokens = (
      accessTokens: Array<AccessToken>
    ): Effect.Effect<Array<User>, UserErrorNotFoundWithAccessToken, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at, deleted_at, access_token FROM tbl_user WHERE access_token IN ${
        sql.in(accessTokens.map((accessToken) => Redacted.value(accessToken)))
      }`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          Effect.all(
            accessTokens.map((accessToken) => {
              const row = rows.find((r) => r.accessToken === Redacted.value(accessToken))
              if (!row) {
                return Effect.fail(new UserErrorNotFoundWithAccessToken({ accessToken }))
              }
              return User.decodeUnknown(row).pipe(
                Effect.catchTag(
                  "ParseError",
                  (err) => Effect.die(`Failed to decode user with token ${accessToken}: ${err.message}`)
                )
              )
            })
          )
        ),
        Effect.withSpan("UserDriven", {
          attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByAccessTokens", accessTokens }
        })
      )

    const readById = (id: UserId): Effect.Effect<User, UserErrorNotFound, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at, deleted_at FROM tbl_user WHERE id = ${id}`.pipe(
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

    const readByIds = (ids: Array<UserId>): Effect.Effect<Array<User>, UserErrorNotFound, never> =>
      sql`SELECT id, owner_id, email, created_at, updated_at, deleted_at FROM tbl_user WHERE id IN ${sql.in(ids)}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          Effect.all(
            ids.map((id) => {
              const row = rows.find((r) => r.id === id)
              if (!row) {
                return Effect.fail(new UserErrorNotFound({ id }))
              }
              return User.decodeUnknown(row).pipe(
                Effect.catchTag(
                  "ParseError",
                  (err) => Effect.die(`Failed to decode user with id ${id}: ${err.message}`)
                )
              )
            })
          )
        ),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIds", ids } })
      )

    const readByIdWithSensitive = (id: UserId): Effect.Effect<UserWithSensitive> =>
      sql`SELECT id, owner_id, access_token, email, created_at, updated_at, deleted_at FROM tbl_user WHERE id = ${id}`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.flatMap(UserWithSensitive.decodeUnknown),
          Effect.catchTag("ParseError", Effect.die),
          Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive", id } })
        )

    const buildUpdateQuery = (id: UserId, user: Omit<User, "id">) =>
      user.deletedAt ?
        sql<{ id: string }>`UPDATE tbl_user SET ${
          sql.update({
            ...user,
            createdAt: formatDateTimeForSQL(user.createdAt),
            updatedAt: formatDateTimeForSQL(user.updatedAt),
            deletedAt: formatDateTimeForSQL(user.deletedAt)
          })
        } WHERE id = ${id} RETURNING id` :
        sql<{ id: string }>`UPDATE tbl_user SET ${
          sql.update({
            ...user,
            createdAt: formatDateTimeForSQL(user.createdAt),
            updatedAt: formatDateTimeForSQL(user.updatedAt),
            deletedAt: formatDateTimeForSQL(user.deletedAt)
          })
        }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: UserId,
      user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<UserId, UserErrorEmailAlreadyTaken | UserErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldUser) => buildUpdateQuery(id, { ...oldUser, ...user })),
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
      readByAccessTokens,
      readById,
      readByIds,
      readByIdWithSensitive,
      update
    } as const
  })
)
