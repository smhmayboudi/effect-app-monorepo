import { SqlClient } from "@effect/sql"
import { SqliteClient, SqliteMigrator } from "@effect/sql-sqlite-node"
import { Config, Effect, identity, Layer, String } from "effect"
import { fileURLToPath } from "url"
import { makeTestLayer } from "../../util/Layer.js"

const SqliteConfig = Config.nested(
  Config.all({
    filename: Config.string("FILENAME").pipe(
      Config.withDefault("./db.sqlite")
    )
  }),
  "CLIENT_SQLITE"
)

const Client = Layer.unwrapEffect(
  Config.unwrap(SqliteConfig).pipe(Effect.map((config) =>
    SqliteClient.layer({
      filename: config.filename,
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

export const Sql = Migrator.pipe(Layer.provideMerge(Client))

export const SqlTest = makeTestLayer(SqlClient.SqlClient)({
  withTransaction: identity
})
