import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { GroupPersonTodo } from "@template/domain/vw/application/GroupPersonTodoApplicationDomain"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class VWPortDriven extends Context.Tag("VWPortDriven")<VWPortDriven, {
  readAllGroupPersonTodo: (
    urlParams: URLParams<GroupPersonTodo>
  ) => Effect.Effect<SuccessArray<GroupPersonTodo, never, never>>
}>() {}
