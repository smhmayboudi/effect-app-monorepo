import { Effect, Layer } from "effect"
import { PortGroupDriven } from "../application/port-group-driven.js"
import { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import { DomainGroup, GroupId } from "@template/domain/group/application/domain-group"
import { AccountId } from "@template/domain/account/application/domain-account"
import { SqlClient } from "@effect/sql"

export const GroupDriven = Layer.effect(
  PortGroupDriven,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient

    const create = (group: Omit<DomainGroup, "id" | "createdAt" | "updatedAt">): Effect.Effect<GroupId, never, never> =>
      sql<{ id: number }>`
        INSERT INTO tbl_group (owner_id, name) VALUES (${group.ownerId}, ${group.name}) RETURNING id
      `.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => GroupId.make(row.id))
      )

    const del = (id: GroupId): Effect.Effect<void, ErrorGroupNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql`DELETE FROM tbl_group WHERE id = ${id}`),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die)
      )

    const readAll = (): Effect.Effect<DomainGroup[], never, never> =>
      sql<{
        id: number
        owner_id: number
        name: string
        created_at: Date
        updated_at: Date
      }>`
        SELECT id, owner_id, name, created_at, updated_at FROM tbl_group
      `.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.map((rows) =>
          rows.map((row) =>
            DomainGroup.make({
              id: GroupId.make(row.id),
              ownerId: AccountId.make(row.owner_id),
              name: row.name,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at)
            })
          )
        )
      )

    const readById = (id: GroupId): Effect.Effect<DomainGroup, ErrorGroupNotFound, never> =>
      sql<{
        id: number
        owner_id: number
        name: string
        created_at: Date
        updated_at: Date
      }>`
        SELECT id, owner_id, name, created_at, updated_at FROM tbl_group WHERE id = ${id}
      `.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new ErrorGroupNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.map((row) =>
          DomainGroup.make({
            id: GroupId.make(row.id),
            ownerId: AccountId.make(row.owner_id),
            name: row.name,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })
        )
      )

    const updateQuery = (
      id: GroupId,
      group: Omit<DomainGroup, "id">
    ) => sql`
        UPDATE tbl_group SET
          owner_id = ${group.ownerId},
          name = ${group.name},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `

    const update = (
      id: GroupId,
      group: Partial<Omit<DomainGroup, "id">>
    ): Effect.Effect<void, ErrorGroupNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldGroup) => updateQuery(id, { ...oldGroup, ...group })),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die)
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
