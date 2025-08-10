import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Effect, Layer } from "effect"
import { buildSelectQuery } from "../../../shared/adapter/URLParams.js"
import { AccountPortDriven } from "../application/AccountApplicationPortDriven.js"

export const AccountDriven = Layer.effect(
  AccountPortDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (
      account: Omit<Account, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<AccountId, never, never> =>
      sql<{ id: number }>`INSERT INTO tbl_account DEFAULT VALUES RETURNING id`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => AccountId.make(row.id)),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", account } })
      )

    const del = (id: AccountId): Effect.Effect<AccountId, AccountErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql<{ id: number }>`DELETE FROM tbl_account WHERE id = ${id} RETURNING id`),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => AccountId.make(row.id)),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (urlParams: URLParams<Account>): Effect.Effect<Array<Account>, never, never> =>
      buildSelectQuery<Account>(sql, "tbl_account", urlParams).pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((accounts) => Effect.all(accounts.map((account) => Account.decodeUnknown(account)))),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } })
      )

    const readById = (id: AccountId): Effect.Effect<Account, AccountErrorNotFound, never> =>
      sql`SELECT id, created_at, updated_at FROM tbl_account WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new AccountErrorNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.flatMap(Account.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
      )

    const buildUpdateQuery = (
      id: AccountId,
      _account: Omit<Account, "id" | "createdAt" | "updatedAt">
    ) => sql<{ id: number }>`UPDATE tbl_user SET updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: AccountId,
      account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<AccountId, AccountErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldAccount) => buildUpdateQuery(id, { ...oldAccount, ...account })),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => AccountId.make(row.id)),
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
