import * as SqlClient from "@effect/sql/SqlClient"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { buildSelectCountQuery, buildSelectQuery } from "../../../shared/adapter/URLParams.js"
import { formatDateTimeForSQL } from "../../../util/Date.js"
import { GroupPortDriven } from "../application/GroupApplicationPortDriven.js"

export const GroupDriven = Layer.effect(
  GroupPortDriven,
  SqlClient.SqlClient.pipe(
    Effect.flatMap((sql) =>
      Effect.sync(() => {
        const readById = (id: GroupId) =>
          sql`SELECT id, owner_id, name, created_at, updated_at, deleted_at FROM tbl_group WHERE id = ${id}`.pipe(
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

        const buildUpdateQuery = (id: GroupId, group: Omit<Group, "id">) =>
          group.deletedAt ?
            sql<{ id: string }>`UPDATE tbl_group SET ${
              sql.update({
                ...group,
                createdAt: formatDateTimeForSQL(group.createdAt),
                updatedAt: formatDateTimeForSQL(group.updatedAt),
                deletedAt: formatDateTimeForSQL(group.deletedAt)
              })
            } WHERE id = ${id} RETURNING id` :
            sql<{ id: string }>`UPDATE tbl_group SET ${
              sql.update({
                ...group,
                createdAt: formatDateTimeForSQL(group.createdAt),
                updatedAt: formatDateTimeForSQL(group.updatedAt),
                deletedAt: formatDateTimeForSQL(group.deletedAt)
              })
            }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

        const update = (
          id: GroupId,
          group: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
        ) =>
          readById(id).pipe(
            Effect.flatMap((oldGroup) => buildUpdateQuery(id, { ...oldGroup, ...group })),
            Effect.catchTag("SqlError", Effect.die),
            Effect.flatMap((rows) => Effect.succeed(rows[0])),
            Effect.map((row) => GroupId.make(row.id)),
            Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, group } })
          )

        return GroupPortDriven.of({
          create: (group) =>
            sql<{ id: string }>`INSERT INTO tbl_group ${sql.insert(group)} RETURNING id`.pipe(
              Effect.catchTag("SqlError", Effect.die),
              Effect.flatMap((rows) => Effect.succeed(rows[0])),
              Effect.map((row) => GroupId.make(row.id)),
              Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", group } })
            ),
          delete: (id) => update(id, { deletedAt: new Date() }),
          readAll: (urlParams) =>
            Effect.all({
              data: buildSelectQuery<Group>(sql, "tbl_group", urlParams).pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.flatMap((groups) => Effect.all(groups.map((group) => Group.decodeUnknown(group)))),
                Effect.catchTag("ParseError", Effect.die)
              ),
              total: buildSelectCountQuery(sql, "tbl_group", urlParams).pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.map((rows) => rows[0]?.countId ?? 0)
              )
            }).pipe(
              Effect.withSpan("GroupDriven", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams }
              })
            ),
          readById,
          readByIds: (ids) =>
            sql`SELECT id, owner_id, name, created_at, updated_at, deleted_at FROM tbl_group WHERE id IN ${sql.in(ids)}`
              .pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.flatMap((rows) =>
                  Effect.all(
                    ids.map((id) => {
                      const row = rows.find((r) => r.id === id)
                      if (!row) {
                        return Effect.fail(new GroupErrorNotFound({ id }))
                      }
                      return Group.decodeUnknown(row)
                    })
                  )
                ),
                Effect.catchTag("ParseError", Effect.die),
                Effect.withSpan("GroupDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIds", ids } })
              ),
          update
        })
      })
    )
  )
)
