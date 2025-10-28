import type { ActorAuthorized } from "@template/domain/Actor"
import type { Service, ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import type { ServiceErrorAlreadyExists } from "@template/domain/service/application/ServiceApplicationErrorAlreadyExists"
import type { ServiceErrorNotFound } from "@template/domain/service/application/ServiceApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class ServicePortDriving extends Context.Tag("ServicePortDriving")<ServicePortDriving, {
  create: (
    service: Omit<Service, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) => Effect.Effect<
    ServiceId,
    ServiceErrorAlreadyExists,
    ActorAuthorized<"Service", "create">
  >
  delete: (id: ServiceId) => Effect.Effect<ServiceId, ServiceErrorNotFound, ActorAuthorized<"Service", "delete">>
  readAll: (
    urlParams: URLParams<Service>
  ) => Effect.Effect<SuccessArray<Service, never, never>, never, ActorAuthorized<"Service", "readAll">>
  readById: (id: ServiceId) => Effect.Effect<Service, ServiceErrorNotFound, ActorAuthorized<"Service", "readById">>
  update: (
    id: ServiceId,
    service: Partial<Omit<Service, "id" | "createdAt" | "updatedAt" | "deletedAt">>
  ) => Effect.Effect<ServiceId, ServiceErrorAlreadyExists | ServiceErrorNotFound, ActorAuthorized<"Service", "update">>
}>() {}
