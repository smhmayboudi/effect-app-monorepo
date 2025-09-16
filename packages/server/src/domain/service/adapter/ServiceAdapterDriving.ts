import { HttpApiBuilder } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Actor, ActorId } from "@template/domain/Actor"
import { Api } from "@template/domain/Api"
import { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { Effect } from "effect"
import { response, responseArray } from "../../../shared/adapter/Response.js"
import { policyUse } from "../../../util/Policy.js"
import { ServicePortDriving } from "../application/ServiceApplicationPortDriving.js"
import { ServicePortPolicy } from "../application/ServiceApplicationPortPolicy.js"

export const ServiceDriving = HttpApiBuilder.group(
  Api,
  "service",
  (handlers) =>
    Effect.all([ServicePortDriving, ServicePortPolicy]).pipe(
      Effect.flatMap(([driving, policy]) =>
        Effect.sync(() =>
          handlers
            .handle("create", ({ payload }) =>
              Actor.pipe(
                Effect.flatMap((user) =>
                  driving.create({ ...payload, ownerId: ActorId.make(user.id) }).pipe(
                    Effect.withSpan("ServiceDriving", {
                      attributes: {
                        [ATTR_CODE_FUNCTION_NAME]: "create",
                        service: { ...payload, ownerId: ActorId.make(user.id) }
                      }
                    })
                  )
                ),
                policyUse(policy.canCreate(ServiceId.make("00000000-0000-0000-0000-000000000000"))),
                response
              ))
            .handle("delete", ({ path: { id } }) =>
              driving.delete(id).pipe(
                Effect.withSpan("ServiceDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
                policyUse(policy.canDelete(ServiceId.make("00000000-0000-0000-0000-000000000000"))),
                response
              ))
            .handle("readAll", ({ urlParams }) =>
              driving.readAll(urlParams).pipe(
                Effect.withSpan("ServiceDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
                policyUse(policy.canReadAll(ServiceId.make("00000000-0000-0000-0000-000000000000"))),
                responseArray(urlParams)
              ))
            .handle("readById", ({ path: { id } }) =>
              driving.readById(id).pipe(
                Effect.withSpan("ServiceDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
                policyUse(policy.canReadById(ServiceId.make("00000000-0000-0000-0000-000000000000"))),
                response
              ))
            .handle("update", ({ path: { id }, payload }) =>
              driving.update(id, payload).pipe(
                Effect.withSpan("ServiceDriving", {
                  attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", service: payload }
                }),
                policyUse(policy.canUpdate(ServiceId.make("00000000-0000-0000-0000-000000000000"))),
                response
              ))
        )
      )
    )
)
