import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { UserGroupPerson } from "@template/domain/vw/application/UserGroupPersonApplicationDomain"
import type { UserTodo } from "@template/domain/vw/application/UserTodoApplicationDomain"
import type { Exit } from "effect"
import { PortEventEmitter } from "../../../infrastructure/application/PortEventEmitter.js"

type VWEvents = {
  VWUseCaseReadAllUserGroupPerson: {
    in: { urlParams: URLParams<UserGroupPerson> }
    out: Exit.Exit<SuccessArray<UserGroupPerson, never, never>>
  }
  VWUseCaseReadAllUserTodo: {
    in: { urlParams: URLParams<UserTodo> }
    out: Exit.Exit<SuccessArray<UserTodo, never, never>>
  }
}

export const VWPortEventEmitter = PortEventEmitter<VWEvents>()
