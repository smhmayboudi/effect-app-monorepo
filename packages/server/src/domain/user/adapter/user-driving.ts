import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortUserDriving } from "@template/server/domain/user/application/port-user-driving"
import { UserId } from "@template/domain/user/application/domain-user"
import { PortUserPolicy } from "@template/server/domain/user/application/user-policy"
import { policyUse, withSystemActor } from "@template/server/util/policy"
import { DomainActor } from "@template/domain/actor"
import { MiddlewareAuthentication } from "@template/domain/middleware-authentication"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { response } from "@template/server/shared/application/response"

export const UserDriving = HttpApiBuilder.group(Api, "user", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortUserDriving
    const policy = yield* PortUserPolicy

    return handlers
      .handle("create", ({ payload }) =>
        driving.create(payload).pipe(
          Effect.tap((user) => HttpApiBuilder.securitySetCookie(
            MiddlewareAuthentication.security.cookie,
            user.accessToken
          )),
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", user: payload }}),
          withSystemActor,
          response
        )
      )
      .handle("delete", ({ path: { id }}) =>
        driving.delete(id).pipe(
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
          policyUse(policy.canDelete(UserId.make(0))),
          response
        )
      )
      .handle("readAll", () =>
        driving.readAll().pipe(
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
          policyUse(policy.canReadAll(UserId.make(0))),
          response
        )
      )
      .handle("readById", ({ path: { id }}) =>
        driving.readById(id).pipe(
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id }}),
          policyUse(policy.canReadById(UserId.make(0))),
          response
        )
      )
      .handle("readByIdWithSensitive", () =>
        DomainActor.pipe(
          Effect.flatMap((user) => driving.readByIdWithSensitive(user.id).pipe(
            Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive", id: user.id }}),
          )),
          withSystemActor,
          response
        )
      )
      .handle("update", ({ path: { id }, payload }) =>
        driving.update(id, payload).pipe(
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, user: payload }}),
          policyUse(policy.canUpdate(UserId.make(0))),
          response
        )
      )
  }))
