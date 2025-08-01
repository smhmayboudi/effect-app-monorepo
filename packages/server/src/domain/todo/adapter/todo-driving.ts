import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortTodoDriving } from "../application/port-todo-driving.js"
import { AccountId } from "@template/domain/account/application/domain-account"
import { PortTodoPolicy } from "../../todo/application/todo-policy.js"
import { policyUse } from "../../../util/policy.js"
import { TodoId } from "@template/domain/todo/application/domain-todo"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const TodoDriving = HttpApiBuilder.group(Api, "todo", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortTodoDriving
    const policy = yield* PortTodoPolicy

    return handlers
      .handle("create", ({ payload }) =>
        driving.create({ ...payload, ownerId: AccountId.make(0), done: false }).pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create" }}),
          policyUse(policy.canCreate(TodoId.make(0)))
        )
      )
      .handle("delete", ({ path: { id } }) =>
        driving.delete(id).pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete" }}),
          policyUse(policy.canDelete(TodoId.make(0)))
        )
      )
      .handle("readAll", () =>
        driving.readAll().pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
          policyUse(policy.canReadAll(TodoId.make(0)))
        )
      )
      .handle("readById", ({ path: { id } }) =>
        driving.readById(id).pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById" }}),
          policyUse(policy.canReadById(TodoId.make(0)))
        )
      )
      .handle("update", ({ path: { id } }) =>
        driving.update(id, { done: true }).pipe(
          Effect.withSpan("TodoDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update" }}),
          policyUse(policy.canUpdate(TodoId.make(0)))
        )
      )
  }))
