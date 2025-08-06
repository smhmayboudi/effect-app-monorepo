import { HttpApiBuilder } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Actor } from "@template/domain/Actor"
import { Api } from "@template/domain/Api"
import { MiddlewareAuthentication } from "@template/domain/MiddlewareAuthentication"
import { UserId } from "@template/domain/user/application/UserApplicationDomain"
import { Effect } from "effect"
import { response } from "../../../shared/application/Response.js"
import { policyUse, withSystemActor } from "../../../util/policy.js"
import { UserPortDriving } from "../application/UserApplicationPortDriving.js"
import { UserPortPolicy } from "../application/UserApplicationPortPolicy.js"

export const UserDriving = HttpApiBuilder.group(Api, "user", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* UserPortDriving
    const policy = yield* UserPortPolicy

    return handlers
      .handle("create", ({ payload }) =>
        driving.create(payload).pipe(
          Effect.tap((user) =>
            HttpApiBuilder.securitySetCookie(
              MiddlewareAuthentication.security.cookie,
              user.accessToken
            )
          ),
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", user: payload } }),
          withSystemActor,
          response
        ))
      .handle("delete", ({ path: { id } }) =>
        driving.delete(id).pipe(
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyUse(policy.canDelete(UserId.make(0))),
          response
        ))
      .handle("readAll", () =>
        driving.readAll().pipe(
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } }),
          policyUse(policy.canReadAll(UserId.make(0))),
          response
        ))
      .handle("readById", ({ path: { id } }) =>
        driving.readById(id).pipe(
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
          policyUse(policy.canReadById(UserId.make(0))),
          response
        ))
      .handle("readByIdWithSensitive", () =>
        Actor.pipe(
          Effect.flatMap((user) =>
            driving.readByIdWithSensitive(user.id).pipe(
              Effect.withSpan("UserDriving", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readByIdWithSensitive", id: user.id }
              })
            )
          ),
          withSystemActor,
          response
        ))
      .handle("update", ({ path: { id }, payload }) =>
        driving.update(id, payload).pipe(
          Effect.withSpan("UserDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, user: payload } }),
          policyUse(policy.canUpdate(UserId.make(0))),
          response
        ))
  }))
