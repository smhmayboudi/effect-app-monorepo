import * as expRequestResolver from "@effect/experimental/RequestResolver"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Service, ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { ServiceErrorNotFound } from "@template/domain/service/application/ServiceApplicationErrorNotFound"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as PrimaryKey from "effect/PrimaryKey"
import * as RequestResolver from "effect/RequestResolver"
import * as Schema from "effect/Schema"
import { ServiceConfig } from "./ServiceApplicationConfig.js"
import { ServicePortDriven } from "./ServiceApplicationPortDriven.js"

export class ServiceReadById extends Schema.TaggedRequest<ServiceReadById>("ServiceReadById")("ServiceReadById", {
  failure: ServiceErrorNotFound,
  payload: { id: ServiceId },
  success: Service
}) {
  [PrimaryKey.symbol]() {
    return `ServiceReadById:${this.id}`
  }
}

export const makeServiceReadResolver = Effect.all([ServiceConfig, ServicePortDriven]).pipe(
  Effect.flatMap(([{ cacheTTLMs }, driven]) =>
    RequestResolver.fromEffectTagged<ServiceReadById>()({
      ServiceReadById: (requests) =>
        driven.readByIds(requests.map((req) => req.id)).pipe(
          Effect.withSpan("ServiceUseCase", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "ServiceReadById", requests }
          }),
          Effect.tap(() => Effect.logDebug(`DB hit: ServiceReadById ${requests.length}`))
        )
    }).pipe(
      expRequestResolver.persisted({
        storeId: "Service",
        timeToLive: (_req, exit) => Exit.isSuccess(exit) ? cacheTTLMs : 0
      })
    )
  )
)
