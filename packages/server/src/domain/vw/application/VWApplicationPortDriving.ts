import type { ActorAuthorized } from "@template/domain/Actor"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { GroupPersonTodo } from "@template/domain/vw/application/GroupPersonTodoApplicationDomain"
import { Context, type Effect } from "effect"

export class VWPortDriving extends Context.Tag("VWPortDriving")<VWPortDriving, {
  readAllGroupPersonTodo: (
    urlParams: URLParams<GroupPersonTodo>
  ) => Effect.Effect<
    SuccessArray<GroupPersonTodo, never, never>,
    never,
    ActorAuthorized<"VW", "readAllGroupPersonTodo">
  >
}>() {}
