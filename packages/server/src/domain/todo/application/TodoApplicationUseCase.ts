import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import { PortUUID } from "../../../infrastructure/application/PortUUID.js"
import { policyRequire } from "../../../util/Policy.js"
import { makeTodoReadResolver, TodoReadById } from "./TodoApplicationCache.js"
import { TodoPortDriven } from "./TodoApplicationPortDriven.js"
import { TodoPortDriving } from "./TodoApplicationPortDriving.js"
import { TodoPortEventEmitter } from "./TodoApplicationPortEventEmitter.js"

export const TodoUseCase = Layer.scoped(
  TodoPortDriving,
  Effect.all([PortUUID, TodoPortDriven, TodoPortEventEmitter, makeTodoReadResolver]).pipe(
    Effect.andThen(([uuid, driven, eventEmitter, resolver]) =>
      TodoPortDriving.of({
        create: (todo) =>
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
          ),
        delete: (id) =>
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
          ),
        readAll: (urlParams) =>
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
          ),
        readById: (id) =>
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
          ),
        update: (id, todo) =>
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
      })
    )
  )
)
