import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { UserGroupPerson } from "@template/domain/vw/application/UserGroupPersonApplicationDomain"
import type { UserTodo } from "@template/domain/vw/application/UserTodoApplicationDomain"
import { Context, type Effect } from "effect"

export class VWPortDriven extends Context.Tag("VWPortDriven")<VWPortDriven, {
  readAllUserGroupPerson: (
    urlParams: URLParams<UserGroupPerson>
  ) => Effect.Effect<SuccessArray<UserGroupPerson, never, never>>
  readAllUserTodo: (urlParams: URLParams<UserTodo>) => Effect.Effect<SuccessArray<UserTodo, never, never>>
}>() {}
