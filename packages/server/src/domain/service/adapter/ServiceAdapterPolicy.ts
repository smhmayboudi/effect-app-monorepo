import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { policy } from "../../../util/Policy.js"
import { ServicePortPolicy } from "../application/ServiceApplicationPortPolicy.js"

export const ServicePolicy = Layer.succeed(
  ServicePortPolicy,
  ServicePortPolicy.of({
    canCreate: (id) =>
      policy("Service", "create", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
        )),
    canDelete: (id) =>
      policy("Service", "delete", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
        )),
    canReadAll: (id) =>
      policy("Service", "readAll", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
        )),
    canReadById: (id) =>
      policy("Service", "readById", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
        )),
    canUpdate: (id) =>
      policy("Service", "update", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
        ))
  })
)
