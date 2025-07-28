import { Effect, Layer } from "effect";
import { PortTodoDriven } from "../application/port-todo-driven.js";
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"

export const TodoDriven = Layer.effect(
  PortTodoDriven,
  Effect.gen(function* () {
    const create = (todo: DomainTodo): Effect.Effect<void, ErrorTodoAlreadyExists, never> => {
      return Effect.void;
    }

    const del = (id: TodoId): Effect.Effect<void, ErrorTodoNotFound, never> => {
      return Effect.void;
    }

    const readAll = (): Effect.Effect<DomainTodo[], never, never> => {
      return Effect.succeed([DomainTodo.make({
        id: TodoId.make(0),
        done: false,
        text: ""
      })])
    }

    const readById = (id: TodoId): Effect.Effect<DomainTodo, ErrorTodoNotFound, never> => {
      return Effect.succeed(DomainTodo.make({
        id: TodoId.make(0),
        done: false,
        text: ""
      }))
    }

    const update = (id: TodoId, todo: Partial<Omit<DomainTodo, "id">>): Effect.Effect<void, ErrorTodoNotFound, never> => {
      return Effect.void;
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
