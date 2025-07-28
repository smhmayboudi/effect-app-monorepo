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

    const create = (todo: Omit<DomainTodo, "id">): Effect.Effect<TodoId, ErrorTodoAlreadyExists, never> => {
      const id = TodoId.make(0)
      driven.create(DomainTodo.make({ id, ...todo }))
      return Effect.succeed(TodoId.make(id))
    }

    const del = (id: TodoId): Effect.Effect<TodoId, ErrorTodoNotFound, never> => {
      driven.delete(id)
      return Effect.succeed(id)
    }

    const readAll = (): Effect.Effect<DomainTodo[], never, never> => {
      return driven.readAll()
    }

    const readById = (id: TodoId): Effect.Effect<DomainTodo, ErrorTodoNotFound, never> => {
      return driven.readById(id)
    }

    const update = (id: TodoId, todo: Partial<Omit<DomainTodo, "id">>): Effect.Effect<TodoId, ErrorTodoNotFound, never> => {
      driven.update(id, todo)
      return Effect.succeed(id)
    }

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    }
  })
)
