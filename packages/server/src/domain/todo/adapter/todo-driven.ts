import { Effect, Layer } from "effect"
import { PortTodoDriven } from "../application/port-todo-driven.js"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"
import { AccountId } from "@template/domain/account/application/domain-account"
import { SqlClient } from "@effect/sql"
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"

export const TodoDriven = Layer.effect(
  PortTodoDriven,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient

    const create = (todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">): Effect.Effect<TodoId, ErrorTodoAlreadyExists, never> =>
      sql<{ id: number }>`
        INSERT INTO tbl_todo (owner_id, done, text) VALUES (${todo.ownerId}, ${todo.done}, ${todo.text}) RETURNING id
      `.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) => Effect.succeed(rows[0])),
        Effect.map((row) => TodoId.make(row.id))
      )

    const del = (id: TodoId): Effect.Effect<void, ErrorTodoNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap(() => sql`DELETE FROM tbl_todo WHERE id = ${id}`),
        sql.withTransaction,
        Effect.catchTag("SqlError", Effect.die)
      )

    const readAll = (): Effect.Effect<DomainTodo[], never, never> =>
      sql<{
        id: number
        owner_id: number
        done: boolean
        text: string
        created_at: Date
        updated_at: Date
      }>`
        SELECT id, owner_id, done, text, created_at, updated_at FROM tbl_todo
      `.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.map((rows) =>
          rows.map((row) =>
            DomainTodo.make({
              id: TodoId.make(row.id),
              ownerId: AccountId.make(row.owner_id),
              done: row.done,
              text: row.text,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at)
            })
          )
        )
      )

    const readById = (id: TodoId): Effect.Effect<DomainTodo, ErrorTodoNotFound, never> =>
      sql<{
        id: number
        owner_id: number
        done: boolean
        text: string
        created_at: Date
        updated_at: Date
      }>`
        SELECT id, owner_id, done, text, created_at, updated_at FROM tbl_todo WHERE id = ${id}
      `.pipe(
        Effect.catchTag("SqlError", Effect.die),
        Effect.flatMap((rows) =>
          rows.length === 0
            ? Effect.fail(new ErrorTodoNotFound({ id }))
            : Effect.succeed(rows[0])
        ),
        Effect.map((row) =>
          DomainTodo.make({
            id: TodoId.make(row.id),
            ownerId: AccountId.make(row.owner_id),
            done: row.done,
            text: row.text,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })
        )
      )

    const updateQuery = (
      id: TodoId,
      todo: Omit<DomainTodo, "id">
    ) => sql`
        UPDATE tbl_todo SET
          owner_id = ${todo.ownerId},
          done = '${todo.done}',
          text = '${todo.text}',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `

    const update = (
      id: TodoId,
      todo: Partial<Omit<DomainTodo, "id">>
    ): Effect.Effect<void, ErrorTodoNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((oldTodo) => updateQuery(id, { ...oldTodo, ...todo })),
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
