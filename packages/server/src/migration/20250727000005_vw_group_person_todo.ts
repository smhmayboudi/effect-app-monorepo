import * as SqlClient from "@effect/sql/SqlClient"
import * as Effect from "effect/Effect"

export default SqlClient.SqlClient.pipe(
  Effect.flatMap((sql) =>
    sql`CREATE VIEW vw_group_person_todo AS
    SELECT 
      g.id as group_id,
      g.owner_id as group_owner_id,
      g.name as group_name,
      g.created_at as group_created_at,
      g.updated_at as group_updated_at,
      p.id as person_id,
      p.group_id as person_group_id,
      p.birthday as person_birthday,
      p.first_name as person_first_name,
      p.last_name as person_last_name,
      p.created_at as person_created_at,
      p.updated_at as person_updated_at,
      t.id as todo_id,
      t.owner_id as todo_owner_id,
      t.done as todo_done,
      t.text as todo_text,
      t.created_at as todo_created_at,
      t.updated_at as todo_updated_at
    FROM tbl_group g
    JOIN tbl_person p ON g.id = p.group_id
    JOIN tbl_todo t ON g.owner_id = t.owner_id
    WHERE g.deleted_at IS NULL AND p.deleted_at IS NULL AND t.deleted_at IS NULL`
  )
)
