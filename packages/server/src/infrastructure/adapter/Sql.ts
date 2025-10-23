import * as SqliteClient from "@effect/sql-sqlite-node/SqliteClient"
import * as SqliteMigrator from "@effect/sql-sqlite-node/SqliteMigrator"
import * as SqlClient from "@effect/sql/SqlClient"
import * as effect from "effect"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as String from "effect/String"
import { fileURLToPath } from "url"
import { makeTestLayer } from "../../util/Layer.js"

const Client = (options: Config.Config.Wrap<SqliteClient.SqliteClientConfig>) =>
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

export const Sql = (options: Config.Config.Wrap<SqliteClient.SqliteClientConfig>) =>
  Migrator.pipe(Layer.provideMerge(Client(options)))

export const SqlTest = makeTestLayer(SqlClient.SqlClient)({
  withTransaction: effect.identity
})
