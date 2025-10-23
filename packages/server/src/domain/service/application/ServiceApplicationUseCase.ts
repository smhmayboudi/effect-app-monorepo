import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { WorkflowSendEmail } from "@template/workflow/WorkflowSendEmail"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import { PortUUID } from "../../../infrastructure/application/PortUUID.js"
import { policyRequire } from "../../../util/Policy.js"
import { makeServiceReadResolver, ServiceReadById } from "./ServiceApplicationCache.js"
import { ServicePortDriven } from "./ServiceApplicationPortDriven.js"
import { ServicePortDriving } from "./ServiceApplicationPortDriving.js"
import { ServicePortEventEmitter } from "./ServiceApplicationPortEventEmitter.js"

export const ServiceUseCase = Layer.scoped(
  ServicePortDriving,
  Effect.all([PortUUID, ServicePortDriven, ServicePortEventEmitter, makeServiceReadResolver]).pipe(
    Effect.andThen(([uuid, driven, eventEmitter, resolver]) =>
      ServicePortDriving.of({
        create: (service) =>
          uuid.v7().pipe(
            Effect.flatMap((v7) =>
              driven.create({ ...service, id: ServiceId.make(v7) }).pipe(
                Effect.tap((out) =>
                  WorkflowSendEmail.execute({ id: out, to: out }).pipe(Effect.catchTag("SendEmailError", Effect.die))
                ),
                Effect.tapBoth({
                  onFailure: (out) =>
                    eventEmitter.emit("ServiceUseCaseCreate", {
                      in: { service: { ...service, id: ServiceId.make(v7) } },
                      out: Exit.fail(out)
                    }),
                  onSuccess: (out) =>
                    eventEmitter.emit("ServiceUseCaseCreate", {
                      in: { service: { ...service, id: ServiceId.make(v7) } },
                      out: Exit.succeed(out)
                    })
                }),
                Effect.withSpan("ServiceUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", service } }),
                policyRequire("Service", "create")
              )
            )
          ),
        delete: (id) =>
          driven.delete(id).pipe(
            Effect.tapBoth({
              onFailure: (out) =>
                eventEmitter.emit("ServiceUseCaseDelete", {
                  in: { id },
                  out: Exit.fail(out)
                }),
              onSuccess: (out) =>
                eventEmitter.emit("ServiceUseCaseDelete", {
                  in: { id },
                  out: Exit.succeed(out)
                })
            }),
            Effect.withSpan("ServiceUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
            policyRequire("Service", "delete")
          ),
        readAll: (urlParams) =>
          driven.readAll(urlParams).pipe(
            Effect.tapBoth({
              onFailure: (out) =>
                eventEmitter.emit("ServiceUseCaseReadAll", {
                  in: { urlParams },
                  out: Exit.fail(out)
                }),
              onSuccess: (out) =>
                eventEmitter.emit("ServiceUseCaseReadAll", {
                  in: { urlParams },
                  out: Exit.succeed(out)
                })
            }),
            Effect.withSpan("ServiceUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
            policyRequire("Service", "readAll")
          ),
        readById: (id) =>
          Effect.request(new ServiceReadById({ id }), resolver).pipe(
            Effect.tapBoth({
              onFailure: (out) =>
                eventEmitter.emit("ServiceUseCaseReadById", {
                  in: { id },
                  out: Exit.fail(out)
                }),
              onSuccess: (out) =>
                eventEmitter.emit("ServiceUseCaseReadById", {
                  in: { id },
                  out: Exit.succeed(out)
                })
            }),
            Effect.withSpan("ServiceUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
            policyRequire("Service", "readById")
          ),
        update: (id, service) =>
          driven.update(id, service).pipe(
            Effect.tapBoth({
              onFailure: (out) =>
                eventEmitter.emit("ServiceUseCaseUpdate", {
                  in: { id, service },
                  out: Exit.fail(out)
                }),
              onSuccess: (out) =>
                eventEmitter.emit("ServiceUseCaseUpdate", {
                  in: { id, service },
                  out: Exit.succeed(out)
                })
            }),
            Effect.withSpan("ServiceUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, service } }),
            policyRequire("Service", "update")
          )
      })
    )
  )
)
