import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default SqlClient.SqlClient.pipe(
  Effect.flatMap((sql) =>
    Effect.sync(() =>
      sql`CREATE VIEW vw_user_todo AS
    SELECT 
      u.id as user_id,
      u.owner_id as user_owner_id,
      u.email as user_email,
      u.created_at as user_created_at,
      u.updated_at as user_updated_at,
      t.id as todo_id,
      t.owner_id as todo_owner_id,
      t.done as todo_done,
      t.text as todo_text,
      t.created_at as todo_created_at,
      t.updated_at as todo_updated_at
    FROM tbl_user u
    JOIN tbl_todo t ON u.owner_id = t.owner_id
    WHERE u.deleted_at IS NULL AND t.deleted_at IS NULL`
    )
  )
)
