import { Effect, Layer, Redacted } from "effect"
import { PortUserDriven } from "../application/port-user-driven.js"
import { ErrorUserNotFound } from "@template/domain/user/application/error-user-not-found"
import { AccessToken, DomainUser, DomainUserWithSensitive, Email, UserId } from "@template/domain/user/application/domain-user"
import { AccountId } from "@template/domain/account/application/domain-account"
import { SqlClient } from "@effect/sql"
import { ErrorUserEmailAlreadyTaken } from "@template/domain/user/application/error-user-email-already-taken"
import { ErrorUserNotFoundWithAccessToken } from "@template/domain/user/application/error-user-not-found-with-access-token"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const UserDriven = Layer.effect(
  PortUserDriven,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient

    const create = (user: Omit<DomainUser, "id" | "createdAt" | "updatedAt">): Effect.Effect<UserId, ErrorUserEmailAlreadyTaken, never> =>
      sql<{ id: number }>`INSERT INTO tbl_user (owner_id, email, access_token) VALUES (${user.ownerId}, ${user.email}, ${crypto.randomUUID()}) RETURNING id`.pipe(
        Effect.catchTag("SqlError", (error) =>
          String(error.cause).includes("UNIQUE constraint failed: user.email")
            ? Effect.fail(new ErrorUserEmailAlreadyTaken({ email: user.email }))
            : Effect.die(error)
        ),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => UserId.make(row.id)),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create" }})
      )

    const del = (id: UserId): Effect.Effect<void, ErrorUserNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql`DELETE FROM tbl_user WHERE id = ${id}`),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete" }})
      )

    const readAll = (): Effect.Effect<DomainUser[], never, never> =>
      sql<{
        id: number
        owner_id: number
        email: string
        created_at: Date
        updated_at: Date
      }>`SELECT id, owner_id, email, created_at, updated_at FROM tbl_user`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.map((rows) =>
          rows.map((row) =>
            DomainUser.make({
              id: UserId.make(row.id),
              ownerId: AccountId.make(row.owner_id),
              email: Email.make(row.email),
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at)
            })
          )
        ),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }})
      )

    const readByAccessToken = (accessToken: AccessToken): Effect.Effect<DomainUser, ErrorUserNotFoundWithAccessToken, never> =>
      sql<{
        id: number
        owner_id: number
        email: string
        created_at: Date
        updated_at: Date
      }>`SELECT id, owner_id, email, created_at, updated_at FROM tbl_user WHERE access_token = ${Redacted.value(accessToken)}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new ErrorUserNotFoundWithAccessToken({ accessToken }))
            : Effect.succeed(rows[0])
        ),
        Effect.map((row) =>
          DomainUser.make({
            id: UserId.make(row.id),
            ownerId: AccountId.make(row.owner_id),
            email: Email.make(row.email),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })
        ),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByAccessToken" }})
      )

    const readById = (id: UserId): Effect.Effect<DomainUser, ErrorUserNotFound, never> =>
      sql<{
        id: number
        owner_id: number
        email: string
        created_at: Date
        updated_at: Date
      }>`SELECT id, owner_id, email, created_at, updated_at FROM tbl_user WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new ErrorUserNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.map((row) =>
          DomainUser.make({
            id: UserId.make(row.id),
            ownerId: AccountId.make(row.owner_id),
            email: Email.make(row.email),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })
        ),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById" }})
      )

    const readByIdWithSensitive = (id: UserId): Effect.Effect<DomainUserWithSensitive, never, never> =>
      sql<{
        id: number
        owner_id: number
        access_token: string
        email: string
        created_at: Date
        updated_at: Date
      }>`SELECT id, owner_id, access_token, email, created_at, updated_at FROM tbl_user WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) =>
          DomainUserWithSensitive.make({
            id: UserId.make(row.id),
            ownerId: AccountId.make(row.owner_id),
            accessToken: AccessToken.make(Redacted.make(row.access_token)),
            // account: DomainAccount.make({}),
            email: Email.make(row.email),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })
        ),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive" }})
      )

    const buildUpdateQuery = (
      id: UserId,
      user: Omit<DomainUser, "id">
    ) => sql`UPDATE tbl_user SET
          owner_id = ${user.ownerId},
          email = ${user.email},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}`

    const update = (
      id: UserId,
      user: Partial<Omit<DomainUser, "id">>
    ): Effect.Effect<void, ErrorUserEmailAlreadyTaken | ErrorUserNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldUser) => buildUpdateQuery(id, { ...oldUser, ...user })),
        sql.withTransaction,
        Effect.catchTag("SqlError", (error) =>
          String(error.cause).includes("UNIQUE constraint failed: user.email")
            ? Effect.fail(new ErrorUserEmailAlreadyTaken({ email: user.email! }))
            : Effect.die(error)
        ),
        Effect.withSpan("UserDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update" }})
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
