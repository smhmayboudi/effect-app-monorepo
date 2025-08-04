import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
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
      >`INSERT INTO tbl_person ${sql.insert(person)} RETURNING id`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.map((row) => PersonId.make(row.id)),
          Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", person } })
        )

    const del = (id: PersonId): Effect.Effect<PersonId, ErrorPersonNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql<{ id: number }>`DELETE FROM tbl_person WHERE id = ${id} RETURNING id`),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => PersonId.make(row.id)),
        Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (): Effect.Effect<Array<DomainPerson>, never, never> =>
      sql`SELECT id, group_id, birthday, first_name, last_name, created_at, updated_at FROM tbl_person`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((persons) => Effect.all(persons.map((person) => DomainPerson.decodeUnknown(person)))),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } })
      )

    const readById = (id: PersonId): Effect.Effect<DomainPerson, ErrorPersonNotFound, never> =>
      sql`SELECT id, group_id, birthday, first_name, last_name, created_at, updated_at FROM tbl_person WHERE id = ${id}`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) =>
            rows.length === 0
              ? Effect.fail(new ErrorPersonNotFound({ id }))
              : Effect.succeed(rows[0])
          ),
          Effect.flatMap(DomainPerson.decodeUnknown),
          Effect.catchTag("ParseError", Effect.die),
          Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
        )

    const updateQuery = (
      id: PersonId,
      person: Omit<DomainPerson, "id" | "createdAt" | "updatedAt">
    ) =>
      sql<{ id: number }>`UPDATE tbl_person SET ${
        sql.update(person)
      }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: PersonId,
      person: Partial<Omit<DomainPerson, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<PersonId, ErrorPersonNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldPerson) =>
          updateQuery(id, {
            groupId: oldPerson.groupId,
            birthday: oldPerson.birthday,
            firstName: oldPerson.firstName,
            lastName: oldPerson.lastName,
            ...person
          })
        ),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => PersonId.make(row.id)),
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
