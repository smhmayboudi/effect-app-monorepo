import { SqlClient } from "@effect/sql"
import { SqliteClient, SqliteMigrator } from "@effect/sql-sqlite-node"
import { makeTestLayer } from "@template/server/util/layer"
import { identity, Layer } from "effect"
import { fileURLToPath } from "url"

const Client = SqliteClient.layer({
  filename: "./db.sqlite"
})

const Migrator = SqliteMigrator.layer({
  loader: SqliteMigrator.fromFileSystem(
    fileURLToPath(new URL("../../migrations/", import.meta.url))
  ),
  table: "tbl_sql_migration"
})

export const Sql = Migrator.pipe(Layer.provideMerge(Client))

export const SqlTest = makeTestLayer(SqlClient.SqlClient)({
  withTransaction: identity
})
