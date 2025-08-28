import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default SqlClient.SqlClient.pipe(
  Effect.flatMap((sql) =>
    Effect.sync(() =>
      sql.onDialectOrElse({
        pg: () =>
          Effect.all([
            sql`CREATE TABLE tbl_user (
              id UUID PRIMARY KEY,
              owner_id UUID NOT NULL,
              access_token VARCHAR(255) UNIQUE NOT NULL,
              email TEXT UNIQUE NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
              deleted_at TIMESTAMP NULL,
              FOREIGN KEY (owner_id) REFERENCES tbl_account(id) ON DELETE RESTRICT
            )`,
            sql`CREATE UNIQUE INDEX idx_tbl_user_access_token_active ON tbl_user(access_token) WHERE deleted_at IS NULL;`,
            sql`CREATE UNIQUE INDEX idx_tbl_user_email_active ON tbl_user(email) WHERE deleted_at IS NULL;`
          ]),
        orElse: () =>
          Effect.all([
            sql`CREATE TABLE tbl_user (
              id UUID PRIMARY KEY,
              owner_id UUID NOT NULL,
              access_token VARCHAR(255) UNIQUE NOT NULL,
              email TEXT UNIQUE NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
              deleted_at DATETIME NULL,
              FOREIGN KEY (owner_id) REFERENCES tbl_account(id)
            );`,
            sql`CREATE UNIQUE INDEX idx_tbl_user_access_token_active ON tbl_user(access_token) WHERE deleted_at IS NULL`,
            sql`CREATE UNIQUE INDEX idx_tbl_user_email_active ON tbl_user(email) WHERE deleted_at IS NULL;`
          ])
      })
    )
  )
)
