import { SqlClient } from "@effect/sql"
import { SqliteClient, SqliteMigrator } from "@effect/sql-sqlite-node"
import type { SqliteClientConfig } from "@effect/sql-sqlite-node/SqliteClient"
import { Config, Effect, identity, Layer, String } from "effect"
import { fileURLToPath } from "url"
import { makeTestLayer } from "../../util/Layer.js"

const Client = (options: Config.Config.Wrap<SqliteClientConfig>) =>
  Layer.unwrapEffect(
    Config.unwrap(options).pipe(Effect.map((config) =>
      SqliteClient.layer({
        ...config,
        transformQueryNames: String.camelToSnake,
        transformResultNames: String.snakeToCamel
      })
    ))
  )

const Migrator = SqliteMigrator.layer({
  loader: SqliteMigrator.fromFileSystem(
    fileURLToPath(new URL("../../migration/", import.meta.url))
  ),
  table: "tbl_sql_migration"
})

export const Sql = (options: Config.Config.Wrap<SqliteClientConfig>) =>
  Migrator.pipe(Layer.provideMerge(Client(options)))

export const SqlTest = makeTestLayer(SqlClient.SqlClient)({
  withTransaction: identity
})
