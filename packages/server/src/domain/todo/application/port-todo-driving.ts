import { Context, Effect } from "effect"
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"

export class PortTodoDriving extends Context.Tag("PortTodoDriving")<PortTodoDriving, {
  create: (todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">) => Effect.Effect<TodoId, ErrorTodoAlreadyExists, never>
  delete: (id: TodoId) => Effect.Effect<TodoId, ErrorTodoNotFound, never>
  readAll: () => Effect.Effect<DomainTodo[], never, never>
  readById: (id: TodoId) => Effect.Effect<DomainTodo, ErrorTodoNotFound, never>
  update: (id: TodoId, todo: Partial<Omit<DomainTodo, "id">>) => Effect.Effect<TodoId, ErrorTodoNotFound, never>
}>() {}
