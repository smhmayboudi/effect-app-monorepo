import { Effect, Layer } from "effect"
import { PortTodoDriving } from "./port-todo-driving.js"
import { PortTodoDriven } from "./port-todo-driven.js"
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"

export const TodoUseCase = Layer.effect(
  PortTodoDriving,
  Effect.gen(function* () {
    const driven = yield* PortTodoDriven

    const create = (todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">): Effect.Effect<TodoId, ErrorTodoAlreadyExists, never> =>
      driven.create(todo)
        .pipe(Effect.withSpan("todo.use-case.create", { attributes: { todo } }))

    const del = (id: TodoId): Effect.Effect<TodoId, ErrorTodoNotFound, never> =>
      driven.delete(id)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("todo.use-case.delete", { attributes: { id } }))

    const readAll = (): Effect.Effect<DomainTodo[], never, never> =>
      driven.readAll().pipe(Effect.withSpan("todo.use-case.readAll"))

    const readById = (id: TodoId): Effect.Effect<DomainTodo, ErrorTodoNotFound, never> =>
      driven.readById(id).pipe(Effect.withSpan("todo.use-case.readById", { attributes: { id } }))

    const update = (id: TodoId, todo: Partial<Omit<DomainTodo, "id">>): Effect.Effect<TodoId, ErrorTodoNotFound, never> =>
      driven.update(id, todo)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("todo.use-case.update", { attributes: { id, todo } }))

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
