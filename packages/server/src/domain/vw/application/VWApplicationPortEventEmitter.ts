import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { GroupPersonTodo } from "@template/domain/vw/application/GroupPersonTodoApplicationDomain"
import type * as Exit from "effect/Exit"
import { PortEventEmitter } from "../../../infrastructure/application/PortEventEmitter.js"

type VWEvents = {
  VWUseCaseReadAllGroupPersonTodo: {
    in: { urlParams: URLParams<GroupPersonTodo> }
    out: Exit.Exit<SuccessArray<GroupPersonTodo, never, never>>
  }
}

export const VWPortEventEmitter = PortEventEmitter<VWEvents>()
