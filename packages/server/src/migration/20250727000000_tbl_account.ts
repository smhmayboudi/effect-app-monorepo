import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default SqlClient.SqlClient.pipe(
  Effect.flatMap((sql) =>
    Effect.sync(() =>
      sql.onDialectOrElse({
        pg: () =>
          sql`CREATE TABLE tbl_account (
            id UUID PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            deleted_at TIMESTAMP NULL
          )`,
        orElse: () =>
          sql`CREATE TABLE tbl_account (
            id UUID PRIMARY KEY,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            deleted_at DATETIME NULL
          )`
      })
    )
  )
)
