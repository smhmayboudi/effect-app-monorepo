import * as SqliteClient from "@effect/sql-sqlite-node/SqliteClient"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as String from "effect/String"

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

export const Sql = (options: Config.Config.Wrap<SqliteClient.SqliteClientConfig>) => Client(options)
