import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { policy } from "../../../util/Policy.js"
import { ServicePortPolicy } from "../application/ServiceApplicationPortPolicy.js"

const canCreate = (
  id: ServiceId
): Effect.Effect<ActorAuthorized<"Service", "create">, ActorErrorUnauthorized, Actor> =>
  policy("Service", "create", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
    ))

const canDelete = (
  id: ServiceId
): Effect.Effect<ActorAuthorized<"Service", "delete">, ActorErrorUnauthorized, Actor> =>
  policy("Service", "delete", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
    ))

const canReadAll = (
  id: ServiceId
): Effect.Effect<ActorAuthorized<"Service", "readAll">, ActorErrorUnauthorized, Actor> =>
  policy("Service", "readAll", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
    ))

const canReadById = (
  id: ServiceId
): Effect.Effect<ActorAuthorized<"Service", "readById">, ActorErrorUnauthorized, Actor> =>
  policy("Service", "readById", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
    ))

const canUpdate = (
  id: ServiceId
): Effect.Effect<ActorAuthorized<"Service", "update">, ActorErrorUnauthorized, Actor> =>
  policy("Service", "update", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("ServicePolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
    ))

export const ServicePolicy = Layer.effect(
  ServicePortPolicy,
  Effect.sync(() => ({
    canCreate,
    canDelete,
    canReadAll,
    canReadById,
    canUpdate
  }))
)
