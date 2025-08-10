import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Effect, Layer } from "effect"
import { buildSelectCountQuery, buildSelectQuery } from "../../../shared/adapter/URLParams.js"
import { PersonPortDriven } from "../application/PersonApplicationPortDriven.js"

export const PersonDriven = Layer.effect(
  PersonPortDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (
      person: Omit<Person, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<PersonId, never, never> =>
      sql<
        { id: number }
      >`INSERT INTO tbl_person ${
        sql.insert({ ...person, birthday: person.birthday.toISOString().slice(0, 10) })
      } RETURNING id`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.map((row) => PersonId.make(row.id)),
          Effect.withSpan("PersonDriven", {
            attributes: {
              [ATTR_CODE_FUNCTION_NAME]: "create",
              person: { ...person, birthday: person.birthday.toISOString().slice(0, 10) }
            }
          })
        )

    const del = (id: PersonId): Effect.Effect<PersonId, PersonErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql<{ id: number }>`DELETE FROM tbl_person WHERE id = ${id} RETURNING id`),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => PersonId.make(row.id)),
        Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (
      urlParams: URLParams<Person>
    ): Effect.Effect<SuccessArray<Person, never, never>, never, never> =>
      Effect.all({
        data: buildSelectQuery<Person>(sql, "tbl_person", urlParams).pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((persons) => Effect.all(persons.map((person) => Person.decodeUnknown(person)))),
          Effect.catchTag("ParseError", Effect.die)
        ),
        total: buildSelectCountQuery(sql, "tbl_person").pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.map((rows) => rows[0]?.countId ?? 0)
        )
      }).pipe(
        Effect.withSpan("PersonDriven", {
          attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams }
        })
      )

    const readById = (id: PersonId): Effect.Effect<Person, PersonErrorNotFound, never> =>
      sql`SELECT id, group_id, birthday, first_name, last_name, created_at, updated_at FROM tbl_person WHERE id = ${id}`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) =>
            rows.length === 0
              ? Effect.fail(new PersonErrorNotFound({ id }))
              : Effect.succeed(rows[0])
          ),
          Effect.flatMap(Person.decodeUnknown),
          Effect.catchTag("ParseError", Effect.die),
          Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
        )

    const updateQuery = (
      id: PersonId,
      person: Omit<Person, "id" | "createdAt" | "updatedAt">
    ) =>
      sql<{ id: number }>`UPDATE tbl_person SET ${
        sql.update({ ...person, birthday: person.birthday.toISOString().slice(0, 10) })
      }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: PersonId,
      person: Partial<Omit<Person, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<PersonId, PersonErrorNotFound, never> =>
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
        Effect.withSpan("PersonDriven", {
          attributes: {
            [ATTR_CODE_FUNCTION_NAME]: "update",
            id,
            person: { ...person, birthday: person.birthday?.toISOString().slice(0, 10) }
          }
        })
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
