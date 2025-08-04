import type { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"
import type { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import type { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { Context, type Effect } from "effect"

export class PortTodoDriven extends Context.Tag("PortTodoDriven")<PortTodoDriven, {
  create: (
    todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<TodoId, ErrorTodoAlreadyExists, never>
  delete: (id: TodoId) => Effect.Effect<void, ErrorTodoNotFound, never>
  readAll: () => Effect.Effect<Array<DomainTodo>, never, never>
  readById: (id: TodoId) => Effect.Effect<DomainTodo, ErrorTodoNotFound, never>
  update: (
    id: TodoId,
    todo: Partial<Omit<DomainTodo, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<void, ErrorTodoNotFound, never>
}>() {}
