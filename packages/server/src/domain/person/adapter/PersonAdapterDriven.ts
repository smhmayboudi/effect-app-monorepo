import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import { Effect, Layer } from "effect"
import { buildSelectCountQuery, buildSelectQuery } from "../../../shared/adapter/URLParams.js"
import { formatDateForSQL, formatDateTimeForSQL } from "../../../util/Date.js"
import { PersonPortDriven } from "../application/PersonApplicationPortDriven.js"

export const PersonDriven = Layer.effect(
  PersonPortDriven,
  SqlClient.SqlClient.pipe(
    Effect.flatMap((sql) =>
      Effect.sync(() => {
        const readById = (id: PersonId) =>
          sql`SELECT id, group_id, birthday, first_name, last_name, created_at, updated_at, deleted_at FROM tbl_person WHERE id = ${id}`
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

        const buildUpdateQuery = (id: PersonId, person: Omit<Person, "id">) =>
          person.deletedAt ?
            sql<{ id: string }>`UPDATE tbl_person SET ${
              sql.update({
                ...person,
                birthday: formatDateForSQL(person.birthday),
                createdAt: formatDateTimeForSQL(person.createdAt),
                updatedAt: formatDateTimeForSQL(person.updatedAt),
                deletedAt: formatDateTimeForSQL(person.deletedAt)
              })
            } WHERE id = ${id} RETURNING id` :
            sql<{ id: string }>`UPDATE tbl_person SET ${
              sql.update({
                ...person,
                birthday: formatDateForSQL(person.birthday),
                createdAt: formatDateTimeForSQL(person.createdAt),
                updatedAt: formatDateTimeForSQL(person.updatedAt),
                deletedAt: formatDateTimeForSQL(person.deletedAt)
              })
            } , updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

        const update = (
          id: PersonId,
          person: Partial<Omit<Person, "id" | "createdAt" | "updatedAt">>
        ) =>
          readById(id).pipe(
            Effect.flatMap((oldPerson) => buildUpdateQuery(id, { ...oldPerson, ...person })),
            Effect.catchTag("SqlError", Effect.die),
            Effect.flatMap((rows) => Effect.succeed(rows[0])),
            Effect.map((row) => PersonId.make(row.id)),
            Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, person } })
          )

        return PersonPortDriven.of({
          create: (person) =>
            sql<
              { id: string }
            >`INSERT INTO tbl_person ${
              sql.insert({ ...person, birthday: person.birthday.toISOString().slice(0, 10) })
            } RETURNING id`.pipe(
              Effect.catchTag("SqlError", Effect.die),
              Effect.flatMap((rows) => Effect.succeed(rows[0])),
              Effect.map((row) => PersonId.make(row.id)),
              Effect.withSpan("PersonDriven", {
                attributes: {
                  [ATTR_CODE_FUNCTION_NAME]: "create",
                  person: { ...person, birthday: person.birthday.toISOString().slice(0, 10) }
                }
              })
            ),
          delete: (id) => update(id, { deletedAt: new Date() }),
          readAll: (urlParams) =>
            Effect.all({
              data: buildSelectQuery<Person>(sql, "tbl_person", urlParams).pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.flatMap((persons) => Effect.all(persons.map((person) => Person.decodeUnknown(person)))),
                Effect.catchTag("ParseError", Effect.die)
              ),
              total: buildSelectCountQuery(sql, "tbl_person", urlParams).pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.map((rows) => rows[0]?.countId ?? 0)
              )
            }).pipe(
              Effect.withSpan("PersonDriven", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams }
              })
            ),
          readById,
          readByIds: (ids) =>
            sql`SELECT id, group_id, birthday, first_name, last_name, created_at, updated_at, deleted_at FROM tbl_person WHERE id IN ${
              sql.in(ids)
            }`.pipe(
              Effect.catchTag("SqlError", Effect.die),
              Effect.flatMap((rows) =>
                Effect.all(
                  ids.map((id) => {
                    const row = rows.find((r) => r.id === id)
                    if (!row) {
                      return Effect.fail(new PersonErrorNotFound({ id }))
                    }
                    return Person.decodeUnknown(row)
                  })
                )
              ),
              Effect.catchTag("ParseError", Effect.die),
              Effect.withSpan("PersonDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIds", ids } })
            ),
          update
        })
      })
    )
  )
)
