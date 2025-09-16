import type { Service, ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import type { ServiceErrorAlreadyExists } from "@template/domain/service/application/ServiceApplicationErrorAlreadyExists"
import type { ServiceErrorNotFound } from "@template/domain/service/application/ServiceApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Context, type Effect } from "effect"

export class ServicePortDriven extends Context.Tag("ServicePortDriven")<ServicePortDriven, {
  create: (
    service: Omit<Service, "createdAt" | "updatedAt" | "deletedAt">
  ) => Effect.Effect<ServiceId, ServiceErrorAlreadyExists, never>
  delete: (id: ServiceId) => Effect.Effect<ServiceId, ServiceErrorNotFound, never>
  readAll: (urlParams: URLParams<Service>) => Effect.Effect<SuccessArray<Service, never, never>>
  readById: (id: ServiceId) => Effect.Effect<Service, ServiceErrorNotFound, never>
  readByIds: (ids: Array<ServiceId>) => Effect.Effect<Array<Service>, ServiceErrorNotFound, never>
  update: (
    id: ServiceId,
    service: Partial<Omit<Service, "id" | "createdAt" | "updatedAt" | "deletedAt">>
  ) => Effect.Effect<ServiceId, ServiceErrorAlreadyExists | ServiceErrorNotFound, never>
}>() {}
