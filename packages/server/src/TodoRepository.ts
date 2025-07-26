import { Todo, TodoErrorAlreadyExists, TodoErrorNotFound, TodoId } from "@template/domain/TodoApi"
import { Effect, HashMap, Ref } from "effect"

export class TodoRepository extends Effect.Service<TodoRepository>()("api/TodoRepository", {
  effect: Effect.gen(function*() {
    const todos = yield* Ref.make(HashMap.empty<TodoId, Todo>())

    // const create = (text: string) =>
    //   Effect.gen(function*() {
    //     const map = yield* Ref.get(todos)
    //     if (HashMap.some(map, (todo) => todo.text === text)) {
    //       return yield* Effect.fail(new TodoErrorAlreadyExists({ text }))
    //     }
    //     const id = TodoId.make(HashMap.reduce(map, -1, (max, todo) => Math.max(max, todo.id)) + 1)
    //     const todo = new Todo({ done: false, id, text })
    //     yield* Ref.update(todos, (map) => HashMap.set(map, id, todo))

    //     return todo
    //   })

    const create = (text: string) =>
      Ref.get(todos).pipe(
        Effect.flatMap((map) =>
          HashMap.some(map, (todo) => todo.text === text) ?
            Effect.fail(new TodoErrorAlreadyExists({ text })) :
            Effect.suspend(() => {
              const id = TodoId.make(HashMap.reduce(map, -1, (max, todo) => todo.id > max ? todo.id : max) + 1)
              const todo = new Todo({ done: false, id, text })

              return Ref.update(todos, (map) => HashMap.set(map, id, todo)).pipe(
                Effect.as(todo)
              )
            })
        )
      )

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
        Effect.catchTag("NoSuchElementException", () => new TodoErrorNotFound({ id }))
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
