import type { SqlClient } from "@effect/sql"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"

export const buildSelectQuery = (sql: SqlClient.SqlClient, tableName: string, urlParams: URLParams) =>
  urlParams.limit !== undefined && urlParams.offset !== undefined ?
    urlParams.sort && 0 < urlParams.sort.length
      ? sql`SELECT * FROM ${sql(tableName)} ORDER BY ${
        sql.unsafe(urlParams.sort!.map((v) => `${v.by.toString()} ${v.sort}`).join(", "))
      } LIMIT ${sql.unsafe(urlParams.limit!.toString())} OFFSET ${sql.unsafe(urlParams.offset!.toString())}`
      : sql`SELECT * FROM ${sql(tableName)} ORDER BY id ASC LIMIT ${sql.unsafe(urlParams.limit!.toString())} OFFSET ${
        sql.unsafe(urlParams.offset!.toString())
      }`
    : urlParams.sort && 0 < urlParams.sort.length
    ? sql`SELECT * FROM ${sql(tableName)} ORDER BY ${
      sql.unsafe(urlParams.sort!.map((v) => `${v.by.toString()} ${v.sort}`).join(", "))
    }`
    : sql`SELECT * FROM ${sql(tableName)} ORDER BY id ASC`
