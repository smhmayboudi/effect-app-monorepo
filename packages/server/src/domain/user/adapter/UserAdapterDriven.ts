import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
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

    const readById = (id: UserId) =>
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
    ) =>
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

    return UserPortDriven.of({
      create: (user) =>
        sql<
          { id: string }
        >`INSERT INTO tbl_user ${sql.insert({ ...user, accessToken: Redacted.value(user.accessToken) })} RETURNING id`
          .pipe(
            Effect.catchTag("SqlError", (error) =>
              String(error.cause).includes("UNIQUE constraint failed: tbl_user.email")
                ? Effect.fail(new UserErrorEmailAlreadyTaken({ email: user.email }))
                : Effect.die(error)),
            Effect.flatMap((rows) =>
              Effect.succeed(rows[0])
            ),
            Effect.map((row) => UserId.make(row.id)),
            Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", user } })
          ),
      delete: (id) =>
        update(id, { deletedAt: new Date() }).pipe(Effect.catchTag("UserErrorEmailAlreadyTaken", Effect.die)),
      readAll: (urlParams) =>
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
        ),
      readByAccessToken: (accessToken) =>
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
        ),
      readByAccessTokens: (accessTokens) =>
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
                return User.decodeUnknown(row)
              })
            )
          ),
          Effect.catchTag("ParseError", Effect.die),
          Effect.withSpan("UserDriven", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByAccessTokens", accessTokens }
          })
        ),
      readById,
      readByIds: (ids) =>
        sql`SELECT id, owner_id, email, created_at, updated_at, deleted_at FROM tbl_user WHERE id IN ${sql.in(ids)}`
          .pipe(
            Effect.catchTag("SqlError", Effect.die),
            Effect.flatMap((rows) =>
              Effect.all(
                ids.map((id) => {
                  const row = rows.find((r) => r.id === id)
                  if (!row) {
                    return Effect.fail(new UserErrorNotFound({ id }))
                  }
                  return User.decodeUnknown(row)
                })
              )
            ),
            Effect.catchTag("ParseError", Effect.die),
            Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIds", ids } })
          ),
      readByIdWithSensitive: (id) =>
        sql`SELECT id, owner_id, access_token, email, created_at, updated_at, deleted_at FROM tbl_user WHERE id = ${id}`
          .pipe(
            Effect.catchTag("SqlError", Effect.die),
            Effect.flatMap((rows) => Effect.succeed(rows[0])),
            Effect.flatMap(UserWithSensitive.decodeUnknown),
            Effect.catchTag("ParseError", Effect.die),
            Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive", id } })
          ),
      update
    })
  })
)
