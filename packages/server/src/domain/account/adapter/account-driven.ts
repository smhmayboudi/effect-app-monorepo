import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { AccountId, DomainAccount } from "@template/domain/account/application/domain-account"
import { ErrorAccountNotFound } from "@template/domain/account/application/error-account-not-found"
import { PortAccountDriven } from "@template/server/domain/account/application/port-account-driven"
import { Effect, Layer } from "effect"

export const AccountDriven = Layer.effect(
  PortAccountDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (
      account: Omit<DomainAccount, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<AccountId, never, never> =>
      sql<{ id: number }>`INSERT INTO tbl_account DEFAULT VALUES RETURNING id`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => AccountId.make(row.id)),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", account } })
      )

    const del = (id: AccountId): Effect.Effect<void, ErrorAccountNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql`DELETE FROM tbl_account WHERE id = ${id}`),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (): Effect.Effect<Array<DomainAccount>, never, never> =>
      sql<{
        id: number
        created_at: Date
        updated_at: Date
      }>`SELECT id, created_at, updated_at FROM tbl_account`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.map((rows) =>
          rows.map((row) =>
            DomainAccount.make({
              id: AccountId.make(row.id),
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at)
            })
          )
        ),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } })
      )

    const readById = (id: AccountId): Effect.Effect<DomainAccount, ErrorAccountNotFound, never> =>
      sql<{
        id: number
        created_at: Date
        updated_at: Date
      }>`SELECT id, created_at, updated_at FROM tbl_account WHERE id = ${id}`.pipe(
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
        ),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
      )

    const buildUpdateQuery = (
      id: AccountId,
      _account: Omit<DomainAccount, "id">
    ) =>
      sql`UPDATE tbl_user SET
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}`

    const update = (
      id: AccountId,
      account: Partial<Omit<DomainAccount, "id">>
    ): Effect.Effect<void, ErrorAccountNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldAccount) => buildUpdateQuery(id, { ...oldAccount, ...account })),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, account } })
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
