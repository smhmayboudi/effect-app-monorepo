import { Effect, Layer } from "effect"
import { PortTodoDriving } from "./port-todo-driving.js"
import { PortTodoDriven } from "./port-todo-driven.js"
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"
import { policyRequire } from "../../../util/policy.js"
import { ActorAuthorized } from "@template/domain/actor"

export const TodoUseCase = Layer.effect(
  PortTodoDriving,
  Effect.gen(function* () {
    const driven = yield* PortTodoDriven

    const create = (todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">): Effect.Effect<TodoId, ErrorTodoAlreadyExists, ActorAuthorized<"Todo", "create">> =>
      driven.create(todo)
        .pipe(
          Effect.withSpan("todo.use-case.create", { attributes: { todo } }),
          policyRequire("Todo", "create")
        )

    const del = (id: TodoId): Effect.Effect<TodoId, ErrorTodoNotFound, ActorAuthorized<"Todo", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("todo.use-case.delete", { attributes: { id } }),
          policyRequire("Todo", "delete")
        )

    const readAll = (): Effect.Effect<DomainTodo[], never, ActorAuthorized<"Todo", "readAll">> =>
      driven.readAll().pipe(
        Effect.withSpan("todo.use-case.readAll"),
        policyRequire("Todo", "readAll")
      )

    const readById = (id: TodoId): Effect.Effect<DomainTodo, ErrorTodoNotFound, ActorAuthorized<"Todo", "readById">> =>
      driven.readById(id).pipe(
        Effect.withSpan("todo.use-case.readById", { attributes: { id } }),
        policyRequire("Todo", "readById")
      )

    const update = (id: TodoId, todo: Partial<Omit<DomainTodo, "id">>): Effect.Effect<TodoId, ErrorTodoNotFound, ActorAuthorized<"Todo", "update">> =>
      driven.update(id, todo)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("todo.use-case.update", { attributes: { id, todo } }),
          policyRequire("Todo", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
