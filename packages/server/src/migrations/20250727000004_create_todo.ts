import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient
  yield* sql.onDialectOrElse({
    pg: () => sql`
      CREATE TABLE todo (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL,
        done BOOLEAN,
        text VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES account(id)
      )
    `,
    orElse: () => sql`
      CREATE TABLE todo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        done BOOLEAN,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES account(id)
      )
    `
  })
})
