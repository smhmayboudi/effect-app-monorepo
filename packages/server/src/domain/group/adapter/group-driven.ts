import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { Effect, Layer } from "effect"
import { PortGroupDriven } from "../application/port-group-driven.js"

export const GroupDriven = Layer.effect(
  PortGroupDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (group: Omit<DomainGroup, "id" | "createdAt" | "updatedAt">): Effect.Effect<GroupId, never, never> =>
      sql<{ id: number }>`INSERT INTO tbl_group ${sql.insert(group)} RETURNING id`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.map((row) => GroupId.make(row.id)),
          Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", group } })
        )

    const del = (id: GroupId): Effect.Effect<GroupId, ErrorGroupNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql<{ id: number }>`DELETE FROM tbl_group WHERE id = ${id} RETURNING id`),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => GroupId.make(row.id)),
        Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (): Effect.Effect<Array<DomainGroup>, never, never> =>
      sql`SELECT id, owner_id, name, created_at, updated_at FROM tbl_group`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((groups) => Effect.all(groups.map((group) => DomainGroup.decodeUnknown(group)))),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } })
      )

    const readById = (id: GroupId): Effect.Effect<DomainGroup, ErrorGroupNotFound, never> =>
      sql`SELECT id, owner_id, name, created_at, updated_at FROM tbl_group WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new ErrorGroupNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.flatMap(DomainGroup.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
      )

    const updateQuery = (
      id: GroupId,
      group: Omit<DomainGroup, "id" | "createdAt" | "updatedAt">
    ) =>
      sql<{ id: number }>`UPDATE tbl_group SET ${
        sql.update(group)
      }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: GroupId,
      group: Partial<Omit<DomainGroup, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<GroupId, ErrorGroupNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldGroup) => updateQuery(id, { ...oldGroup, ...group })),
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
