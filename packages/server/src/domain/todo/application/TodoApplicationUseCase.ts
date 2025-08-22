import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { Todo } from "@template/domain/todo/application/TodoApplicationDomain"
import { TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import type { TodoErrorAlreadyExists } from "@template/domain/todo/application/TodoApplicationErrorAlreadyExists"
import type { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import { Effect, Exit, Layer } from "effect"
import { PortUUID } from "../../../infrastructure/application/PortUUID.js"
import { policyRequire } from "../../../util/Policy.js"
import { makeTodoReadResolver, TodoReadById } from "./TodoApplicationCache.js"
import { TodoPortDriven } from "./TodoApplicationPortDriven.js"
import { TodoPortDriving } from "./TodoApplicationPortDriving.js"
import { TodoPortEventEmitter } from "./TodoApplicationPortEventEmitter.js"

export const TodoUseCase = Layer.scoped(
  TodoPortDriving,
  Effect.gen(function*() {
    const uuid = yield* PortUUID
    const driven = yield* TodoPortDriven
    const eventEmitter = yield* TodoPortEventEmitter
    const resolver = yield* makeTodoReadResolver

    const create = (
      todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "deletedAt">
    ): Effect.Effect<TodoId, TodoErrorAlreadyExists, ActorAuthorized<"Todo", "create">> =>
      uuid.v7().pipe(
        Effect.flatMap((v7) =>
          driven.create({ ...todo, id: TodoId.make(v7) }).pipe(
            Effect.tapBoth({
              onFailure: (out) =>
                eventEmitter.emit("TodoUseCaseCreate", {
                  in: { todo: { ...todo, id: TodoId.make(v7) } },
                  out: Exit.fail(out)
                }),
              onSuccess: (out) =>
                eventEmitter.emit("TodoUseCaseCreate", {
                  in: { todo: { ...todo, id: TodoId.make(v7) } },
                  out: Exit.succeed(out)
                })
            }),
            Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", todo } }),
            policyRequire("Todo", "create")
          )
        )
      )

    const del = (id: TodoId): Effect.Effect<TodoId, TodoErrorNotFound, ActorAuthorized<"Todo", "delete">> =>
      driven.delete(id).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("TodoUseCaseDelete", {
              in: { id },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("TodoUseCaseDelete", {
              in: { id },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
        policyRequire("Todo", "delete")
      )

    const readAll = (
      urlParams: URLParams<Todo>
    ): Effect.Effect<SuccessArray<Todo, never, never>, never, ActorAuthorized<"Todo", "readAll">> =>
      driven.readAll(urlParams).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("TodoUseCaseReadAll", {
              in: { urlParams },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("TodoUseCaseReadAll", {
              in: { urlParams },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
        policyRequire("Todo", "readAll")
      )

    const readById = (id: TodoId): Effect.Effect<Todo, TodoErrorNotFound, ActorAuthorized<"Todo", "readById">> =>
      Effect.request(new TodoReadById({ id }), resolver).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("TodoUseCaseReadById", {
              in: { id },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("TodoUseCaseReadById", {
              in: { id },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
        policyRequire("Todo", "readById")
      )

    const update = (
      id: TodoId,
      todo: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt" | "deletedAt">>
    ): Effect.Effect<TodoId, TodoErrorNotFound, ActorAuthorized<"Todo", "update">> =>
      driven.update(id, todo).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("TodoUseCaseUpdate", {
              in: { id, todo },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("TodoUseCaseUpdate", {
              in: { id, todo },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, todo } }),
        policyRequire("Todo", "update")
      )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
