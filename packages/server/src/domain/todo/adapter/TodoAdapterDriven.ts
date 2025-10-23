import * as SqlClient from "@effect/sql/SqlClient"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import { TodoErrorAlreadyExists } from "@template/domain/todo/application/TodoApplicationErrorAlreadyExists"
import { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { buildSelectCountQuery, buildSelectQuery } from "../../../shared/adapter/URLParams.js"
import { formatDateTimeForSQL } from "../../../util/Date.js"
import { TodoPortDriven } from "../application/TodoApplicationPortDriven.js"

export const TodoDriven = Layer.effect(
  TodoPortDriven,
  SqlClient.SqlClient.pipe(
    Effect.flatMap((sql) =>
      Effect.sync(() => {
        const readById = (id: TodoId) =>
          sql`SELECT id, owner_id, done, text, created_at, updated_at, deleted_at FROM tbl_todo WHERE id = ${id}`.pipe(
            Effect.catchTag("SqlError", Effect.die),
            Effect.flatMap((rows) =>
              rows.length === 0
                ? Effect.fail(new TodoErrorNotFound({ id }))
                : Effect.succeed(rows[0])
            ),
            Effect.flatMap(Todo.decodeUnknown),
            Effect.catchTag("ParseError", Effect.die),
            Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
          )

        const buildUpdateQuery = (id: TodoId, todo: Omit<Todo, "id">) =>
          todo.deletedAt ?
            sql<{ id: string }>`UPDATE tbl_todo SET ${
              sql.update({
                ...todo,
                createdAt: formatDateTimeForSQL(todo.createdAt),
                updatedAt: formatDateTimeForSQL(todo.updatedAt),
                deletedAt: formatDateTimeForSQL(todo.deletedAt)
              })
            } WHERE id = ${id} RETURNING id` :
            sql<{ id: string }>`UPDATE tbl_todo SET ${
              sql.update({
                ...todo,
                createdAt: formatDateTimeForSQL(todo.createdAt),
                updatedAt: formatDateTimeForSQL(todo.updatedAt),
                deletedAt: formatDateTimeForSQL(todo.deletedAt)
              })
            }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

        const update = (
          id: TodoId,
          todo: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">>
        ) =>
          readById(id).pipe(
            Effect.flatMap((oldTodo) => buildUpdateQuery(id, { ...oldTodo, ...todo })),
            Effect.catchTag("SqlError", (sqlError) =>
              (String(sqlError.cause).toLowerCase().includes("unique")) ?
                Effect.fail(new TodoErrorAlreadyExists({ text: todo.text ?? "" }))
                : Effect.die(sqlError)),
            Effect.flatMap((rows) => Effect.succeed(rows[0])),
            Effect.map((row) => TodoId.make(row.id)),
            Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, todo } })
          )

        return TodoPortDriven.of({
          create: (todo) =>
            sql<
              { id: string }
            >`INSERT INTO tbl_todo ${sql.insert(todo)} RETURNING id`.pipe(
              Effect.catchTag("SqlError", (sqlError) =>
                (String(sqlError.cause).toLowerCase().includes("unique")) ?
                  Effect.fail(new TodoErrorAlreadyExists({ text: todo.text }))
                  : Effect.die(sqlError)),
              Effect.flatMap((rows) => Effect.succeed(rows[0])),
              Effect.map((row) => TodoId.make(row.id)),
              Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", todo } })
            ),
          delete: (id) =>
            update(id, { deletedAt: new Date() }).pipe(Effect.catchTag("TodoErrorAlreadyExists", Effect.die)),
          readAll: (urlParams) =>
            Effect.all({
              data: buildSelectQuery<Todo>(sql, "tbl_todo", urlParams).pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.flatMap((todos) => Effect.all(todos.map((todo) => Todo.decodeUnknown(todo)))),
                Effect.catchTag("ParseError", Effect.die)
              ),
              total: buildSelectCountQuery(sql, "tbl_todo", urlParams).pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.map((rows) => rows[0]?.countId ?? 0)
              )
            }).pipe(
              Effect.withSpan("TodoDriven", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams }
              })
            ),
          readById,
          readByIds: (ids) =>
            sql`SELECT id, owner_id, done, text, created_at, updated_at, deleted_at FROM tbl_todo WHERE id IN ${
              sql.in(ids)
            }`
              .pipe(
                Effect.catchTag("SqlError", Effect.die),
                Effect.flatMap((rows) =>
                  Effect.all(
                    ids.map((id) => {
                      const row = rows.find((r) => r.id === id)
                      if (!row) {
                        return Effect.fail(new TodoErrorNotFound({ id }))
                      }
                      return Todo.decodeUnknown(row)
                    })
                  )
                ),
                Effect.catchTag("ParseError", Effect.die),
                Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIds", ids } })
              ),
          update
        })
      })
    )
  )
)
