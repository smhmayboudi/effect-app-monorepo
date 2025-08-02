import { Effect, Layer } from "effect"
import { PortTodoDriving } from "@template/server/domain/todo/application/port-todo-driving"
import { PortTodoDriven } from "@template/server/domain/todo/application/port-todo-driven"
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"
import { policyRequire } from "@template/server/util/policy"
import { ActorAuthorized } from "@template/domain/actor"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const TodoUseCase = Layer.effect(
  PortTodoDriving,
  Effect.gen(function* () {
    const driven = yield* PortTodoDriven

    const create = (todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">): Effect.Effect<TodoId, ErrorTodoAlreadyExists, ActorAuthorized<"Todo", "create">> =>
      driven.create(todo)
        .pipe(
          Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", todo }}),
          policyRequire("Todo", "create")
        )

    const del = (id: TodoId): Effect.Effect<TodoId, ErrorTodoNotFound, ActorAuthorized<"Todo", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
          policyRequire("Todo", "delete")
        )

    const readAll = (): Effect.Effect<DomainTodo[], never, ActorAuthorized<"Todo", "readAll">> =>
      driven.readAll().pipe(
        Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
        policyRequire("Todo", "readAll")
      )

    const readById = (id: TodoId): Effect.Effect<DomainTodo, ErrorTodoNotFound, ActorAuthorized<"Todo", "readById">> =>
      driven.readById(id).pipe(
        Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id }}),
        policyRequire("Todo", "readById")
      )

    const update = (id: TodoId, todo: Partial<Omit<DomainTodo, "id">>): Effect.Effect<TodoId, ErrorTodoNotFound, ActorAuthorized<"Todo", "update">> =>
      driven.update(id, todo)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, todo }}),
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
