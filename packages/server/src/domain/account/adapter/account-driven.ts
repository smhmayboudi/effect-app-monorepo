import { Effect, Layer } from "effect"
import { PortAccountDriven } from "../application/port-account-driven.js"
import { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { DomainAccount, AccountId } from "@template/domain/account/application/domain-account"
import { SqlClient } from "@effect/sql"

export const AccountDriven = Layer.effect(
  PortAccountDriven,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient

    const create = (account: Omit<DomainAccount, "id">): Effect.Effect<AccountId, never, never> =>
      sql<{ id: number }>`
        INSERT INTO account () VALUES () RETURNING id
      `.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => AccountId.make(row.id))
      )

    const del = (id: AccountId): Effect.Effect<void, ErrorAccountNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql`DELETE FROM account WHERE id = ${id}`),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die)
      )

    const readAll = (): Effect.Effect<DomainAccount[], never, never> =>
      sql<{
        id: number
        created_at: Date
        updated_at: Date
      }>`
        SELECT id, created_at, updated_at FROM account
      `.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.map((rows) =>
          rows.map((row) =>
            DomainAccount.make({
              id: AccountId.make(row.id),
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at)
            })
          )
        )
      )

    const readById = (id: AccountId): Effect.Effect<DomainAccount, ErrorAccountNotFound, never> =>
      sql<{
        id: number
        created_at: Date
        updated_at: Date
      }>`
        SELECT id, created_at, updated_at FROM account WHERE id = ${id}
      `.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new ErrorAccountNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.map((row) =>
          DomainAccount.make({
            id: AccountId.make(row.id),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })
        )
      )

    const buildUpdateQuery = (
      id: AccountId,
      user: Omit<DomainAccount, "id">
    ) => sql`
        UPDATE user SET
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `
      
    const update = (id: AccountId, account: Partial<Omit<DomainAccount, "id">>): Effect.Effect<void, ErrorAccountNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldAccount) => buildUpdateQuery(id, { ...oldAccount, ...account })),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die)
      )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
