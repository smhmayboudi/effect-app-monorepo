import { HttpApiBuilder } from "@effect/platform"
import { TodosApi } from "@template/domain/TodosApi"
import { Effect, Layer } from "effect"
import { TodosRepository } from "./TodosRepository.js"

const TodosApiLive = HttpApiBuilder.group(TodosApi, "todos", (handlers) =>
  Effect.gen(function*() {
    const todos = yield* TodosRepository
    return handlers
      .handle("create", ({ payload: { text } }) => todos.create(text))
      .handle("delete", ({ path: { id } }) => todos.del(id))
      .handle("readAll", () => todos.readAll())
      .handle("readById", ({ path: { id } }) => todos.readById(id))
      .handle("update", ({ path: { id } }) => todos.update(id))
  }))

export const ApiLive = HttpApiBuilder.api(TodosApi).pipe(
  Layer.provide(TodosApiLive)
)
