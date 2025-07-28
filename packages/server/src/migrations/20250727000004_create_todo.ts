import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient
  yield* sql.onDialectOrElse({
    pg: () => sql`
      CREATE TABLE people (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL,
        text VARCHAR(255) NOT NULL,
        done BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (group_id) REFERENCES group(id)
      )
    `,
    orElse: () => sql`
      CREATE TABLE people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        done BOOLEAN,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (group_id) REFERENCES group(id)
      )
    `
  })
})
