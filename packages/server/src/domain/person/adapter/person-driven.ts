import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { GroupId } from "@template/domain/group/application/domain-group"
import { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"
import { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { Effect, Layer } from "effect"
import { PortPersonDriven } from "../application/port-person-driven.js"

export const PersonDriven = Layer.effect(
  PortPersonDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (
      person: Omit<DomainPerson, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<PersonId, never, never> =>
      sql<
        { id: number }
      >`INSERT INTO tbl_person (group_id, birthday, first_name, last_name) VALUES (${person.groupId}, ${person.birthday}, ${person.firstName}, ${person.lastName}) RETURNING id`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.map((row) => PersonId.make(row.id)),
          Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", person } })
        )

    const del = (id: PersonId): Effect.Effect<void, ErrorPersonNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql`DELETE FROM tbl_person WHERE id = ${id}`),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die),
        Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (): Effect.Effect<Array<DomainPerson>, never, never> =>
      sql<{
        id: number
        group_id: number
        birthday: Date
        first_name: string
        last_name: string
        created_at: Date
        updated_at: Date
      }>`SELECT id, group_id, birthday, first_name, last_name, created_at, updated_at FROM tbl_person`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.map((rows) =>
          rows.map((row) =>
            new DomainPerson({
              id: PersonId.make(row.id),
              groupId: GroupId.make(row.group_id),
              birthday: new Date(row.birthday),
              firstName: row.first_name,
              lastName: row.last_name,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at)
            })
          )
        ),
        Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } })
      )

    const readById = (id: PersonId): Effect.Effect<DomainPerson, ErrorPersonNotFound, never> =>
      sql<{
        id: number
        group_id: number
        birthday: Date
        first_name: string
        last_name: string
        created_at: Date
        updated_at: Date
      }>`SELECT id, group_id, birthday, first_name, last_name, created_at, updated_at FROM tbl_person WHERE id = ${id}`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) =>
            rows.length === 0
              ? Effect.fail(new ErrorPersonNotFound({ id }))
              : Effect.succeed(rows[0])
          ),
          Effect.map((row) =>
            new DomainPerson({
              id: PersonId.make(row.id),
              groupId: GroupId.make(row.group_id),
              birthday: new Date(row.birthday),
              firstName: row.first_name,
              lastName: row.last_name,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at)
            })
          ),
          Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
        )

    const updateQuery = (
      id: PersonId,
      person: Omit<DomainPerson, "id" | "createdAt" | "updatedAt">
    ) =>
      sql`UPDATE tbl_person SET
          group_id = ${person.groupId},
          birthday = '${person.birthday}',
          first_name = '${person.firstName}',
          last_name = '${person.lastName}',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}`

    const update = (
      id: PersonId,
      person: Partial<Omit<DomainPerson, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<void, ErrorPersonNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldPerson) => updateQuery(id, { ...oldPerson, ...person })),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die),
        Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, person } })
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
