import { SqliteClient } from "@effect/sql-sqlite-node"
import type { SqliteClientConfig } from "@effect/sql-sqlite-node/SqliteClient"
import { Config, Effect, Layer, String } from "effect"

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

export const Sql = (options: Config.Config.Wrap<SqliteClientConfig>) => Client(options)
