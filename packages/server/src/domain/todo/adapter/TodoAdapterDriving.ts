import { HttpApiBuilder } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Actor } from "@template/domain/Actor"
import { Api } from "@template/domain/Api"
import { TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import { Effect } from "effect"
import { response } from "../../../shared/application/Response.js"
import { policyUse } from "../../../util/Policy.js"
import { TodoPortDriving } from "../application/TodoApplicationPortDriving.js"
import { TodoPortPolicy } from "../application/TodoApplicationPortPolicy.js"

export const TodoDriving = HttpApiBuilder.group(Api, "todo", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* TodoPortDriving
    const policy = yield* TodoPortPolicy

    return handlers
      .handle("create", ({ payload }) =>
        Actor.pipe(
          Effect.flatMap((user) =>
            driving.create({ ...payload, ownerId: user.ownerId, done: 0 }).pipe(
              Effect.withSpan("TodoDriving", {
                attributes: {
                  [ATTR_CODE_FUNCTION_NAME]: "create",
                  todo: { ...payload, ownerId: user.ownerId, done: 0 }
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
      .handle("readAll", ({ urlParams }) =>
        driving.readAll(urlParams).pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
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
        driving.update(id, { done: 1 }).pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", todo: { done: 1 } } }),
          policyUse(policy.canUpdate(TodoId.make(0))),
          response
        ))
  }))
