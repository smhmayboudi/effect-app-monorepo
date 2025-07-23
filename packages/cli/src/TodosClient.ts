import { HttpApiClient } from "@effect/platform"
import type { TodoId } from "@template/domain/TodosApi"
import { TodosApi } from "@template/domain/TodosApi"
import { Effect } from "effect"

export class TodosClient extends Effect.Service<TodosClient>()("cli/TodosClient", {
  accessors: true,
  effect: Effect.gen(function*() {
    const client = yield* HttpApiClient.make(TodosApi, {
      baseUrl: "http://localhost:3000"
    })

    const create = (text: string) =>
      client.todos.create({ payload: { text } }).pipe(
        Effect.flatMap((todo) => Effect.logInfo("Created todo: ", todo))
      )

    const del = (id: TodoId) =>
      client.todos.delete({ path: { id } }).pipe(
        Effect.flatMap(() => Effect.logInfo(`Deleted todo with id: ${id}`)),
        Effect.catchTag("TodoNotFound", () => Effect.logError(`Failed to find todo with id: ${id}`))
      )

    const readAll = () =>
      client.todos.readAll().pipe(
        Effect.flatMap((todos) => Effect.logInfo(todos))
      )

    const readById = (id: TodoId) =>
      client.todos.readById({ path: { id } }).pipe(
        Effect.flatMap((todo) => Effect.logInfo(todo)),
        Effect.catchTag("TodoNotFound", () => Effect.logError(`Failed to find todo with id: ${id}`))
      )

    const update = (id: TodoId) =>
      client.todos.update({ path: { id } }).pipe(
        Effect.flatMap((todo) => Effect.logInfo("Marked todo done: ", todo)),
        Effect.catchTag("TodoNotFound", () => Effect.logError(`Failed to find todo with id: ${id}`))
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
