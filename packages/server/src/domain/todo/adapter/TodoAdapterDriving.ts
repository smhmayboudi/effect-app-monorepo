import * as HttpApiBuilder from "@effect/platform/HttpApiBuilder"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Actor, ActorId } from "@template/domain/Actor"
import { Api } from "@template/domain/Api"
import { TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import * as Effect from "effect/Effect"
import { response, responseArray } from "../../../shared/adapter/Response.js"
import { policyUse } from "../../../util/Policy.js"
import { TodoPortDriving } from "../application/TodoApplicationPortDriving.js"
import { TodoPortPolicy } from "../application/TodoApplicationPortPolicy.js"

export const TodoDriving = HttpApiBuilder.group(
  Api,
  "todo",
  (handlers) =>
    Effect.all([TodoPortDriving, TodoPortPolicy]).pipe(
      Effect.flatMap(([driving, policy]) =>
        Effect.sync(() =>
          handlers
            .handle("create", ({ payload }) =>
              Actor.pipe(
                Effect.flatMap((user) =>
                  driving.create({ ...payload, ownerId: ActorId.make(user.id), done: 0 }).pipe(
                    Effect.withSpan("TodoDriving", {
                      attributes: {
                        [ATTR_CODE_FUNCTION_NAME]: "create",
                        todo: { ...payload, ownerId: ActorId.make(user.id), done: 0 }
                      }
                    })
                  )
                ),
                policyUse(policy.canCreate(TodoId.make("00000000-0000-0000-0000-000000000000"))),
                response
              ))
            .handle("delete", ({ path: { id } }) =>
              driving.delete(id).pipe(
                Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
                policyUse(policy.canDelete(TodoId.make("00000000-0000-0000-0000-000000000000"))),
                response
              ))
            .handle("readAll", ({ urlParams }) =>
              driving.readAll(urlParams).pipe(
                Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
                policyUse(policy.canReadAll(TodoId.make("00000000-0000-0000-0000-000000000000"))),
                responseArray(urlParams)
              ))
            .handle("readById", ({ path: { id } }) =>
              driving.readById(id).pipe(
                Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
                policyUse(policy.canReadById(TodoId.make("00000000-0000-0000-0000-000000000000"))),
                response
              ))
            .handle("update", ({ path: { id } }) =>
              driving.update(id, { done: 1 }).pipe(
                Effect.withSpan("TodoDriving", {
                  attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", todo: { done: 1 } }
                }),
                policyUse(policy.canUpdate(TodoId.make("00000000-0000-0000-0000-000000000000"))),
                response
              ))
        )
      )
    )
)
