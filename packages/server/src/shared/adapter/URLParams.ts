import type { SqlClient } from "@effect/sql"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"

export const buildSelectQuery = (sql: SqlClient.SqlClient, tableName: string, _urlParams: URLParams) =>
  sql`SELECT * FROM ${sql(tableName)}`
