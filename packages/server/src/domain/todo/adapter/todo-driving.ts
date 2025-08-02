import { HttpApiBuilder } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { DomainActor } from "@template/domain/actor"
import { Api } from "@template/domain/api"
import { TodoId } from "@template/domain/todo/application/domain-todo"
import { PortTodoDriving } from "@template/server/domain/todo/application/port-todo-driving"
import { PortTodoPolicy } from "@template/server/domain/todo/application/todo-policy"
import { response } from "@template/server/shared/application/response"
import { policyUse } from "@template/server/util/policy"
import { Effect } from "effect"

export const TodoDriving = HttpApiBuilder.group(Api, "todo", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortTodoDriving
    const policy = yield* PortTodoPolicy

    return handlers
      .handle("create", ({ payload }) =>
        DomainActor.pipe(
          Effect.flatMap((user) =>
            driving.create({ ...payload, ownerId: user.ownerId, done: false }).pipe(
              Effect.withSpan("TodoDriving", {
                attributes: {
                  [ATTR_CODE_FUNCTION_NAME]: "create",
                  todo: { ...payload, ownerId: user.ownerId, done: false }
                }
              })
            )
          ),
          policyUse(policy.canCreate(TodoId.make(0))),
          response
        ))
      .handle("delete", ({ path: { id } }) =>
        driving.delete(id).pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyUse(policy.canDelete(TodoId.make(0))),
          response
        ))
      .handle("readAll", () =>
        driving.readAll().pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } }),
          policyUse(policy.canReadAll(TodoId.make(0))),
          response
        ))
      .handle("readById", ({ path: { id } }) =>
        driving.readById(id).pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
          policyUse(policy.canReadById(TodoId.make(0))),
          response
        ))
      .handle("update", ({ path: { id } }) =>
        driving.update(id, { done: true }).pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", todo: { done: true } } }),
          policyUse(policy.canUpdate(TodoId.make(0))),
          response
        ))
  }))
