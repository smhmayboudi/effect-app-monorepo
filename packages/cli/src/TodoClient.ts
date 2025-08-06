import { HttpApiClient } from "@effect/platform"
import { Api } from "@template/domain/Api"
import type { TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import { Effect } from "effect"

export class TodoClient extends Effect.Service<TodoClient>()("cli/TodoClient", {
  accessors: true,
  effect: Effect.gen(function*() {
    const client = yield* HttpApiClient.make(Api, {
      baseUrl: "http://localhost:3001"
    })

    const create = (text: string) =>
      client.todo.create({ payload: { text } }).pipe(
        Effect.flatMap((todo) => Effect.logInfo("Created todo: ", todo))
      )

    const del = (id: TodoId) =>
      client.todo.delete({ path: { id } }).pipe(
        Effect.flatMap(() => Effect.logInfo(`Deleted todo with id: ${id}`)),
        Effect.catchTag("TodoErrorNotFound", () => Effect.logError(`Failed to find todo with id: ${id}`))
      )

    const readAll = () =>
      client.todo.readAll().pipe(
        Effect.flatMap((todo) => Effect.logInfo(todo))
      )

    const readById = (id: TodoId) =>
      client.todo.readById({ path: { id } }).pipe(
        Effect.flatMap((todo) => Effect.logInfo(todo)),
        Effect.catchTag("TodoErrorNotFound", () => Effect.logError(`Failed to find todo with id: ${id}`))
      )

    const update = (id: TodoId) =>
      client.todo.update({ path: { id } }).pipe(
        Effect.flatMap((todo) => Effect.logInfo("Marked todo done: ", todo)),
        Effect.catchTag("TodoErrorNotFound", () => Effect.logError(`Failed to find todo with id: ${id}`))
      )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
}) {}
