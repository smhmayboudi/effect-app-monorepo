import { Todo, TodoId, TodoNotFound } from "@template/domain/TodoApi"
import { Effect, HashMap, Ref } from "effect"

export class TodoRepository extends Effect.Service<TodoRepository>()("api/TodoRepository", {
  effect: Effect.gen(function*() {
    const todos = yield* Ref.make(HashMap.empty<TodoId, Todo>())

    const create = (text: string) =>
      Ref.modify(todos, (map) => {
        const id = TodoId.make(HashMap.reduce(map, -1, (max, todo) => todo.id > max ? todo.id : max) + 1)
        const todo = new Todo({ id, text, done: false })
        return [todo, HashMap.set(map, id, todo)]
      })

    const del = (id: TodoId) =>
      readById(id).pipe(
        Effect.flatMap((todo) => Ref.update(todos, HashMap.remove(todo.id)))
      )

    const readAll = () =>
      Ref.get(todos).pipe(
        Effect.map((todo) => Array.from(HashMap.values(todo)))
      )

    const readById = (id: TodoId) =>
      Ref.get(todos).pipe(
        Effect.flatMap(HashMap.get(id)),
        Effect.catchTag("NoSuchElementException", () => new TodoNotFound({ id }))
      )

    const update = (id: TodoId) =>
      readById(id).pipe(
        Effect.map((todo) => new Todo({ ...todo, done: true })),
        Effect.tap((todo) => Ref.update(todos, HashMap.set(todo.id, todo)))
      )

    return {
      create,
      del,
      readAll,
      readById,
      update
    } as const
  })
}) {}
