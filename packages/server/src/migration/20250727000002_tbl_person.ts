import * as SqlClient from "@effect/sql/SqlClient"
import * as Effect from "effect/Effect"

export default SqlClient.SqlClient.pipe(
  Effect.flatMap((sql) =>
    sql.onDialectOrElse({
      pg: () =>
        sql`CREATE TABLE tbl_person (
            id UUID PRIMARY KEY,
            group_id UUID NOT NULL,
            birthday DATE NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            deleted_at TIMESTAMP NULL,
            FOREIGN KEY (group_id) REFERENCES tbl_group(id) ON DELETE RESTRICT
          )`,
      orElse: () =>
        sql`CREATE TABLE tbl_person (
            id UUID PRIMARY KEY,
            group_id TEXT NOT NULL,
            birthday DATE NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            deleted_at DATETIME NULL,
            FOREIGN KEY (group_id) REFERENCES tbl_group(id)
          )`
    })
  )
)
