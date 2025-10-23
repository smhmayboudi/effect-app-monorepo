import type { Service, ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import type { ServiceErrorAlreadyExists } from "@template/domain/service/application/ServiceApplicationErrorAlreadyExists"
import type { ServiceErrorNotFound } from "@template/domain/service/application/ServiceApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type * as Exit from "effect/Exit"
import { PortEventEmitter } from "../../../infrastructure/application/PortEventEmitter.js"

type ServiceEvents = {
  ServiceUseCaseCreate: {
    in: { service: Omit<Service, "createdAt" | "updatedAt" | "deletedAt"> }
    out: Exit.Exit<ServiceId, ServiceErrorAlreadyExists>
  }
  ServiceUseCaseDelete: { in: { id: ServiceId }; out: Exit.Exit<ServiceId, ServiceErrorNotFound> }
  ServiceUseCaseReadAll: {
    in: { urlParams: URLParams<Service> }
    out: Exit.Exit<SuccessArray<Service, never, never>>
  }
  ServiceUseCaseReadById: { in: { id: ServiceId }; out: Exit.Exit<Service, ServiceErrorNotFound> }
  ServiceUseCaseUpdate: {
    in: { id: ServiceId; service: Partial<Omit<Service, "id" | "createdAt" | "updatedAt" | "deletedAt">> }
    out: Exit.Exit<ServiceId, ServiceErrorAlreadyExists | ServiceErrorNotFound>
  }
}

export const ServicePortEventEmitter = PortEventEmitter<ServiceEvents>()
