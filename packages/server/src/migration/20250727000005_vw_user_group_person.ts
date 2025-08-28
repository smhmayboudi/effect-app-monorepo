import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default SqlClient.SqlClient.pipe(
  Effect.flatMap((sql) =>
    Effect.sync(() =>
      sql`CREATE VIEW vw_user_group_person AS
    SELECT 
      u.id as user_id,
      u.owner_id as user_owner_id,
      u.email as user_email,
      u.created_at as user_created_at,
      u.updated_at as user_updated_at,
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
      p.updated_at as person_updated_at
    FROM tbl_user u
    JOIN tbl_group g ON u.owner_id = u.owner_id
    JOIN tbl_person p ON g.id = p.group_id
    WHERE u.deleted_at IS NULL AND g.deleted_at IS NULL AND p.deleted_at IS NULL`
    )
  )
)
