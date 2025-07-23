import { HttpApiBuilder } from "@effect/platform"
import { TodoApi } from "@template/domain/TodoApi"
import { Effect, Layer } from "effect"
import { TodoRepository } from "./TodoRepository.js"

const TodoApiLive = HttpApiBuilder.group(TodoApi, "todo", (handlers) =>
  Effect.gen(function*() {
    const todoRepository = yield* TodoRepository
    return handlers
      .handle("create", ({ payload: { text } }) => todoRepository.create(text))
      .handle("delete", ({ path: { id } }) => todoRepository.del(id))
      .handle("readAll", () => todoRepository.readAll())
      .handle("readById", ({ path: { id } }) => todoRepository.readById(id))
      .handle("update", ({ path: { id } }) => todoRepository.update(id))
  }))

export const ApiLive = HttpApiBuilder.api(TodoApi).pipe(
  Layer.provide(TodoApiLive)
)
