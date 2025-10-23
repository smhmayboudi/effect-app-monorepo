import * as SqlClient from "@effect/sql/SqlClient"
import * as Effect from "effect/Effect"

export default SqlClient.SqlClient.pipe(
  Effect.flatMap((sql) =>
    sql.onDialectOrElse({
      pg: () =>
        sql`CREATE TABLE tbl_group (
            id UUID PRIMARY KEY,
            owner_id UUID NOT NULL,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            deleted_at TIMESTAMP NULL
          )`,
      orElse: () =>
        sql`CREATE TABLE tbl_group (
            id UUID PRIMARY KEY,
            owner_id UUID NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            deleted_at DATETIME NULL
          )`
    })
  )
)
