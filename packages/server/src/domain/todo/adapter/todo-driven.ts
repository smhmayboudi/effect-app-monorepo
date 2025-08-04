import { SqlClient } from "@effect/sql"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"
import type { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { Effect, Layer } from "effect"
import { PortTodoDriven } from "../application/port-todo-driven.js"

export const TodoDriven = Layer.effect(
  PortTodoDriven,
  Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const create = (
      todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<TodoId, ErrorTodoAlreadyExists, never> =>
      sql<
        { id: number }
      >`INSERT INTO tbl_todo ${sql.insert(todo)} RETURNING id`
        .pipe(
          Effect.catchTag("SqlError", Effect.die),
          Effect.flatMap((rows) => Effect.succeed(rows[0])),
          Effect.map((row) => TodoId.make(row.id)),
          Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", todo } })
        )

    const del = (id: TodoId): Effect.Effect<TodoId, ErrorTodoNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql<{ id: number }>`DELETE FROM tbl_todo WHERE id = ${id} RETURNING id`),
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => TodoId.make(row.id)),
        Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } })
      )

    const readAll = (): Effect.Effect<Array<DomainTodo>, never, never> =>
      sql`SELECT id, owner_id, done, text, created_at, updated_at FROM tbl_todo`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((todos) => Effect.all(todos.map((todo) => DomainTodo.decodeUnknown(todo)))),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } })
      )

    const readById = (id: TodoId): Effect.Effect<DomainTodo, ErrorTodoNotFound, never> =>
      sql`SELECT id, owner_id, done, text, created_at, updated_at FROM tbl_todo WHERE id = ${id}`.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new ErrorTodoNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.flatMap(DomainTodo.decodeUnknown),
        Effect.catchTag("ParseError", Effect.die),
        Effect.withSpan("TodoDriven", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } })
      )

    const updateQuery = (
      id: TodoId,
      todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">
    ) =>
      sql<{ id: number }>`UPDATE tbl_todo SET ${
        sql.update(todo)
      }, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING id`

    const update = (
      id: TodoId,
      todo: Partial<Omit<DomainTodo, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<TodoId, ErrorTodoNotFound, never> =>
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
      update
    } as const
  })
)
