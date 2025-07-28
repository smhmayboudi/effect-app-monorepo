import { NodeContext } from "@effect/platform-node"
import { SqlClient } from "@effect/sql"
import { SqliteClient, SqliteMigrator } from "@effect/sql-sqlite-node"
import { identity, Layer } from "effect"
import { fileURLToPath } from "url"
import { makeTestLayer } from "../../util/Layer.js"

const Client = SqliteClient.layer({
  filename: "data/db.sqlite"
})

const Migrator = SqliteMigrator.layer({
  loader: SqliteMigrator.fromFileSystem(
    fileURLToPath(new URL("./migrations", import.meta.url))
  )
}).pipe(Layer.provide(NodeContext.layer))

export const Sql = Migrator.pipe(Layer.provideMerge(Client))

export const SqlTest = makeTestLayer(SqlClient.SqlClient)({
  withTransaction: identity
})
