import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import type { TodoErrorAlreadyExists } from "@template/domain/todo/application/TodoApplicationErrorAlreadyExists"
import { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import { Effect, Layer } from "effect"
import { buildSelectCountQuery, buildSelectQuery } from "../../../shared/adapter/URLParams.js"
import { TodoPortDriven } from "../application/TodoApplicationPortDriven.js"

export const TodoDriven = Layer.effect(
  TodoPortDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (
      todo: Omit<Todo, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<TodoId, TodoErrorAlreadyExists, never> =>
      sql<
        { id: number }
      >`INSERT INTO tbl_todo ${sql.insert(todo)} RETURNING id`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => TodoId.make(row.id)),
        Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", todo } })
      )

    const del = (id: TodoId): Effect.Effect<TodoId, TodoErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql<{ id: number }>`DELETE FROM tbl_todo WHERE id = ${id} RETURNING id`),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => TodoId.make(row.id)),
        Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (
      urlParams: URLParams<Todo>
    ): Effect.Effect<SuccessArray<Todo, never, never>, never, never> =>
      Effect.all({
        data: buildSelectQuery<Todo>(sql, "tbl_todo", urlParams).pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((todos) => Effect.all(todos.map((todo) => Todo.decodeUnknown(todo)))),
          Effect.catchTag("ParseError", Effect.die)
        ),
        total: buildSelectCountQuery(sql, "tbl_todo").pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.map((rows) => rows[0]?.countId ?? 0)
        )
      }).pipe(
        Effect.withSpan("TodoDriven", {
          attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams }
        })
      )

    const readById = (id: TodoId): Effect.Effect<Todo, TodoErrorNotFound, never> =>
      sql`SELECT id, owner_id, done, text, created_at, updated_at FROM tbl_todo WHERE id = ${id}`.pipe(
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

    const readByIds = (ids: Array<TodoId>): Effect.Effect<Array<Todo>, TodoErrorNotFound, never> =>
      sql`SELECT id, owner_id, done, text, created_at, updated_at FROM tbl_todo WHERE id IN ${sql.in(ids)}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          Effect.all(
            ids.map((id) => {
              const row = rows.find((r) => r.id === id)
              if (!row) {
                return Effect.fail(new TodoErrorNotFound({ id }))
              }
              return Todo.decodeUnknown(row).pipe(
                Effect.catchTag(
                  "ParseError",
                  (err) => Effect.die(`Failed to decode user with id ${id}: ${err.message}`)
                )
              )
            })
          )
        ),
        Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIds", ids } })
      )

    const updateQuery = (
      id: TodoId,
      todo: Omit<Todo, "id" | "createdAt" | "updatedAt">
    ) =>
      sql<{ id: number }>`UPDATE tbl_todo SET ${
        sql.update(todo)
      }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: TodoId,
      todo: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<TodoId, TodoErrorNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldTodo) =>
          updateQuery(id, { ownerId: oldTodo.ownerId, done: oldTodo.done, text: oldTodo.text, ...todo })
        ),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => TodoId.make(row.id)),
        Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, todo } })
      )

    return {
      create,
      delete: del,
      readAll,
      readById,
      readByIds,
      update
    } as const
  })
)
