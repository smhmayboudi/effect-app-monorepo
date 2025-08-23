import { HttpApiClient } from "@effect/platform"
import { Api } from "@template/domain/Api"
import type { TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import { Context, Effect, Layer } from "effect"

export class PortTodoClient extends Context.Tag("PortTodoClient")<PortTodoClient, {
  create: (text: string) => Effect.Effect<void, never, never>
  delete: (id: TodoId) => Effect.Effect<void, never, never>
  readAll: () => Effect.Effect<void, never, never>
  readById: (id: TodoId) => Effect.Effect<void, never, never>
  update: (id: TodoId) => Effect.Effect<void, never, never>
}>() {}

export const TodoClient = Layer.scoped(
  PortTodoClient,
  Effect.gen(function*() {
    const client = yield* HttpApiClient.make(Api, { baseUrl: "http://127.0.0.1:3001" })

    return PortTodoClient.of({
      create: (text) =>
        client.todo.create({ payload: { text } }).pipe(
          Effect.flatMap((todo) => Effect.logInfo("Created todo: ", todo)),
          Effect.catchAll(Effect.die)
        ),
      delete: (id) =>
        client.todo.delete({ path: { id } }).pipe(
          Effect.catchTag("TodoErrorNotFound", () => Effect.logError(`Failed to find todo with id: ${id}`)),
          Effect.flatMap(() => Effect.logInfo(`Deleted todo with id: ${id}`)),
          Effect.catchAll(Effect.die)
        ),
      readAll: () =>
        client.todo.readAll({ urlParams: {} }).pipe(
          Effect.flatMap((todo) => Effect.logInfo(todo)),
          Effect.catchAll(Effect.die)
        ),
      readById: (id) =>
        client.todo.readById({ path: { id } }).pipe(
          Effect.catchTag("TodoErrorNotFound", () => Effect.logError(`Failed to find todo with id: ${id}`)),
          Effect.flatMap((todo) => Effect.logInfo(todo)),
          Effect.catchAll(Effect.die)
        ),
      update: (id) =>
        client.todo.update({ path: { id } }).pipe(
          Effect.catchTag("TodoErrorNotFound", () => Effect.logError(`Failed to find todo with id: ${id}`)),
          Effect.flatMap((todo) => Effect.logInfo("Marked todo done: ", todo)),
          Effect.catchAll(Effect.die)
        )
    })
  })
)
