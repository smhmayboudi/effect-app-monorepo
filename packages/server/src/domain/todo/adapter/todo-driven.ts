import { Effect, HashMap, Layer, Ref } from "effect";
import { PortTodoDriven } from "../application/port-todo-driven.js";
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"

export const TodoDriven = Layer.effect(
  PortTodoDriven,
  Effect.gen(function* () {
    const todos = yield* Ref.make(HashMap.empty<TodoId, DomainTodo>())

    const create = (todo: Omit<DomainTodo, "id">): Effect.Effect<TodoId, ErrorTodoAlreadyExists, never> =>
      Ref.get(todos).pipe(
        Effect.flatMap((map) =>
          HashMap.some(map, (newTodo) => newTodo.text === todo.text) ?
            Effect.fail(new ErrorTodoAlreadyExists({ text: todo.text })) :
            Effect.suspend(() => {
              const id = TodoId.make(HashMap.reduce(map, -1, (max, todo) => todo.id > max ? todo.id : max) + 1)
              const newTodo = DomainTodo.make({ done: false, id, text: todo.text })

              return Ref.update(todos, (map) => HashMap.set(map, id, newTodo)).pipe(
                Effect.as(id)
              )
            })
        )
      )

    const del = (id: TodoId): Effect.Effect<void, ErrorTodoNotFound, never> =>
      readById(id).pipe(
        Effect.flatMap((todo) => Ref.update(todos, HashMap.remove(todo.id)))
      )

    const readAll = (): Effect.Effect<DomainTodo[], never, never> =>
      Ref.get(todos).pipe(
        Effect.map((todo) => Array.from(HashMap.values(todo)))
      )

    const readById = (id: TodoId): Effect.Effect<DomainTodo, ErrorTodoNotFound, never> =>
      Ref.get(todos).pipe(
        Effect.flatMap(HashMap.get(id)),
        Effect.catchTag("NoSuchElementException", () => new ErrorTodoNotFound({ id }))
      )

    const update = (id: TodoId, todo: Partial<Omit<DomainTodo, "id">>): Effect.Effect<void, ErrorTodoNotFound, never> =>
      readById(id).pipe(
        Effect.map((oldTodo) => DomainTodo.make({...oldTodo, ...todo})),
        Effect.tap((newTodo) => Ref.update(todos, HashMap.set(newTodo.id, newTodo)))
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
