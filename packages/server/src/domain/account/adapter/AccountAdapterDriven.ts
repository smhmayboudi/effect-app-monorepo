import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Account, AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { AccountErrorNotFound } from "@template/domain/account/application/AccountApplicationErrorNotFound"
import { Effect, Layer } from "effect"
import { buildSelectCountQuery, buildSelectQuery } from "../../../shared/adapter/URLParams.js"
import { formatDateTimeForSQL } from "../../../util/Date.js"
import { AccountPortDriven } from "../application/AccountApplicationPortDriven.js"

export const AccountDriven = Layer.effect(
  AccountPortDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const readById = (id: AccountId) =>
      sql`SELECT id, created_at, updated_at, deleted_at FROM tbl_account WHERE id = ${id}`.pipe(
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

    const buildUpdateQuery = (id: AccountId, account: Omit<Account, "id">) =>
      account.deletedAt ?
        sql<{ id: string }>`UPDATE tbl_account SET ${
          sql.update({
            ...account,
            createdAt: formatDateTimeForSQL(account.createdAt),
            updatedAt: formatDateTimeForSQL(account.updatedAt),
            deletedAt: formatDateTimeForSQL(account.deletedAt)
          })
        } WHERE id = ${id} RETURNING id` :
        sql<{ id: string }>`UPDATE tbl_account SET ${
          sql.update({
            ...account,
            createdAt: formatDateTimeForSQL(account.createdAt),
            updatedAt: formatDateTimeForSQL(account.updatedAt),
            deletedAt: formatDateTimeForSQL(account.deletedAt)
          })
        }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: AccountId,
      account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>
    ) =>
      readById(id).pipe(
        Effect.flatMap((oldAccount) => buildUpdateQuery(id, { ...oldAccount, ...account })),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => AccountId.make(row.id)),
        Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, account } })
      )

    return AccountPortDriven.of({
      create: (account) =>
        sql<{ id: string }>`INSERT INTO tbl_account ${sql.insert(account)} RETURNING id`.pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.map((row) => AccountId.make(row.id)),
          Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", account } })
        ),
      delete: (id) => update(id, { deletedAt: new Date() }),
      readAll: (urlParams) =>
        Effect.all({
          data: buildSelectQuery<Account>(sql, "tbl_account", urlParams).pipe(
            Effect.catchTag("SqlError", Effect.die),
            Effect.flatMap((accounts) => Effect.all(accounts.map((account) => Account.decodeUnknown(account)))),
            Effect.catchTag("ParseError", Effect.die)
          ),
          total: buildSelectCountQuery(sql, "tbl_account").pipe(
            Effect.catchTag("SqlError", Effect.die),
            Effect.map((rows) => rows[0]?.countId ?? 0)
          )
        }).pipe(
          Effect.withSpan("AccountDriven", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams }
          })
        ),
      readById,
      readByIds: (ids) =>
        sql`SELECT id, created_at, updated_at, deleted_at FROM tbl_account WHERE id IN ${sql.in(ids)}`.pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) =>
            Effect.all(
              ids.map((id) => {
                const row = rows.find((r) => r.id === id)
                if (!row) {
                  return Effect.fail(new AccountErrorNotFound({ id }))
                }
                return Account.decodeUnknown(row).pipe(
                  Effect.catchTag(
                    "ParseError",
                    (err) => Effect.die(`Failed to decode user with id ${id}: ${err.message}`)
                  )
                )
              })
            )
          ),
          Effect.withSpan("AccountDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIds", ids } })
        ),
      update
    })
  })
)
