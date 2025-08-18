import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient
  yield* sql.onDialectOrElse({
    pg: () =>
      sql`CREATE TABLE tbl_todo (
      id SERIAL PRIMARY KEY,
      owner_id INTEGER NOT NULL,
      done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
      text VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES tbl_account(id)
    )`,
    orElse: () =>
      sql`CREATE TABLE tbl_todo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES tbl_account(id)
    )`
  })
})
