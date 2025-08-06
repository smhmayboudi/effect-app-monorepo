import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import { Effect, Layer } from "effect"
import { GroupPortDriven } from "../application/GroupApplicationPortDriven.js"

export const GroupDriven = Layer.effect(
  GroupPortDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (group: Omit<Group, "id" | "createdAt" | "updatedAt">): Effect.Effect<GroupId, never, never> =>
      sql<{ id: number }>`INSERT INTO tbl_group ${sql.insert(group)} RETURNING id`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.map((row) => GroupId.make(row.id)),
          Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", group } })
        )

    const del = (id: GroupId): Effect.Effect<GroupId, GroupErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql<{ id: number }>`DELETE FROM tbl_group WHERE id = ${id} RETURNING id`),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => GroupId.make(row.id)),
        Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (): Effect.Effect<Array<Group>, never, never> =>
      sql`SELECT id, owner_id, name, created_at, updated_at FROM tbl_group`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((groups) => Effect.all(groups.map((group) => Group.decodeUnknown(group)))),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } })
      )

    const readById = (id: GroupId): Effect.Effect<Group, GroupErrorNotFound, never> =>
      sql`SELECT id, owner_id, name, created_at, updated_at FROM tbl_group WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new GroupErrorNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.flatMap(Group.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
      )

    const updateQuery = (
      id: GroupId,
      group: Omit<Group, "id" | "createdAt" | "updatedAt">
    ) =>
      sql<{ id: number }>`UPDATE tbl_group SET ${
        sql.update(group)
      }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: GroupId,
      group: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<GroupId, GroupErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldGroup) => updateQuery(id, { ownerId: oldGroup.ownerId, name: oldGroup.name, ...group })),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => GroupId.make(row.id)),
        Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, group } })
      )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
