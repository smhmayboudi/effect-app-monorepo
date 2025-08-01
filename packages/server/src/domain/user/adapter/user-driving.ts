import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortUserDriving } from "../application/port-user-driving.js"
import { UserId } from "@template/domain/user/application/domain-user"
import { PortUserPolicy } from "../application/user-policy.js"
import { policyUse, withSystemActor } from "../../../util/policy.js"
import { DomainActor } from "@template/domain/actor"
import { MiddlewareAuthentication } from "@template/domain/middleware-authentication"

export const UserDriving = HttpApiBuilder.group(Api, "user", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortUserDriving
    const policy = yield* PortUserPolicy

    return handlers
      .handle("create", ({ payload }) =>
        driving.create(payload).pipe(
          withSystemActor,
          Effect.tap((user) => HttpApiBuilder.securitySetCookie(
            MiddlewareAuthentication.security.cookie,
            user.accessToken
          )),
        )
      )
      .handle("delete", ({ path: { id } }) =>
        driving.delete(id).pipe(
          policyUse(policy.canDelete(UserId.make(0)))
        )
      )
      .handle("readAll", () =>
        driving.readAll().pipe(
          policyUse(policy.canReadAll(UserId.make(0)))
        )
      )
      .handle("readById", ({ path: { id } }) =>
        driving.readById(id).pipe(
          policyUse(policy.canReadById(UserId.make(0)))
        )
      )
      .handle("readByIdWithSensitive", () =>
        DomainActor.pipe(
          Effect.flatMap((user) => driving.readByIdWithSensitive(user.id)),
          withSystemActor
        )
      )
      .handle("update", ({ path: { id }, payload }) =>
        driving.update(id, payload).pipe(
          policyUse(policy.canUpdate(UserId.make(0)))
        )
      )
  }))
