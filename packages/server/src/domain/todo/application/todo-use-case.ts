import { Effect, Layer } from "effect";
import { PortTodoDriving } from "./port-todo-driving.js";
import { PortTodoDriven } from "./port-todo-driven.js";
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"

export const TodoUseCase = Layer.effect(
  PortTodoDriving,
  Effect.gen(function* () {
    const driven = yield* PortTodoDriven

    const create = (todo: Omit<DomainTodo, "id">): Effect.Effect<TodoId, ErrorTodoAlreadyExists, never> => 
      driven.create(todo)

    const del = (id: TodoId): Effect.Effect<TodoId, ErrorTodoNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.delete(id)

        return id
      })

    const readAll = (): Effect.Effect<DomainTodo[], never, never> =>
      driven.readAll()

    const readById = (id: TodoId): Effect.Effect<DomainTodo, ErrorTodoNotFound, never> =>
      driven.readById(id)

    const update = (id: TodoId, todo: Partial<Omit<DomainTodo, "id">>): Effect.Effect<TodoId, ErrorTodoNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.update(id, todo)

        return id
      })

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
