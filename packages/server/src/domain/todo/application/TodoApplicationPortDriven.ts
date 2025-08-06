import type { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import type { TodoErrorAlreadyExists } from "@template/domain/todo/application/TodoApplicationErrorAlreadyExists"
import type { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import { Context, type Effect } from "effect"

export class TodoPortDriven extends Context.Tag("TodoPortDriven")<TodoPortDriven, {
  create: (
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<TodoId, TodoErrorAlreadyExists, never>
  delete: (id: TodoId) => Effect.Effect<TodoId, TodoErrorNotFound, never>
  readAll: () => Effect.Effect<Array<Todo>, never, never>
  readById: (id: TodoId) => Effect.Effect<Todo, TodoErrorNotFound, never>
  update: (
    id: TodoId,
    todo: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<TodoId, TodoErrorNotFound, never>
}>() {}
