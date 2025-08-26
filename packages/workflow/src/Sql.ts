import { SqliteClient } from "@effect/sql-sqlite-node"
import { String } from "effect"

export const SqlLayer = SqliteClient.layer({
  filename: "./db-workflow.sqlite",
  transformQueryNames: String.camelToSnake,
  transformResultNames: String.snakeToCamel
})
